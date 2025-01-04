import React, { useState, useRef } from 'react';
import { Pause, Play } from 'lucide-react';

const CassettePlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <>
            <button onClick={togglePlayPause}>
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <audio ref={audioRef} src='src/assets/audio/cant_believe_its_true.m4a'/>
        </>
    );
};

export default CassettePlayer;