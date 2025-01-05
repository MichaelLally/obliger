import React, { useState, useEffect } from 'react';
import CassettePlayer from './CassettePlayer'

const CassetteTable = () => {
    const [cassettes, setCassettes] = useState([
      { id: 1, color: '#FF6B6B', position: { x: -200, y: 250 }, srcAudio: './audio/cant_believe_its_true.m4a', locked: false },
      { id: 2, color: '#4ECDC4', position: { x: 0, y: 250 }, srcAudio: './audio/tv_static.mp3', locked: false },
      { id: 3, color: '#45B7D1', position: { x: 200, y: 250 }, srcAudio: './audio/tv_static.mp3', locked: false },
    ]);
  
    const [player] = useState({
      position: { x: 0, y: 50 }
    });
  
    const [playerColor, setPlayerColor] = useState('#2C3E50');
    const [playerAudio, setPlayerAudio] = useState(null);
    const [draggedCassette, setDraggedCassette] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
    const ejectCassette = () => {
      setCassettes(prevCassettes => prevCassettes.map(cassette => {
        if (cassette.locked === true) {
          return {
            ...cassette,
            position: { x: (cassette.id - 1) * 100 + 50, y: 50 },  // release position
            locked: false
          };
        }
        return cassette;
      }));
      setPlayerAudio(null);
      setPlayerColor('#2C3E50');
    }

    useEffect(() => {
      if (draggedCassette !== null) {
        
        const handleMouseMove = (e) => {
          e.preventDefault();
          setCassettes(prevCassettes => prevCassettes.map(cassette => {
            if (cassette.id === draggedCassette) {
              return {
                ...cassette,
                position: {
                  x: e.clientX - dragOffset.x,
                  y: e.clientY - dragOffset.y
                },
                locked: false
              };
            }
            return cassette;
          }));
        };
  
        const handleMouseUp = (e) => {
          const cassette = cassettes.find(b => b.id === draggedCassette);
          if (cassette) {
            const distance = Math.sqrt(
              Math.pow(cassette.position.x - player.position.x, 2) +
              Math.pow(cassette.position.y - player.position.y, 2)
            );
  
            if (distance < 100) {
              // Release any currently locked cassette
              setCassettes(prevCassettes => prevCassettes.map(b => {
                
                // releases currently locked cassette
                if (b.locked) {
                  return {
                    ...b,
                    position: { x: (b.id - 1) * 100 + 50, y: 50 },  // release position
                    locked: false
                  };
                }

                // locks dragged cassette into player
                if (b.id === draggedCassette) {
                  return {
                    ...b,
                    position: player.position,  // player position
                    locked: true
                  };
                }
                return b;
              }));
              setPlayerColor(cassette.color);
              setPlayerAudio(cassette.srcAudio);
            }
          }
          setDraggedCassette(null);
        };
  
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
  
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [draggedCassette, dragOffset, cassettes, player.position]);
  
    const handleCassetteMouseDown = (e, cassetteId) => {
      const cassette = cassettes.find(b => b.id === cassetteId);
      
      if (cassette.locked) {
        setPlayerColor('#2C3E50');
        setPlayerAudio(null);
      }
      
      setDragOffset({
        x: e.clientX - cassette.position.x,
        y: e.clientY - cassette.position.y
      });
      
      setDraggedCassette(cassetteId);
      e.preventDefault();
    };
  
    return (
        <div className="relative w-full h-96 select-none">
            <CassettePlayer position={player.position} color={playerColor} srcAudio={playerAudio} ejectCassette={ejectCassette} />
            
            {cassettes.map(cassette => (
            <div
                key={cassette.id}
                className={`absolute w-44 h-28 rounded-lg shadow-lg transition-transform duration-150 ${
                cassette.locked ? 'cursor-pointer' : 'cursor-move'
                }`}
                style={{
                    left: cassette.position.x - 20,
                    top: cassette.position.y - 20,
                    backgroundColor: cassette.color,
                    transform: `scale(${draggedCassette === cassette.id ? 1.1 : 1})`,
                    zIndex: draggedCassette === cassette.id ? 10 : 1
                }}
                onMouseDown={(e) => handleCassetteMouseDown(e, cassette.id)}
            />
            ))}
            
        </div>
    );
  };

export default CassetteTable;
