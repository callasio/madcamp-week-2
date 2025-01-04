"use client";

import React, { createContext, useEffect } from 'react';
import { faceLandmarker, getWebcam } from "@/video/faceMesh";

const RecordingContext = createContext<{
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
}>({
  isRecording: false,
  setIsRecording: () => {},
});

export const RecordingProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const [isRecording, setIsRecording] = React.useState<boolean>(false);

  const getFaceLandmark = async () => {
    const faceLandmarkerInstance = await faceLandmarker();
    let animationFrameId: number = -1;

    if (isRecording) {
      const webcam: MediaStream = await getWebcam();

      // video.style.display = 'none';
      videoRef.current!.srcObject = webcam;
      videoRef.current!.autoplay = true;
      videoRef.current!.onloadedmetadata = () => {
        renderLoop();
      }
    } else {
      cancelAnimationFrame(animationFrameId);
      return;
    }

    function renderLoop(lastVideoTime: number = -1) {
      if (!isRecording || videoRef.current === null) {
        return;
      }

      const currentTime = videoRef.current?.currentTime ?? 0;
      if (currentTime !== lastVideoTime) {
        const result = faceLandmarkerInstance.detect(videoRef.current!);
        console.log(result.faceLandmarks?.at(0)?.at(0)?.x);
      }

      animationFrameId = requestAnimationFrame(
        () => renderLoop(currentTime)
      );
    }
  }

  useEffect(() => {
    getFaceLandmark();
  }, [isRecording]);

  return <RecordingContext.Provider value={{ isRecording, setIsRecording, videoRef }}>
    {isRecording && <video ref={videoRef} style={{ display: 'none' }}/>}
    {children}
  </RecordingContext.Provider>;
};

export const useRecording = () => React.useContext(RecordingContext);