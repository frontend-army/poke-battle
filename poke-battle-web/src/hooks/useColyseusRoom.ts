import { useEffect, useRef, useState } from "react";
import * as Colyseus from "colyseus.js";

export default function useColyseusRoom() {
  const [roomId, setRoomId] = useState("");
  const [gameState, setGameState] = useState<any>();

  const clientRef = useRef<Colyseus.Client>();
  const roomRef = useRef<Colyseus.Room>();

  useEffect(() => {
    console.log("Colyseus");

    clientRef.current = new Colyseus.Client("ws://poke-battle.onrender.com/");

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

  const pickPokemon = (pokemon: number) => {
    roomRef.current?.send("action", { type: "PICK", index: 0, pokemon });
  };

  const confirmPokemons = () => {
    roomRef.current?.send("action", { type: "CONFIRM" });
  };

  const guessPokemon = (pokemon: number) => {
    roomRef.current?.send("action", { type: "GUESS", pokemon });
  };

  return {
    state: gameState,
    roomId,
    pickPokemon,
    confirmPokemons,
    guessPokemon,
  };
}
