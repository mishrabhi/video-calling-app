//check for media
export const getUserMediaStream = async () => {
  return await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
};

//creating connection
export const createPeerConnection = (socket, roomId, remoteVideoRef) => {
  const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-canditate", {
        candidate: event.candidate,
        room: roomId,
      });
    }
  };

  peerConnection.ontrack = (event) => {
    if (remoteVideoRef.current)
      remoteVideoRef.current.srcObject = event.streams[0];
  };

  return peerConnection;
};
