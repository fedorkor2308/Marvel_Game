import React from 'react';

export default function MobileHeader() {
    return (
        <header className="md:hidden w-full border-b border-outline-variant bg-surface-container-low shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-30">
            <div className="flex justify-between items-center w-full px-4 py-4 mx-auto">
                <div className="font-grotesk text-2xl font-bold text-primary tracking-tighter uppercase">STRAT_OS</div>
                <div className="flex gap-4">
                    <button className="text-primary hover:bg-surface-variant hover:text-on-surface p-2 rounded-sm transition-all active:translate-y-0.5 border border-transparent hover:border-outline-variant">
                        <span className="material-symbols-outlined">settings</span>
                    </button>
                    <button className="text-primary hover:bg-surface-variant hover:text-on-surface p-2 rounded-sm transition-all active:translate-y-0.5 border border-transparent hover:border-outline-variant">
                        <span className="material-symbols-outlined">account_circle</span>
                    </button>
                </div>
            </div>

            <div className="flex border-t border-outline-variant overflow-x-auto">
                <a className="px-6 py-3 font-mono text-xs text-primary border-b-2 border-primary uppercase flex-shrink-0 font-bold" href="#">DEPLOY</a>
                <a className="px-6 py-3 font-mono text-xs text-outline hover:text-on-surface transition-colors uppercase flex-shrink-0" href="#">UNITS</a>
                <a className="px-6 py-3 font-mono text-xs text-outline hover:text-on-surface transition-colors uppercase flex-shrink-0" href="#">STORES</a>
                <a className="px-6 py-3 font-mono text-xs text-outline hover:text-on-surface transition-colors uppercase flex-shrink-0" href="#">LOGS</a>
            </div>
        </header>
    );
}