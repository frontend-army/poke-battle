import useGameRoom from "./useGameRoom";
import PhasePick from "./PhasePick";
import PhaseGuess from "./PhaseGuess";
import PhaseResults from "./PhaseResults";
import DebugUI from "./DebugUI";
import WaitingForRival from "../components/WaitingForRival";
import Loading from "../components/Loading";
import { useState } from "react";

const DEBUG = import.meta.env.MODE === "development";

export default function GameUI({
  gameRoom,
}: {
  gameRoom: ReturnType<typeof useGameRoom>;
}) {
  const phase = gameRoom.state?.phase;
  const [newRoomId, setNewRoomId] = useState("");
  const [privateRoom, setPrivateRoom] = useState(false);

  return (
    <main className="card bg-base-100 shadow-xl border border-base-300 relative container mx-auto my-10 py-10 px-2 flex flex-col items-center gap-3">
      {DEBUG && <DebugUI gameRoom={gameRoom} />}
      {!gameRoom.roomId && !gameRoom.loadingRoom && (
        <>
          {gameRoom.rooms ? (
            <div className="flex flex-col gap-3">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Room ID</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {!gameRoom.rooms.length && (
                      <tr>
                        <th>No available rooms</th>
                      </tr>
                    )}
                    {gameRoom.rooms.map((room) => (
                      <tr key={room.roomId}>
                        <th>{room.roomId}</th>
                        <th align="right">
                          <button
                            className="btn btn-secondary btn-sm ml-auto"
                            onClick={() => gameRoom.joinRoom(room.roomId)}
                          >
                            Join
                          </button>
                        </th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="join">
                <input
                  className="input input-bordered join-item"
                  type="text"
                  placeholder="Enter room id"
                  value={newRoomId}
                  onChange={(event) => setNewRoomId(event.target.value)}
                />
                <button
                  className="btn btn-secondary join-item"
                  onClick={() => gameRoom.joinRoom(newRoomId)}
                >
                  Join
                </button>
              </div>
              <div className="flex flex-col">
                <button
                  className="btn btn-primary"
                  onClick={() => gameRoom.createRoom(privateRoom)}
                >
                  Create Room
                </button>
                <div className="form-control">
                  <label className="label cursor-pointer gap-4">
                    <span className="label-text">Private</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-xs"
                      checked={privateRoom}
                      onChange={(event) => setPrivateRoom(event.target.checked)}
                    />
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <Loading
              text="Connecting to the server..."
              delay={800}
              timeout={3000}
            />
          )}
        </>
      )}
      {gameRoom.loadingRoom && (
        <Loading text="Joining room..." timeout={3000} />
      )}
      {phase === "WAITING" && (
        <>
          <p>Room ID: {gameRoom.roomId}</p>
          <WaitingForRival />
        </>
      )}
      {phase === "PICK" && <PhasePick gameRoom={gameRoom} />}
      {phase === "GUESS" && <PhaseGuess gameRoom={gameRoom} />}
      {phase === "RESULTS" && (
        <>
          <PhaseResults gameRoom={gameRoom} />
          <PhaseGuess gameRoom={gameRoom} gameFinished />
        </>
      )}
    </main>
  );
}
