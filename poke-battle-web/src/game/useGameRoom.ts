import { useEffect, useRef, useState } from "react";
import * as Colyseus from "colyseus.js";
import type {
  PokeBattleState,
  PokeBattleActions,
  PokeBattleGuess,
} from "../../../poke-battle-server/src/interfaces/PokeBattle.inferfaces";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.PUBLIC_API_URL;

export type GameRoom = ReturnType<typeof useGameRoom>;

export default function useGameRoom() {
  const [roomId, setRoomId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [gameState, setGameState] = useState<PokeBattleState>();
  const [guessResults, setGuessResults] = useState<PokeBattleGuess[]>(
    [] as PokeBattleGuess[],
  );

  const clientRef = useRef<Colyseus.Client>();
  const roomRef = useRef<Colyseus.Room>();

  useEffect(() => {
    clientRef.current = new Colyseus.Client(BASE_URL);

    clientRef.current
      .joinOrCreate("poke_battle")
      .then((room) => {
        roomRef.current = room;
        setRoomId(room.id);
        setSessionId(room.sessionId);
        room.onStateChange((newState: any) => {
          console.log(newState);

          setGameState({ ...newState });
        });
        room.onMessage("ERROR", (message) => toast.error(message));
        room.onMessage("MATCH_RESULT", (message) => {
          if (message === "VICTORY") {
            toast.success(message);
          } else if (message === "DEFEAT") {
            toast.error(message);
          }
        });
        room.onMessage("GUESS_RESULT", (message) => {
          toast.warning(JSON.stringify(message, null, 2), { autoClose: false });
          setGuessResults([...guessResults, message]);
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
    console.log("sendAction", action);

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
    sessionId,
    pickPokemon,
    confirmPokemons,
    guessPokemon,
    guessResults,
  };
}
