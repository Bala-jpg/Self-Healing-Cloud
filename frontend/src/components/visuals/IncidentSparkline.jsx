import React, { useState } from 'react';

const IncidentSparkline = ({ events = [] }) => {
    const [hoveredEvent, setHoveredEvent] = useState(null);

    // Mock timeline generation if empty
    const timelineEvents = events.length > 0 ? events : Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 1000 * 60 * 60).toISOString(),
        status: i > 18 ? 'heal' : (i > 15 ? 'action' : (i > 10 ? 'failure' : 'normal')),
        value: Math.random() * 100
    }));

    const width = 100; // SVG viewBox percentage
    const height = 40;

    const getColor = (status) => {
        switch (status) {
            case 'failure': return '#FF4D4D'; // Alert Red
            case 'heal': return '#2DFF8C';    // Success Green
            case 'action': return '#00D1FF';  // Electric Blue
            default: return '#334155';        // Gray
        }
    };

    return (
        <div className="relative w-full h-16 pointer-events-auto">
            {/* Tooltip */}
            {hoveredEvent && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-white/10 z-10">
                    <span className="font-mono">{new Date(hoveredEvent.timestamp).toLocaleTimeString()}</span>
                    <span className="ml-2 capitalize text-electric-blue">{hoveredEvent.status}</span>
                </div>
            )}

            <svg viewBox={`0 0 ${timelineEvents.length * 5} ${height}`} className="w-full h-full overflow-visible preserve-3d">
                {timelineEvents.map((event, index) => (
                    <g
                        key={index}
                        onMouseEnter={() => setHoveredEvent(event)}
                        onMouseLeave={() => setHoveredEvent(null)}
                        className="cursor-pointer hover:opacity-100 opacity-80"
                    >
                        {/* Bar */}
                        <line
                            x1={index * 5 + 2}
                            y1={height}
                            x2={index * 5 + 2}
                            y2={height - (event.value / 100 * height * 0.8) - 5}
                            stroke={getColor(event.status)}
                            strokeWidth="3"
                            strokeLinecap="round"
                        />

                        {/* Interactive Hit Area (Invisible) */}
                        <rect x={index * 5} y={0} width="5" height={height} fill="transparent" />
                    </g>
                ))}
            </svg>
        </div>
    );
};

export default IncidentSparkline;
