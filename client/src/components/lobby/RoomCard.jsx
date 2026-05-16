import React from 'react';

export default function RoomCard({ hostId, mission, currentPlayers, maxPlayers, status, isFull, isActive }) {
    const isWaiting = status === 'WAITING';

    return (
        <div className={`group flex items-center border p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors relative ${
            isFull ? 'bg-surface-container-lowest border-outline-variant opacity-60' :
                isActive ? 'bg-surface-container border-primary hover:bg-surface-variant cursor-pointer' :
                    'bg-surface-container border-outline-variant hover:bg-surface-variant cursor-pointer'
        }`}>

            {/* Left Active Accent */}
            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary glow-red"></div>}

            <div className="flex-1 flex items-center gap-4">
        <span className={`material-symbols-outlined ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
          {isFull ? 'lock' : isActive ? 'verified_user' : 'person'}
        </span>
                <div>
                    <p className="font-mono text-sm text-on-surface uppercase font-bold">{hostId}</p>
                    <p className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">{mission}</p>
                </div>
            </div>

            <div className="w-24 text-center">
        <span className={`font-mono text-lg font-bold ${isFull ? 'text-outline' : 'text-on-surface'}`}>
          {currentPlayers}/{maxPlayers}
        </span>
            </div>

            <div className="w-32 text-right flex items-center justify-end gap-2">
                <div className={`w-2 h-2 rounded-full ${
                    isWaiting && isActive ? 'bg-primary animate-pulse' :
                        isWaiting ? 'bg-on-surface-variant' : 'bg-outline'
                }`}></div>
                <span className={`font-mono text-xs uppercase ${isActive && isWaiting ? 'text-primary text-glow-red' : 'text-on-surface-variant'}`}>
          {status}
        </span>
            </div>

            {/* Hover Overlay for joining */}
            {!isFull && (
                <div className="absolute inset-y-0 right-0 w-32 bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-l border-primary">
                    <span className="font-mono text-sm text-on-primary font-bold uppercase tracking-widest">JOIN_OP</span>
                </div>
            )}
        </div>
    );
}