import { type GameRoom } from "../hooks/useGameRoom";
import PhasePick from "./PhasePick";
import PhaseMain from "./PhaseMain";
import PhaseResults from "./PhaseResults";
import DebugUI from "./DebugUI";
import Loading from "../components/Loading";
import { type ReactNode } from "react";
import Rooms from "./Rooms";
import PhaseWaiting from "./PhaseWaiting";
import LeaveGameButton from "../components/LeaveGameButton";
import { PokeBattlePhase } from "./interfaces";

const DEBUG = import.meta.env.MODE === "development";

const PHASE_UI: Record<PokeBattlePhase, (game: GameRoom) => ReactNode> = {
  [PokeBattlePhase.WAITING]: (game) => <PhaseWaiting game={game} />,
  [PokeBattlePhase.PICK]: (game) => <PhasePick game={game} />,
  [PokeBattlePhase.MAIN]: (game) => <PhaseMain game={game} />,
  [PokeBattlePhase.RESULTS]: (game) => <PhaseResults game={game} />,
};

export default function GameUI({ game }: { game: GameRoom }) {
  const phase = game.state?.phase;

  return (
    <main className="card bg-base-100 shadow-xl border border-base-300 relative container mx-auto my-10 py-10 px-2 flex flex-col items-center gap-3">
      {DEBUG && <DebugUI gameRoom={game} />}
      {!game.roomId && !game.loadingRoom && <Rooms game={game} />}
      {game.loadingRoom && <Loading text="Joining room..." timeout={3000} />}
      {phase && PHASE_UI[phase](game)}
      <LeaveGameButton game={game} />
    </main>
  );
}
