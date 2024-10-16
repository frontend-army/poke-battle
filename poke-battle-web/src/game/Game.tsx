import useGameRoom, { type GameRoom } from "../hooks/useGameRoom";
import GameUI from "./GameUI";

export enum PokeBattlePhase {
  WAITING = "WAITING",
  PICK = "PICK",
  MAIN = "MAIN",
  RESULTS = "RESULTS",
}

export default function Game() {
  const gameRoom = useGameRoom();
  return <GameUI game={gameRoom} />;
}
