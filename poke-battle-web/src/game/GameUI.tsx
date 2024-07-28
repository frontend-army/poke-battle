import useGameRoom from "./useGameRoom";
import PhasePick from "./PhasePick";
import PhaseGuess from "./PhaseGuess";
import PhaseResults from "./PhaseResults";
import DebugUI from "./DebugUI";
import WaitingForRival from "../components/WaitingForRival";
import Joining from "../components/Joining";

const DEBUG = import.meta.env.MODE === "development";

export default function GameUI({
  gameRoom,
}: {
  gameRoom: ReturnType<typeof useGameRoom>;
}) {
  const phase = gameRoom.state?.phase;

  return (
    <main className="card bg-base-100 shadow-xl border border-base-300 relative container mx-auto my-10 py-10 px-2 flex flex-col items-center gap-3">
      {DEBUG && <DebugUI gameRoom={gameRoom} />}
      {!gameRoom.roomId && <Joining />}
      {phase === "WAITING" && <WaitingForRival />}
      {phase === "PICK" && <PhasePick gameRoom={gameRoom} />}
      {phase === "GUESS" && <PhaseGuess gameRoom={gameRoom} />}
      {phase === "RESULTS" && <PhaseResults gameRoom={gameRoom} />}
    </main>
  );
}
