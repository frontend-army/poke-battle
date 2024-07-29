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
  const [rooms, setRooms] = useState<Colyseus.RoomAvailable<any>[]>([]);
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
    clientRef.current.getAvailableRooms("poke_battle").then(setRooms);
  }, []);

  const handleRoom = (room: Colyseus.Room) => {
    roomRef.current = room;
    setRoomId(room.id);
    setSessionId(room.sessionId);
    room.onStateChange((newState: any) => {
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
      if (message === "CORRECT") {
        toast.success("Correct!");
        return;
      }
      setGuessResults((prev) => [...prev, message]);
    });
    room.onError(() => {
      toast.error(`couldn't join (room: ${room.sessionId})`);
    });
    room.onLeave((code) => {
      toast.error(`left room left (room: ${room.sessionId})`);
    });
  }

  const createRoom = (privateRoom = false) => {
    clientRef.current?.create("poke_battle", { privateRoom })
      .then(handleRoom).catch((e) => {
        toast.error(`Couldn't join room`);
      });
  }

  const joinRoom = (roomId: string) => {
    clientRef.current?.join("poke_battle", { roomId })
      .then(handleRoom).catch((e) => {
        toast.error(`Couldn't create room`);
      });
  }

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

  const currentPlayer = gameState?.players.get(sessionId);
  const myPokemons = [...(currentPlayer?.pokemons.values() || [])];
  const [rivalId, rivalPlayer] = [...(gameState?.players.entries() || [])].find(
    ([id]) => id !== sessionId,
  ) || ["", undefined];
  const rivalPokemons = [...(rivalPlayer?.pokemons.values() || [])];
  const waitingForRivalAction =
    !!gameState?.rounds[gameState?.currentRound]?.actions.get(sessionId);

  function pickRandomPokemons() {
    const pokes = [];
    while (pokes.length < 3) {
      var r = Math.floor(Math.random() * 151) + 1;
      if (pokes.indexOf(r) === -1) pokes.push(r);
    }
    pokes.forEach((p, i) => pickPokemon(i, p));
  }

  return {
    state: gameState,
    currentPlayer,
    myPokemons,
    rivalId,
    rivalPlayer,
    rivalPokemons,
    waitingForRivalAction,
    roomId,
    sessionId,
    pickPokemon,
    pickRandomPokemons,
    confirmPokemons,
    guessPokemon,
    guessResults,
    createRoom,
    joinRoom,
    rooms,
  };
}
