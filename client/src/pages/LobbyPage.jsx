import React from 'react';
import Sidebar from '../components/ui/Sidebar';
import MobileHeader from '../components/ui/MobileHeader';
import BackgroundFx from '../components/ui/BackgroundFx';
import RoomList from '../components/lobby/RoomList';
import CreateRoomModal from '../components/lobby/CreateRoomModal';

export default function LobbyPage() {
    return (
        <div className="bg-background text-on-surface font-grotesk min-h-screen relative flex">

            {/* Background Effects (Z-index handled inside component) */}
            <BackgroundFx />

            {/* Desktop Sidebar (hidden on mobile, locked left on desktop) */}
            <Sidebar />

            {/* Main Content Area (pushes right on desktop to make room for sidebar) */}
            <main className="flex-grow md:ml-64 relative overflow-hidden flex flex-col h-screen z-10">

                {/* Mobile Header (hidden on desktop) */}
                <MobileHeader />

                {/* Scrollable Page Content */}
                <div className="relative z-10 flex-grow flex flex-col p-4 md:p-10 overflow-y-auto">

                    {/* Page Header */}
                    <div className="mb-8 flex justify-between items-end border-b border-outline-variant pb-4">
                        <div>
                            <p className="font-mono text-xs text-tertiary mb-2 uppercase tracking-widest">ACTIVE DEPLOYMENT</p>
                            <h2 className="font-grotesk text-5xl text-on-surface uppercase tracking-tight font-bold">LOBBY</h2>
                        </div>
                        <div className="hidden md:flex gap-4">
                            <div className="font-mono text-xs text-on-surface-variant flex items-center gap-2 border border-outline-variant px-3 py-1 bg-surface-container-low shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] tracking-widest">
                                <span className="material-symbols-outlined text-tertiary text-sm">public</span>
                                GLOBAL_NET: ONLINE
                            </div>
                        </div>
                    </div>

                    {/* Layout Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-[1440px] w-full mx-auto">
                        <RoomList />
                        <CreateRoomModal />
                    </div>

                </div>
            </main>

        </div>
    );
}