import React, { useState, useRef, useEffect } from 'react';
import { Pause, Play } from 'lucide-react';

const CassettePlayer = ({ position, color, srcAudio }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        // Process param1 changes
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
        }
    }, [srcAudio]);

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (srcAudio) {
                if (isPlaying) {
                    audioRef.current.pause();
                } else {
                    audioRef.current.play();
                }
                setIsPlaying(!isPlaying);
            } else {
                setIsPlaying(false);
                audioRef.current.pause();
            }
        }
    };

    return (
        <>
            <div
                className="absolute w-48 h-48 rounded-lg transition-colors duration-300"
                style={{
                    left: position.x - 25,
                    top: position.y - 25,
                    backgroundColor: color,
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
                }}
            >
                <button 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2" 
                    onClick={togglePlayPause}>
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>

                <audio ref={audioRef} src={srcAudio}/>
            </div>
        </>
    );
};

export default CassettePlayer;