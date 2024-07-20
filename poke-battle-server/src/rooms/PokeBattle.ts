import { MapSchema } from "@colyseus/schema";
import { Room, Client } from "@colyseus/core";
import {
  Player,
  PokeBattleActions,
  PokeBattlePhase,
  PokeBattleState,
} from "../interfaces/PokeBattle.inferfaces";
import { POKEMONS } from "../pokemons";

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
              return false;
            }
            // TODO: Check repeated
            currentPlayer.pokemons.push(data.pokemon);
            return;
          // { "type": "CONFIRM" }
          case "CONFIRM":
            if (currentPlayer.pokemons.length < this.state.maxPokemons) {
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
            if (rivalPlayer.pokemons.at(0) === data.pokemon) {
              client.send("GUESS_RESULT", "CORRECT");
              return;
            }
            // Todo: guess from rival pokemons
            const rivalPokemon = POKEMONS.find(
              (p) => p.number === rivalPlayer.pokemons.at(0)
            );
            const guessPokemon = POKEMONS.find(
              (p) => p.number === data.pokemon
            );
            console.log(data.pokemon, rivalPlayer.pokemons.at(0));

            // 'CORRECT' | 'INCORRECT'| 'GREATER' | 'SMALLER';
            const compareNumber = (target: number, guess: number) => {
              if (target === guess) {
                return "CORRECT";
              }
              return target < guess ? "SMALLER" : "GREATER";
            };
            const compareStrict = (target: unknown, guess: unknown) => {
              return target === guess ? "CORRECT" : "INCORRECT";
            };
            const comparePartial = (
              target: unknown,
              otherTarget: unknown,
              guess: unknown
            ) => {
              if (target === guess) {
                return "CORRECT";
              }

              if (otherTarget === guess) {
                return "PARTIAL";
              }

              return "INCORRECT";
            };

            client.send("GUESS_RESULT", {
              stage: compareNumber(rivalPokemon.stage, guessPokemon.stage),
              color: compareStrict(rivalPokemon.color, guessPokemon.color),
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
    // this.state.players.delete(client.sessionId);
    // let remainingPlayerIds = Array.from(this.state.players.keys());
    // if (remainingPlayerIds.length > 0) {
    //   this.state.winner = remainingPlayerIds[0];
    // }
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
