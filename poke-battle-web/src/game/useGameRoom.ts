import { useEffect, useRef, useState } from "react";
import * as Colyseus from "colyseus.js";
import type {
  PokeBattleState,
  PokeBattleActions,
} from "../../../poke-battle-server/src/interfaces/PokeBattle.inferfaces.ts";

const BASE_URL = import.meta.env.PUBLIC_API_URL;

export type GameRoom = ReturnType<typeof useGameRoom>;

export default function useGameRoom() {
  const [roomId, setRoomId] = useState("");
  const [gameState, setGameState] = useState<PokeBattleState>();

  const clientRef = useRef<Colyseus.Client>();
  const roomRef = useRef<Colyseus.Room>();

  useEffect(() => {
    clientRef.current = new Colyseus.Client(BASE_URL);

    clientRef.current
      .joinOrCreate("poke_battle")
      .then((room) => {
        roomRef.current = room;
        console.log(room.sessionId, "joined", room.name);
        setRoomId(room.id);
        room.onStateChange((newState: any) => {
          setGameState({ ...newState });
        });
        room.onMessage("GUESS_RESULT", (message) => {
          console.log(room.sessionId, "received on", room.name, message);
        });
        room.onError((code, message) => {
          console.log(room.sessionId, "couldn't join", room.name);
        });
        room.onLeave((code) => {
          console.log(room.sessionId, "left", room.name);
        });
      })
      .catch((e) => {
        console.log("JOIN ERROR", e);
      });
  }, []);

  const sendAction = (action: PokeBattleActions) => {
    roomRef.current?.send("action", action);
  };

  const pickPokemon = (index: number, pokemon: number) => {
    sendAction({ type: "PICK", index, pokemon });
  };

  const confirmPokemons = () => {
    sendAction({ type: "CONFIRM" });
  };

  const guessPokemon = (pokemon: number) => {
    sendAction({ type: "GUESS", pokemon });
  };

  return {
    state: gameState,
    roomId,
    pickPokemon,
    confirmPokemons,
    guessPokemon,
  };
}
