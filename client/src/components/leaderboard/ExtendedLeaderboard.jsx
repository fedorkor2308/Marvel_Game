import React from 'react';

export default function ExtendedLeaderboard() {
    const operators = [
        { rank: '04', id: 'OPR-772', codename: 'NOMAD', hours: '8,420', kills: 98 },
        { rank: '05', id: 'OPR-201', codename: 'STRIKE', hours: '7,105', kills: 84 },
        { rank: '06', id: 'OPR-555', codename: 'ECHO', hours: '6,990', kills: 79 },
    ];

    return (
        <div className="flex-1 w-full border border-outline-variant bg-surface-container-low flex flex-col relative overflow-hidden mt-8">

            {/* Module Header */}
            <div className="flex justify-between items-center border-b border-outline-variant bg-surface-container-highest p-2">
                <span className="font-mono text-xs text-on-surface uppercase tracking-[0.2em] pl-2 font-bold">EXTENDED LEADERBOARD</span>
                <span className="font-mono text-[10px] text-outline-variant bg-surface px-2 border border-outline-variant">MOD-042</span>
            </div>

            {/* Table Headers */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-outline-variant font-mono text-[10px] text-outline uppercase bg-surface-container-lowest tracking-widest">
                <div className="col-span-2">RANK</div>
                <div className="col-span-5">OPERATOR ID / CODENAME</div>
                <div className="col-span-3 text-right">MISSION HRS</div>
                <div className="col-span-2 text-right">KILLS</div>
            </div>

            {/* Table Rows */}
            <div className="flex flex-col overflow-y-auto">
                {operators.map((op) => (
                    <div key={op.id} className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-outline-variant items-center hover:bg-surface-variant border-l-4 border-transparent hover:border-l-primary transition-colors cursor-crosshair group">
                        <div className="col-span-2 font-grotesk text-2xl text-on-surface-variant font-bold">{op.rank}</div>

                        <div className="col-span-5 flex items-center gap-4">
                            <div className="w-8 h-8 border border-outline-variant bg-surface-container-highest flex items-center justify-center group-hover:border-primary group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[16px]">person</span>
                            </div>
                            <div>
                                <div className="font-mono text-sm text-on-surface font-bold">{op.id}</div>
                                <div className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">{op.codename}</div>
                            </div>
                        </div>

                        <div className="col-span-3 text-right font-mono text-sm text-outline">{op.hours}</div>
                        <div className="col-span-2 text-right font-grotesk text-2xl text-tertiary font-bold">{op.kills}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}