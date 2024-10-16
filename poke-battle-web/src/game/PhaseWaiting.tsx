import WaitingForRival from "../components/WaitingForRival";
import type { GameRoom } from "../hooks/useGameRoom";

export default function PhaseWaiting({ game }: { game: GameRoom }) {
  const { roomId } = game;
  return (
    <>
      <p>Room ID: {roomId}</p>
      <WaitingForRival />
    </>
  );
}
