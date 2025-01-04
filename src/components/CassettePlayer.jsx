import React, { useState, useRef } from 'react';
import { Pause, Play } from 'lucide-react';

const CassettePlayer = ({ position, color }) => {
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
            <div
                className="absolute w-48 h-32 rounded-lg transition-colors duration-300"
                style={{
                    left: position.x - 25,
                    top: position.y - 25,
                    backgroundColor: color,
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
                }}
            >
                <button onClick={togglePlayPause}>
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>

                <audio ref={audioRef} src='./audio/cant_believe_its_true.m4a'/>
            </div>
        </>
    );
};

export default CassettePlayer;