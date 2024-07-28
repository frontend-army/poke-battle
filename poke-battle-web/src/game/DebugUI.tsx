import { useState } from "react";
import useGameRoom from "./useGameRoom";

export default function DebugUI({
  gameRoom,
}: {
  gameRoom: ReturnType<typeof useGameRoom>;
}) {
  const { roomId, state } = gameRoom;
  const [visible, setVisible] = useState(true);

  return (
    <div className="absolute left-2 top-2 opacity-60">
      <input
        type="checkbox"
        className="toggle toggle-xs"
        defaultChecked
        checked={visible}
        onChange={(e) => setVisible(e.target.checked)}
      />
      {visible && (
        <>
          <h2>Room: {roomId}</h2>
          <h2>Phase: {state?.phase}</h2>
        </>
      )}
    </div>
  );
}
