import React from 'react';
import Sidebar from '../components/ui/Sidebar';
import MobileHeader from '../components/ui/MobileHeader';
import BackgroundFx from '../components/ui/BackgroundFx';
import TopAgentCard from '../components/leaderboard/TopAgentCard';
import ExtendedLeaderboard from '../components/leaderboard/ExtendedLeaderboard';

export default function LeaderboardPage() {
    return (
        <div className="bg-background text-on-surface font-grotesk min-h-screen relative flex">
            <BackgroundFx />
            <Sidebar />

            <main className="flex-grow md:ml-64 relative overflow-hidden flex flex-col h-screen z-10">
                <MobileHeader />

                {/* Main Content Area centered for the CRT frame */}
                <div className="relative z-10 flex-grow flex flex-col p-4 md:p-8 items-center justify-center overflow-y-auto">

                    {/* Industrial CRT Frame Monitor */}
                    <div className="w-full max-w-[1280px] border-[12px] border-surface-container-highest bg-surface-container-lowest shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative flex flex-col p-2 corner-cut">

                        {/* CRT Inner Screen Bezel */}
                        <div className="w-full relative border-4 border-outline-variant bg-background overflow-hidden flex flex-col p-6 md:p-10">

                            {/* Tactical Background Grid (Isolated to screen) */}
                            <div className="absolute inset-0 blueprint-grid opacity-30 pointer-events-none"></div>

                            <div className="relative z-10">
                                {/* Top Bar HUD Elements */}
                                <div className="flex justify-between items-center border-b border-outline-variant pb-4 mb-8">
                                    <div className="flex items-center gap-4">
                                        <span className="material-symbols-outlined text-primary animate-pulse glow-red">emergency</span>
                                        <div className="font-mono text-xs text-primary uppercase tracking-widest">
                                            SECURE UPLINK ESTABLISHED // <span className="text-on-surface-variant">NODE: 74-ALPHA</span>
                                        </div>
                                    </div>
                                    <div className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest border border-outline-variant px-2 py-1 bg-surface-container">
                                        ARCHIVE: CLASSIFIED
                                    </div>
                                </div>

                                {/* Main Title */}
                                <div className="mb-12 relative inline-block">
                                    <h2 className="font-grotesk text-6xl text-on-surface uppercase font-black tracking-tighter leading-none relative z-10 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                                        TOP AGENTS<br/>
                                        <span className="text-primary text-glow-red">SEASON 1</span>
                                    </h2>
                                    <div className="absolute top-1/2 left-0 w-[120%] h-[1px] bg-outline-variant z-0 transform -translate-y-1/2 opacity-50"></div>
                                </div>

                                {/* Top 3 Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <TopAgentCard
                                        rank={2}
                                        id="OPR-818"
                                        codename="VIPER"
                                        kills={129}
                                        imageSrc="https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=600&auto=format&fit=crop"
                                    />
                                    <TopAgentCard
                                        rank={1}
                                        id="OPR-404"
                                        codename="KESTREL"
                                        kills={142}
                                        imageSrc="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop"
                                    />
                                    <TopAgentCard
                                        rank={3}
                                        id="OPR-112"
                                        codename="GHOST"
                                        kills={115}
                                        imageSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop"
                                    />
                                </div>

                                <ExtendedLeaderboard />
                            </div>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}