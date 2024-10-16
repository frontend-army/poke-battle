import { PokeBattlePhase } from "../game/interfaces";
import type { GameRoom } from "../hooks/useGameRoom";

export default function LeaveGameButton({ game }: { game: GameRoom }) {
  const phase = game.state?.phase;
  if (!phase || [PokeBattlePhase.WAITING, PokeBattlePhase.PICK].includes(phase))
    return null;

  return (
    <button onClick={game.exitRoom} className="btn btn-accent">
      Leave Game
    </button>
  );
}
