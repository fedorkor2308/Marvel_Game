import React from 'react';
import RoomCard from './RoomCard';

export default function RoomList() {
    const mockRooms = [
        { id: 1, hostId: 'OPR-FALCON', mission: 'MISSION_01_ECHO', current: 1, max: 2, status: 'WAITING', isActive: true, isFull: false },
        { id: 2, hostId: 'OPR-BARNES', mission: 'TRAINING_SIM_X', current: 1, max: 2, status: 'WAITING', isActive: false, isFull: false },
        { id: 3, hostId: 'OPR-CARTER', mission: 'CLASSIFIED_OP', current: 2, max: 2, status: 'IN_PROG', isActive: false, isFull: true },
    ];

    return (
        <div className="md:col-span-8 flex flex-col gap-2">
            {/* Roster Header */}
            <div className="flex bg-surface-container-high border border-outline-variant p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex-1 font-mono text-xs text-on-surface-variant uppercase tracking-widest">HOST_ID</div>
                <div className="w-24 text-center font-mono text-xs text-on-surface-variant uppercase tracking-widest">CAPACITY</div>
                <div className="w-32 text-right font-mono text-xs text-on-surface-variant uppercase tracking-widest">STATUS</div>
            </div>

            {/* Room Items */}
            <div className="flex flex-col gap-2">
                {mockRooms.map(room => (
                    <RoomCard
                        key={room.id}
                        hostId={room.hostId}
                        mission={room.mission}
                        currentPlayers={room.current}
                        maxPlayers={room.max}
                        status={room.status}
                        isActive={room.isActive}
                        isFull={room.isFull}
                    />
                ))}
            </div>
        </div>
    );
}