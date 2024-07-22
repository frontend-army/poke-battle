import useGameRoom from "./useGameRoom";
import GameUI from "./GameUI";

export default function Game() {
  const gameRoom = useGameRoom();
  return <GameUI gameRoom={gameRoom} />;
}
