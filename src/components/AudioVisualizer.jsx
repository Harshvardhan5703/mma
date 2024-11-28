import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

const AudioVisualizer = ({ audioUrl }) => {
  const wavesurferRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: containerRef.current,
        waveColor: 'rgba(255, 255, 255, 0.6)',
        progressColor: 'rgba(0, 255, 0, 0.8)',
        height: 150,
        barWidth: 3,
        responsive: true,
      });
      wavesurfer.load(audioUrl);
      wavesurferRef.current = wavesurfer;

      return () => {
        wavesurfer.destroy();
      };
    }
  }, [audioUrl]);

  return (
    <div>
      <div ref={containerRef} />
    </div>
  );
};

export default AudioVisualizer;
