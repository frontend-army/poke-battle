import { MapSchema } from "@colyseus/schema";
import { Room, Client } from "@colyseus/core";
import {
  Player,
  PokeBattleActions,
  PokeBattlePhase,
  PokeBattleState,
} from "../interfaces/PokeBattle.inferfaces";
import { POKEMONS, getPokemonByNumber } from "../pokemons";
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
    const rivalPlayer = [...this.state.players.entries()].find(
      ([id]) => id !== client.id
    )[1];
    switch (this.state.phase) {
      case PokeBattlePhase.PICK:
        switch (data.type) {
          // { "type": "PICK", "index": 0, "pokemon": 1 }
          case "PICK":
            if (
              currentPlayer.confirmed ||
              data.index < 0 ||
              data.index >= this.state.maxPokemons
            ) {
              client.send("ERROR", "Invalid Pokemon");
              return false;
            }
            // TODO: Check repeated

            if (
              [...currentPlayer.pokemons.values()].some(
                (pokemonNumber) => pokemonNumber === data.pokemon
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

            currentPlayer.pokemons.set(data.index.toString(), data.pokemon);
            return;
          // { "type": "CONFIRM" }
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
          // { "type": "GUESS", "pokemon": 1 }
          case "GUESS":
            if (rivalPlayer.pokemons.get("0") === data.pokemon) {
              client.send("GUESS_RESULT", "CORRECT");
              return;
            }
            // Todo: guess from rival pokemons
            const rivalPokemon = getPokemonByNumber(
              rivalPlayer.pokemons.get("0")
            );
            const guessPokemon = getPokemonByNumber(data.pokemon);
            console.log(data.pokemon, rivalPlayer.pokemons.get("0"));

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
