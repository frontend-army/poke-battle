import { Room, Client } from "@colyseus/core";
import {
  Player,
  PokeBattleActions,
  PokeBattlePhase,
  PokeBattleState,
} from "../interfaces/PokeBattle.inferfaces";

const maxPokemons = 3;

export class PokeBattle extends Room<PokeBattleState> {
  maxClients = 2;

  onCreate() {
    this.setState(new PokeBattleState());
    this.onMessage("action", (client, message) => {
      console.log("action", message);

      this.playerAction(client, message);
    });
    console.log("Room Created!");
  }

  playerAction(client: Client, data: PokeBattleActions) {
    const player = this.state.players.get(client.id);
    switch (this.state.phase) {
      case PokeBattlePhase.PICK:
        switch (data.type) {
          // { "type": "PICK", "index": 0, "pokemon": 1 }
          case "PICK":
            if (
              player.confirmed ||
              data.index < 0 ||
              data.index >= maxPokemons
            ) {
              return false;
            }
            // TODO: Check repeated
            console.log(player.pokemons);

            player.pokemons.set(data.index.toString(), data.pokemon);
            return;
          // { "type": "CONFIRM" }
          case "CONFIRM":
            if (player.pokemons.size === maxPokemons) {
              player.confirmed = true;
            }

            this.state.players.forEach((player) => {
              if (!player.confirmed) return;
            });

            this.state.phase = PokeBattlePhase.GUESS;
            return;
        }

      case PokeBattlePhase.GUESS:
        console.log(client.sessionId, "action!");

      default:
        return false;
    }
  }

  onJoin(client: Client) {
    console.log(client.sessionId, "joined!");
    this.state.players.set(client.sessionId, new Player());

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
