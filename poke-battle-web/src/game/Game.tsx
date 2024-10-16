import useGameRoom, { type GameRoom } from "../hooks/useGameRoom";
import GameUI from "./GameUI";

export default function Game() {
  const gameRoom = useGameRoom();
  return <GameUI game={gameRoom} />;
}
