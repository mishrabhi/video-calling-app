import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const JoinRoom = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!roomId) {
      //Random room if none is provided
      setRoomId(uuidv4());
    }
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
      <h1 className="text-2xl font-semibold mb-4">Join Video Call</h1>
      <input
        type="text"
        placeholder="Enter room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <button
        onClick={handleJoin}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Join Call
      </button>
    </div>
  );
};

export default JoinRoom;
