import React from 'react';

export default function TopAgentCard({ rank, id, codename, kills, imageSrc }) {
    const isFirst = rank === 1;

    return (
        <div className={`relative flex flex-col justify-end p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-surface-container ${
            isFirst
                ? 'border-2 border-primary z-20 md:-translate-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                : 'border border-outline-variant mt-8'
        }`}>

            {/* Rank Badge */}
            <div className={`absolute -top-3 -right-3 font-mono text-xs px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 uppercase tracking-widest font-bold ${
                isFirst ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-outline border border-outline-variant'
            }`}>
                {isFirst && <span className="material-symbols-outlined text-[14px]">workspace_premium</span>}
                RANK 0{rank}
            </div>

            <img
                alt={`Rank ${rank} Agent`}
                className={`w-full object-cover mb-4 filter contrast-125 ${
                    isFirst ? 'h-64 border-2 border-primary sepia-[.2]' : 'h-48 border border-outline-variant grayscale'
                }`}
                src={imageSrc}
            />

            <h3 className={`font-grotesk text-3xl uppercase font-bold leading-none ${isFirst ? 'text-primary' : 'text-on-surface'}`}>
                {id}
            </h3>
            <p className={`font-mono text-xs uppercase tracking-widest mb-4 mt-1 ${isFirst ? 'text-primary/80' : 'text-on-surface-variant'}`}>
                CODENAME: {codename}
            </p>

            <div className={`border-t pt-2 flex justify-between items-center ${isFirst ? 'border-primary/30' : 'border-outline-variant'}`}>
        <span className={`font-mono text-[10px] uppercase tracking-widest ${isFirst ? 'text-primary' : 'text-outline'}`}>
          CONFIRMED KILLS
        </span>
                <span className={`font-grotesk text-4xl font-black ${isFirst ? 'text-primary text-glow-red' : 'text-on-surface'}`}>
          {kills}
        </span>
            </div>
        </div>
    );
}