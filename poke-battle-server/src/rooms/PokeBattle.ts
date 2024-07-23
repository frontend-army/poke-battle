import { Room, Client } from "@colyseus/core";
import {
  Player,
  PokeBattleActions,
  PokeBattlePhase,
  PokeBattleState,
  Pokemon,
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
      console.log("action", message);
      this.playerAction(client, message);
    });
    console.log("Room Created!");
  }

  playerAction(client: Client, data: PokeBattleActions) {
    const currentPlayer = this.state.players.get(client.id);
    const [rivalSessionId, rivalPlayer] = [
      ...this.state.players.entries(),
    ].find(([id]) => id !== client.id);
    const rivalCurrentPokemon = rivalPlayer.pokemons.get(
      rivalPlayer.currentPokemon.toString()
    );
    switch (this.state.phase) {
      case PokeBattlePhase.PICK:
        switch (data.type) {
          case "PICK":
            if (
              currentPlayer.confirmed ||
              data.index < 0 ||
              data.index >= this.state.maxPokemons
            ) {
              client.send("ERROR", "Invalid Pokemon");
              return false;
            }
            if (
              [...currentPlayer.pokemons.values()].some(
                (pokemon) => pokemon.number === data.pokemon
              )
            ) {
              client.send(
                "ERROR",
                `You already have an ${
                  getPokemonByNumber(data.pokemon).name
                } in your team!`
              );
              return false;
            }
            const newPokemon = new Pokemon();
            newPokemon.number = data.pokemon;
            currentPlayer.pokemons.set(data.index.toString(), newPokemon);
            return;
          case "CONFIRM":
            if (currentPlayer.pokemons.size < this.state.maxPokemons) {
              return false;
            }

            currentPlayer.confirmed = true;

            let allConfirmed = true;
            this.state.players.forEach((player) => {
              if (!player.confirmed) allConfirmed = false;
            });

            if (allConfirmed) {
              this.state.phase = PokeBattlePhase.GUESS;
            }
            return;
        }

      case PokeBattlePhase.GUESS:
        console.log(client.sessionId, "action!");
        switch (data.type) {
          case "GUESS":
            if (rivalCurrentPokemon.number === data.pokemon) {
              client.send("GUESS_RESULT", "CORRECT");
              rivalCurrentPokemon.guessed = true;
              rivalPlayer.currentPokemon = parseInt(
                [...rivalPlayer.pokemons.entries()].find(
                  ([, p]) => !p.guessed
                )?.[0] || "-1",
                10
              );
              if (rivalPlayer.currentPokemon === -1) {
                client.send("MATCH_RESULT", "VICTORY");
                this.clients
                  .getById(rivalSessionId)
                  .send("MATCH_RESULT", "DEFEAT");
                this.state.phase = PokeBattlePhase.RESULTS;
                this.state.winner = client.sessionId;
              }
              return;
            }
            const rivalPokemon = getPokemonByNumber(
              rivalPlayer.pokemons.get(rivalPlayer.currentPokemon.toString())
                .number
            );
            const guessPokemon = getPokemonByNumber(data.pokemon);
            console.log(
              data.pokemon,
              rivalPlayer.pokemons.get(rivalPlayer.currentPokemon.toString())
            );

            client.send("GUESS_RESULT", {
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
              height: compareNumber(rivalPokemon.height, guessPokemon.height),
              weight: compareNumber(rivalPokemon.weight, guessPokemon.weight),
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
            });
        }
      default:
        return false;
    }
  }

  onJoin(client: Client) {
    console.log(client.sessionId, "joined!");
    const player = new Player();
    this.state.players.set(client.sessionId, player);

    if (this.state.players.size === 2) {
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
