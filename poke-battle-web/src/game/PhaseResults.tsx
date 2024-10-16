import type { GameRoom } from "../hooks/useGameRoom";
import PhaseMain from "./PhaseMain";

export default function PhaseResults({ game }: { game: GameRoom }) {
  const { sessionId, state } = game;
  return (
    <>
      {state?.winner ? (
        state?.winner === sessionId ? (
          <p className="font-semibold text-4xl text-success">Victory!</p>
        ) : (
          <p className="font-semibold text-4xl text-error">Defeat!</p>
        )
      ) : (
        <p className="font-semibold text-4xl">Draw!</p>
      )}
      <PhaseMain game={game} gameFinished />
    </>
  );
}
