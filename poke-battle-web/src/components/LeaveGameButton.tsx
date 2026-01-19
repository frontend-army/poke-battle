import { PokeBattlePhase } from "../game/interfaces";
import type { GameRoom } from "../hooks/useGameRoom";

export default function LeaveGameButton({ game }: { game: GameRoom }) {
  const phase = game.state?.phase;
  if (!phase)
    return null;

  const handleLeaveGame = () => {
    if (window.confirm("Are you sure you want to leave the game? Your progress will be lost.")) {
      game.exitRoom();
    }
  };

  return (
    <button onClick={handleLeaveGame} className="btn btn-accent">
      Leave Game
    </button>
  );
}
