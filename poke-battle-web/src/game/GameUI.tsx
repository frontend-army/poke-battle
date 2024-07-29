import useGameRoom from "./useGameRoom";
import PhasePick from "./PhasePick";
import PhaseGuess from "./PhaseGuess";
import PhaseResults from "./PhaseResults";
import DebugUI from "./DebugUI";
import WaitingForRival from "../components/WaitingForRival";
import Joining from "../components/Joining";
import { useState } from "react";

const DEBUG = import.meta.env.MODE === "development";

export default function GameUI({
  gameRoom,
}: {
  gameRoom: ReturnType<typeof useGameRoom>;
}) {
  const phase = gameRoom.state?.phase;
  const [roomId, setRoomId] = useState("");
  const [privateRoom, setPrivateRoom] = useState(false);

  return (
    <main className="card bg-base-100 shadow-xl border border-base-300 relative container mx-auto my-10 py-10 px-2 flex flex-col items-center gap-3">
      {DEBUG && <DebugUI gameRoom={gameRoom} />}
      {/* {!gameRoom.roomId && <Joining />} */}
      {!gameRoom.roomId && <>
        <p>{gameRoom.rooms.length ? "Available rooms" : "No available rooms"}</p>
        {gameRoom.rooms.map(room => <div key={room.roomId}>
          <p>{room.roomId}</p>
          <button className="btn btn-primary" onClick={() => gameRoom.joinRoom(room.roomId)}>Join</button>
        </div>)}
        <input className="input input-bordered" type="text" placeholder="Enter room id" value={roomId} onChange={(event) => setRoomId(event.target.value)} />
        <button className="btn btn-primary" onClick={() => gameRoom.joinRoom(roomId)}>Join</button>
        <div className="form-control">
          <label className="label cursor-pointer gap-4">
            <span className="label-text">Private</span>
            <input type="checkbox" className="toggle" checked={privateRoom} onChange={event => setPrivateRoom(event.target.checked)} />
          </label>
        </div>
        <button className="btn btn-primary" onClick={() => gameRoom.createRoom(privateRoom)} >Create</button>
      </>}
      {phase === "WAITING" && <WaitingForRival />}
      {phase === "PICK" && <PhasePick gameRoom={gameRoom} />}
      {phase === "GUESS" && <PhaseGuess gameRoom={gameRoom} />}
      {phase === "RESULTS" &&
        <>
          <PhaseResults gameRoom={gameRoom} />
          <PhaseGuess gameRoom={gameRoom} gameFinished />
        </>
      }
    </main>
  );
}
