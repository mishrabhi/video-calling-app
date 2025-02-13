import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPeerConnection, getUserMediaStream } from "../utils/webRTC";

const socket = io("http://localhost:5000");

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  let peerConnection;

  useEffect(() => {
    (async () => {
      const localStream = await getUserMediaStream();
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

      socket.emit("join-room", roomId, socket.id);

      socket.on("user-connected", async (data) => {
        peerConnection = createPeerConnection(socket, roomId, remoteVideoRef);
        localStream
          .getTracks()
          .forEach((track) => peerConnection.addTrack(track, localStream));
      });

      socket.on("offer", async (data) => {
        peerConnection = createPeerConnection(socket, roomId, remoteVideoRef);
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit("answer", { answer, room: roomId });
      });

      socket.on("answer", async (data) => {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
      });

      socket.on("ice-candidate", (data) => {
        peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      });

      return () => {
        socket.disconnect();
        peerConnection?.close();
      };
    })();
  }, []);

  //Toggle Audio
  const toggleAudio = () => {
    localVideoRef.current.srcObject.getAudioTracks()[0].enabled = muted;
    setMuted(!muted);
  };

  //Toggle Video
  const toggleVideo = () => {
    localVideoRef.current.srcObject.getVideoTracks()[0].enabled = videoEnabled;
    setVideoEnabled(!videoEnabled);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-60 h-40 bg-gray-800"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-60 h-40 bg-gray-800"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={toggleAudio}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          {muted ? "Unmute" : "Mute"}
        </button>
        <button
          onClick={toggleVideo}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          {videoEnabled ? "Turn Off Video" : "Turn On Video"}
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Leave Call
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
