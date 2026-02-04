// import React, { useState, useRef } from 'react';
// import { Modal } from 'react-bootstrap';
// import { ImPhoneHangUp } from 'react-icons/im';
// import { MdCameraEnhance } from 'react-icons/md';
// import Position from '../Pages/Department/Position';

// const CameraModal = () => {
//     const [showModal, setShowModal] = useState(false);
//     const videoRef = useRef(null);
//     const [stream, setStream] = useState(null);

//     const handleShowModal = () => {
//         setShowModal(true);
//         startCamera();
//     };

//     const handleCloseModal = () => {
//         setShowModal(false);
//         stopCamera();
//     };

//     const startCamera = async () => {
//         if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//             const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
//             setStream(mediaStream);
//             if (videoRef.current) {
//                 videoRef.current.srcObject = mediaStream;
//             }
//         }
//     };

//     const stopCamera = () => {
//         if (stream) {
//             stream.getTracks().forEach(track => track.stop());
//             setStream(null);
//         }
//     };

//     return (
//         <>
//             <button title='Open Mirror' className='btn p-0 text-white d-flex my-auto' onClick={handleShowModal}>
//                 <MdCameraEnhance />
//             </button>
//             <Modal show={showModal} onHide={handleCloseModal} size="md" centered>
//                 <div className="video-container" style={{ height: '450px', width: '600px', position: 'relative' }}>
//                     <video ref={videoRef} width="100%" height="100%" autoPlay />
//                     <button title='Hang Up' className="close-btn btn btn-danger" onClick={handleCloseModal}>
//                         <ImPhoneHangUp />
//                     </button>
//                 </div>
//             </Modal>
//             <style jsx>{`
//                 .video-container {
//                     position: relative;
//                 }
//                 .close-btn {
//                     position: absolute;
//                     bottom: 10px;
//                     left: 50%;
//                     transform: translateX(-50%);
//                     display: none;
//                 }
//                 .video-container:hover .close-btn {
//                     display: block;
//                 }
//             `}</style>
//         </>
//     );
// };

// export default CameraModal;
import React, { useState, useRef, useEffect } from "react";
import { Modal } from "react-bootstrap";
import {
  ImPhoneHangUp,
  ImDownload2,
  ImPause,
  ImPlay2,
  ImVideoCamera,
} from "react-icons/im";
import { MdCameraEnhance, MdMic, MdMicOff } from "react-icons/md";
import { FaRegStopCircle } from "react-icons/fa";
import { LuFlipHorizontal } from "react-icons/lu";
import { TbFilters } from "react-icons/tb";

const CameraModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mirror, setMirror] = useState(false);
  const [filter, setFilter] = useState("none");
  const [audioStream, setAudioStream] = useState(null);
  const [audioMuted, setAudioMuted] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.style.transform = mirror ? "scaleX(-1)" : "scaleX(1)";
    }
  }, [mirror]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.style.filter = filter;
    }
  }, [filter]);

  const handleShowModal = async () => {
    setShowModal(true);
    await startCamera();
    await startAudio();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    stopCamera();
    stopAudio();
  };

  const toggleFilters = () => {
    setShowFilters((prevState) => !prevState);
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const recorder = new MediaRecorder(mediaStream);
      recorder.ondataavailable = handleDataAvailable;
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const startAudio = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setAudioStream(audioStream);
    } catch (error) {
      console.error("Error accessing audio:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    clearInterval(intervalRef.current);
    setRecordingTime(0);
  };

  const stopAudio = () => {
    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop());
      setAudioStream(null);
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordedChunks((prev) => [...prev, event.data]);
    }
  };

  const startRecording = () => {
    setRecordedChunks([]);
    if (mediaRecorder) {
      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      intervalRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
    clearInterval(intervalRef.current);
  };

  const pauseRecording = () => {
    if (mediaRecorder && isRecording && !isPaused) {
      mediaRecorder.pause();
      setIsPaused(true);
      clearInterval(intervalRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && isRecording && isPaused) {
      mediaRecorder.resume();
      setIsPaused(false);
      intervalRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    }
  };

  const downloadRecording = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "recording.webm";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleAudioMute = () => {
    if (audioStream) {
      audioStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setAudioMuted((prevState) => !prevState);
    }
  };

  return (
    <>
      <button
        title="Open Mirror"
        className="btn p-0 text-white d-flex my-auto"
        onClick={handleShowModal}
      >
        <MdCameraEnhance />
      </button>
      <Modal show={showModal} onHide={handleCloseModal} size="md" centered>
        <div
          className="video-container"
          style={{ height: "450px", width: "600px", position: "relative" }}
        >
          <video
            ref={videoRef}
            width="100%"
            height="100%"
            autoPlay
            muted={audioMuted}
          />
          <div className="control-buttons">
            <button
              title="Start Recording"
              className="btn btn-success"
              onClick={startRecording}
              disabled={isRecording}
            >
              <ImVideoCamera />
            </button>
            {isRecording && !isPaused && (
              <button
                title="Pause Recording"
                className="btn btn-warning"
                onClick={pauseRecording}
              >
                <ImPause />
              </button>
            )}
            {isRecording && isPaused && (
              <button
                title="Resume Recording"
                className="btn btn-info"
                onClick={resumeRecording}
              >
                <ImPlay2 />
              </button>
            )}
            {isRecording && (
              <button
                title="Stop Recording"
                className="btn btn-danger"
                onClick={stopRecording}
                disabled={!isRecording}
              >
                <FaRegStopCircle />
              </button>
            )}
            <button
              title="Download"
              className="btn btn-primary"
              onClick={downloadRecording}
              disabled={recordedChunks.length === 0}
            >
              <ImDownload2 />
            </button>
            <button
              title={audioMuted ? "Unmute Audio" : "Mute Audio"}
              className="btn btn-info"
              onClick={toggleAudioMute}
            >
              {audioMuted ? <MdMicOff /> : <MdMic />}
            </button>
            <button
              title="Hang Up"
              className="btn btn-danger"
              onClick={handleCloseModal}
            >
              <ImPhoneHangUp />
            </button>
            <button
              title="Flip Mirror"
              className="btn btn-info"
              onClick={() => setMirror(!mirror)}
            >
              <LuFlipHorizontal />
            </button>
            <div className="position-relative">
              <button
                title="Filters"
                className="btn btn-info"
                onClick={toggleFilters}
              >
                <TbFilters />
              </button>
              {showFilters && (
                <div className="filter-options">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="form-select"
                  >
                    <option value="none">None</option>
                    <option value="grayscale(100%)">Grayscale</option>
                    <option value="sepia(100%)">Sepia</option>
                    <option value="invert(100%)">Invert</option>
                    <option value="blur(5px)">Blur</option>
                    <option value="brightness(150%)">Brightness</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          {isRecording && (
            <div className="recording-time">{formatTime(recordingTime)}</div>
          )}
        </div>
      </Modal>
      <style jsx>{`
        .video-container {
          position: relative;
        }
        .control-buttons {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
        }
        .filter-options {
          position: absolute;
          bottom: 103%;
          left: 0%;
          /* transform: translate(-50%, -50%); */
        }
        .recording-time {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.5);
          color: white;
          padding: 5px 10px;
          border-radius: 5px;
        }
      `}</style>
    </>
  );
};

export default CameraModal;
