import { useCallback, useEffect, useRef, useState } from "react";
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
  const [rooms, setRooms] = useState<Colyseus.RoomAvailable<any>[] | null>(
    null,
  );
  const [roomId, setRoomId] = useState("");
  const [loadingRoom, setLoadingRoom] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [gameState, setGameState] = useState<PokeBattleState>();

  const clientRef = useRef<Colyseus.Client>();
  const roomRef = useRef<Colyseus.Room>();

  useEffect(() => {
    clientRef.current = new Colyseus.Client(BASE_URL);
    clientRef.current.getAvailableRooms("poke_battle").then((rooms) => {
      setRooms(rooms);
      const reconnectionToken = localStorage.getItem("reconnectionToken");

      if (reconnectionToken) {
        clientRef.current
          ?.reconnect(reconnectionToken)
          .then(handleRoom)
          .catch((e) => {
            console.error(e);

            toast.error("No se pudo conectar a la sala.");
            localStorage.removeItem("reconnectionToken");
          });
      }
    });
  }, []);

  const refreshRooms = useCallback(() => {
    clientRef.current?.getAvailableRooms("poke_battle").then(setRooms);
  }, []);

  const handleRoom = (room: Colyseus.Room) => {
    roomRef.current = room;
    localStorage.setItem("reconnectionToken", room.reconnectionToken);

    setRoomId(room.id);
    setSessionId(room.sessionId);
    room.onStateChange((newState: any) => {
      setGameState({ ...newState });
    });
    room.onMessage("ERROR", (message) => toast.error(message));
    room.onMessage("WARNING", (message) => toast.warning(message));
    room.onMessage("MATCH_RESULT", (message) => {
      if (message === "VICTORY") {
        toast.success(message);
      } else if (message === "DEFEAT") {
        toast.error(message);
      }
    });
    room.onMessage("CORRECT_GUESS", () => {
      toast.success("Correct!");
      return;
    });
    room.onError(() => {
      toast.error(`couldn't join (room: ${room.sessionId})`);
    });
  };

  const createRoom = async (privateRoom = false) => {
    setLoadingRoom(true);
    await clientRef.current
      ?.create("poke_battle", { privateRoom })
      .then(handleRoom)
      .catch((e) => {
        toast.error(`Couldn't create room`);
      });
    setLoadingRoom(false);
  };

  const joinRoom = async (roomId: string) => {
    setLoadingRoom(true);
    await (
      roomId
        ? clientRef.current?.joinById(roomId)
        : clientRef.current?.join("poke_battle")
    )
      ?.then(handleRoom)
      .catch((e) => {
        console.log(e);

        toast.error(`Couldn't join room`);
      });
    setLoadingRoom(false);
  };

  const exitRoom = () => {
    localStorage.removeItem("reconnectionToken");
    roomRef.current?.leave(true).then(() => {
      roomRef.current = undefined;
      setRoomId("");
      setGameState(undefined);
      setSessionId("");
    });
  };

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

  const switchPokemon = () => {
    sendAction({ type: "SWITCH" });
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
    while (gameState?.maxPokemons && pokes.length < gameState?.maxPokemons) {
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
    loadingRoom,
    roomId,
    sessionId,
    pickPokemon,
    pickRandomPokemons,
    confirmPokemons,
    guessPokemon,
    switchPokemon,
    guessResults: [...(currentPlayer?.results || [])]
      .map((result) => JSON.parse(result || "{}") as PokeBattleGuess)
      .filter((result) => result.pokemonIndex === rivalPlayer?.currentPokemon)
      .reverse(),
    createRoom,
    joinRoom,
    exitRoom,
    rooms,
    refreshRooms,
  };
}
