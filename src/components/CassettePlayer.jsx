import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Pause, Play, FastForward, Rewind, ArrowDownFromLine } from 'lucide-react';

const SCRUB_MULTIPLIER = 4; // Adjust this to change speed
const FAST_FORWARD = 1;
const REWIND = -1;

const CassettePlayer = ({ position, color, srcAudio, ejectCassette }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const scrubIntervalRef = useRef(null);
    const scrubStartTimeRef = useRef(null);
    
    const sounds = useMemo(() => ({
        button_press: new Audio('./audio/button_press.mp3'),
        cassette_insert: new Audio('./audio/cassette_insert.mp3'),
        cassette_eject: new Audio('./audio/cassette_eject.mp3'),
        cassette_player_motor: new Audio('./audio/cassette_player_motor.mp3')
    }), []);

    const sound_buttonPress = () => {
        const sound = sounds['button_press'];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(err => console.log('Sound play failed:', err));
        }
    }

    const sound_cassetteInsert = () => {
        const sound = sounds['cassette_insert'];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(err => console.log('Sound play failed:', err));
        }
    }

    const sound_cassetteEject = () => {
        const sound = sounds['cassette_eject'];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(err => console.log('Sound play failed:', err));
        }
    }

    const sound_startMotor = () => {
        const sound = sounds['cassette_player_motor'];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(err => console.log('Sound play failed:', err));
        }
    }

    const sound_stopMotor = () => {
        const sound = sounds['cassette_player_motor'];
        if (sound) {
            sound.pause();
        }
    }

    useEffect(() => {
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
        }
        if (srcAudio) {
            sound_cassetteInsert();
        } else {
            sound_cassetteEject();
        }
    }, [srcAudio]);

    const pressPlay = () => {
        sound_buttonPress();
        if (audioRef.current && srcAudio) {
            audioRef.current.play();
            setIsPlaying(true);
        }
    }

    const pressPause = () => {
        sound_buttonPress();
        if (audioRef.current && srcAudio) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }

    const startScrub = (ff_or_rwd) => {
        sound_buttonPress();
        sound_startMotor();
        if (audioRef.current && srcAudio) {
            // Store when we started holding the button
            audioRef.current.pause();
            scrubStartTimeRef.current = Date.now();
            
            // Set up interval to update time while holding
            scrubIntervalRef.current = setInterval(() => {
                const heldDuration = (Date.now() - scrubStartTimeRef.current) / 1000; // Convert to seconds
                const skipAmount = heldDuration * SCRUB_MULTIPLIER * ff_or_rwd;
                audioRef.current.currentTime = Math.min(
                    audioRef.current.currentTime + skipAmount,
                    audioRef.current.duration
                );
            }, 100); // Update every 100ms
        }
    };

    const stopScrub = () => {
        sound_stopMotor();
        if (scrubIntervalRef.current) {
            if (isPlaying && audioRef.current && srcAudio) {
                audioRef.current.play();
            }
            clearInterval(scrubIntervalRef.current);
            scrubIntervalRef.current = null;
        }
        scrubStartTimeRef.current = null;
    };

    const pressEject = () => {
        sound_buttonPress();
        ejectCassette();
    };

    return (
        <>
            <div
                className="absolute w-52 h-48 rounded-lg transition-colors duration-300"
                style={{
                    left: position.x - 25,
                    top: position.y - 25,
                    backgroundColor: color,
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
                }}
            >
                <div className="absolute w-52 h-12 bottom-0 left-1/2 -translate-x-1/2">
                    <button className="w-4 h-12" 
                        onClick={pressPlay}>
                        <Play className="left-1/2 -translate-x-1/2" size={16} />
                    </button>
                    <button className="w-4 h-12" 
                        onClick={pressPause}>
                        <Pause className="left-1/2 -translate-x-1/2" size={16} />
                    </button>
                    <button className="w-4 h-12" 
                        onMouseDown={() => startScrub(FAST_FORWARD)}
                        onTouchStart={() => startScrub(FAST_FORWARD)}
                        onMouseUp={stopScrub}
                        onMouseLeave={stopScrub} // Stop if mouse leaves while holding
                        onTouchEnd={stopScrub}
                        >
                        <FastForward className="left-1/2 -translate-x-1/2" size={16} />
                    </button>
                    <button className="w-4 h-12" 
                        onMouseDown={() => startScrub(REWIND)}
                        onTouchStart={() => startScrub(REWIND)}
                        onMouseUp={stopScrub}
                        onMouseLeave={stopScrub} // Stop if mouse leaves while holding
                        onTouchEnd={stopScrub}
                        >
                        <Rewind className="left-1/2 -translate-x-1/2" size={16} />
                    </button>
                    <button className="w-4 h-12" 
                        onClick={pressEject}>
                        <ArrowDownFromLine className="left-1/2 -translate-x-1/2" size={16} />
                    </button>

                </div>

                <audio ref={audioRef} src={srcAudio}/>
            </div>
        </>
    );
};

export default CassettePlayer;