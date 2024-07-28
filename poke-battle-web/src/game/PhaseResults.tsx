import useGameRoom from "./useGameRoom";

export default function PhaseResults({
  gameRoom: { sessionId, state },
}: {
  gameRoom: ReturnType<typeof useGameRoom>;
}) {
  return state?.winner ? (
    state?.winner === sessionId ? (
      <p className="font-semibold text-4xl text-success">Victory!</p>
    ) : (
      <p className="font-semibold text-4xl text-error">Defeat!</p>
    )
  ) : (
    <p className="font-semibold text-4xl">Draw!</p>
  );
}
