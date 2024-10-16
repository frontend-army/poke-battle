import Loading from "../components/Loading";
import { useEffect, useState } from "react";
import type { GameRoom } from "../hooks/useGameRoom";

export default function Rooms({ game }: { game: GameRoom }) {
  const { rooms, joinRoom, createRoom, refreshRooms } = game;
  const [newRoomId, setNewRoomId] = useState("");
  const [privateRoom, setPrivateRoom] = useState(false);

  useEffect(() => {
    const interval = setInterval(refreshRooms, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!rooms) {
    return (
      <Loading text="Connecting to the server..." delay={800} timeout={3000} />
    );
  }

  return (
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
            {!rooms.length && (
              <tr>
                <th>No available rooms</th>
              </tr>
            )}
            {rooms.map((room) => (
              <tr key={room.roomId}>
                <th>{room.roomId}</th>
                <th align="right">
                  <button
                    className="btn btn-secondary btn-sm ml-auto"
                    onClick={() => joinRoom(room.roomId)}
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
          onClick={() => joinRoom(newRoomId)}
        >
          Join
        </button>
      </div>
      <div className="flex flex-col">
        <button
          className="btn btn-primary"
          onClick={() => createRoom(privateRoom)}
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
  );
}
