import { Room, Client } from "@colyseus/core";
import {
  Action,
  Player,
  PokeBattleActions,
  PokeBattleGuessActions,
  PokeBattlePhase,
  PokeBattlePickActions,
  PokeBattleState,
  Pokemon,
  Round,
} from "../interfaces/PokeBattle.inferfaces";
import { getPokemonByNumber } from "../pokemons";
import { compareNumber, comparePartial, compareStrict } from "../utils/compare";

export class PokeBattle extends Room<PokeBattleState> {
  maxClients = 2;

  onCreate() {
    const roomState = new PokeBattleState();
    roomState.phase = PokeBattlePhase.WAITING;
    roomState.maxPokemons = 3;

    this.setState(roomState);
    this.onMessage("action", (client, message) => {
      console.log("action from", client.sessionId, message);
      this.playerAction(client, message);
    });
    console.log("Room Created!");
  }

  handlePickAction(client: Client, action: PokeBattlePickActions) {
    const currentPlayer = this.state.players.get(client.sessionId);
    const [, rivalPlayer] = [...this.state.players.entries()].find(
      ([id]) => id !== client.sessionId
    );

    switch (action.type) {
      case "PICK":
        if (
          currentPlayer.confirmed ||
          action.index < 0 ||
          action.index >= this.state.maxPokemons
        ) {
          client.send("ERROR", "Invalid Pokemon");
          return false;
        }
        if (
          [...currentPlayer.pokemons.values()].some(
            (pokemon) => pokemon.number === action.pokemon
          )
        ) {
          client.send(
            "ERROR",
            `You already have an ${
              getPokemonByNumber(action.pokemon).name
            } in your team!`
          );
          return false;
        }

        if (action.pokemon === -1) {
          currentPlayer.pokemons.delete(action.index.toString());
          return;
        }

        const newPokemon = new Pokemon();
        newPokemon.number = action.pokemon;
        currentPlayer.pokemons.set(action.index.toString(), newPokemon);
        return;
      case "CONFIRM":
        if (currentPlayer.pokemons.size < this.state.maxPokemons) {
          client.send(
            "ERROR",
            `You must pick ${this.state.maxPokemons} Pokemon`
          );
          return false;
        }

        currentPlayer.confirmed = true;

        let allConfirmed = true;
        this.state.players.forEach((player) => {
          if (!player.confirmed) allConfirmed = false;
        });

        if (allConfirmed) {
          this.state.currentRound = 0;
          this.state.rounds.push(new Round());
          this.state.phase = PokeBattlePhase.GUESS;
        }
        return;
    }
  }

  handleGuessAction(currentClient: Client, action: PokeBattleGuessActions) {
    if (
      this.state.rounds[this.state.currentRound].actions.get(
        currentClient.sessionId
      )
    ) {
      currentClient.send("ERROR", "Wait for your rival to take an action");
      return false;
    }

    const playerAction = new Action();
    playerAction.timestamp = Date.now();
    playerAction.type = action.type;
    if ("pokemon" in action) {
      playerAction.pokemon = action.pokemon;
    }

    this.state.rounds[this.state.currentRound].actions.set(
      currentClient.sessionId,
      playerAction
    );

    if (
      this.state.rounds[this.state.currentRound].actions.size ===
      this.maxClients
    ) {
      [...this.state.rounds[this.state.currentRound].actions.entries()]
        .sort(
          ([, actionA], [, actionB]) => actionA.timestamp - actionB.timestamp
        )
        .forEach(([clientId, action]) => {
          const [rivalSessionId, rivalPlayer] = [
            ...this.state.players.entries(),
          ].find(([id]) => id !== clientId);
          const rivalCurrentPokemon = rivalPlayer.pokemons.get(
            rivalPlayer.currentPokemon.toString()
          );

          switch (action.type) {
            case "GUESS":
              if (rivalCurrentPokemon.number === action.pokemon) {
                this.clients.getById(clientId).send("GUESS_RESULT", "CORRECT");
                rivalCurrentPokemon.guessed = true;
                rivalPlayer.currentPokemon = parseInt(
                  [...rivalPlayer.pokemons.entries()].find(
                    ([, p]) => !p.guessed
                  )?.[0] || "-1",
                  10
                );
                if (rivalPlayer.currentPokemon === -1) {
                  this.clients
                    .getById(clientId)
                    .send("MATCH_RESULT", "VICTORY");
                  this.clients
                    .getById(rivalSessionId)
                    .send("MATCH_RESULT", "DEFEAT");
                  this.state.phase = PokeBattlePhase.RESULTS;
                  this.state.winner = this.clients.getById(clientId).sessionId;
                }
                return;
              }
              const rivalPokemon = getPokemonByNumber(
                rivalPlayer.pokemons.get(rivalPlayer.currentPokemon.toString())
                  .number
              );
              const guessPokemon = getPokemonByNumber(action.pokemon);

              this.clients.getById(clientId).send("GUESS_RESULT", {
                result: {
                  stage: compareNumber(rivalPokemon.stage, guessPokemon.stage),
                  // TODO: adapt for multiple colors
                  color: compareStrict(
                    rivalPokemon.colors[0],
                    guessPokemon.colors[0]
                  ),
                  habitat: compareStrict(
                    rivalPokemon.habitat,
                    guessPokemon.habitat
                  ),
                  height: compareNumber(
                    rivalPokemon.height,
                    guessPokemon.height
                  ),
                  weight: compareNumber(
                    rivalPokemon.weight,
                    guessPokemon.weight
                  ),
                  type_1: comparePartial(
                    rivalPokemon.type_1,
                    rivalPokemon.type_2,
                    guessPokemon.type_1
                  ),
                  type_2: comparePartial(
                    rivalPokemon.type_2,
                    rivalPokemon.type_1,
                    guessPokemon.type_2
                  ),
                },
                pokemon: {
                  ...guessPokemon,
                  color: guessPokemon.colors.join(", "),
                },
                pokemonIndex: rivalPlayer.currentPokemon,
              });
          }
        });

      this.state.rounds.push(new Round());
      this.state.currentRound++;
    }
  }

  playerAction(client: Client, data: PokeBattleActions) {
    switch (this.state.phase) {
      case PokeBattlePhase.PICK:
        this.handlePickAction(client, data as PokeBattlePickActions);
        return;
      case PokeBattlePhase.GUESS:
        this.handleGuessAction(client, data as PokeBattleGuessActions);
        return;
      default:
        return false;
    }
  }

  onJoin(client: Client) {
    console.log(client.sessionId, "joined!");
    const player = new Player();
    this.state.players.set(client.sessionId, player);

    if (this.state.players.size === this.maxClients) {
      this.state.phase = PokeBattlePhase.PICK;
      this.lock();
    }
  }

  onLeave(client: Client) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
    let remainingPlayerIds = Array.from(this.state.players.keys());
    this.state.phase = PokeBattlePhase.RESULTS;
    if (remainingPlayerIds.length > 0) {
      this.state.winner = remainingPlayerIds[0];
    }
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
