import React, { useState, useRef } from "react";
import { IoIosMic } from "react-icons/io";
import { RiStopCircleLine } from "react-icons/ri";

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  return (
    <div>
      <h1>Voice Recorder</h1>
      <button
        className="btn btn-light border"
        onClick={isRecording ? handleStopRecording : handleStartRecording}
      >
        {isRecording ? (
          <span>
            <RiStopCircleLine />
            Stop Recording
          </span>
        ) : (
          <span>
            <IoIosMic className="fs-5" />
            Start Recording
          </span>
        )}
      </button>

      {isRecording && (
        <>
          {" "}
          <img
            style={{ height: "100px", filter: "invert(1)" }}
            src="https://media2.giphy.com/media/72ztegvYpkKhoTAr0D/giphy.gif?cid=790b76115c56f24333d536e9ce44cf96bed9686d511aa38a&rid=giphy.gif&ct=s"
            alt=""
          />
        </>
      )}
      {audioUrl && (
        <div>
          <h2>Recording</h2>
          <audio controls src={audioUrl} />
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
