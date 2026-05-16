import React from 'react';

export default function Sidebar() {
    return (
        <nav className="hidden md:flex flex-col z-40 h-screen w-64 docked left-0 border-r border-outline-variant bg-surface-container-high shadow-[2px_0px_0px_0px_rgba(0,0,0,1)] fixed top-0">

            {/* Brand Header */}
            <div className="p-gutter border-b border-outline-variant">
                <h1 className="font-grotesk text-3xl text-primary font-black uppercase">STRAT_OS</h1>
            </div>

            {/* User Profile */}
            <div className="p-gutter border-b border-outline-variant flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center border border-outline">
                    <span className="material-symbols-outlined text-on-surface">account_circle</span>
                </div>
                <div>
                    <p className="font-mono text-sm text-tertiary uppercase font-bold">OPR-092</p>
                    <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">SECTOR-7 GARRISON</p>
                </div>
            </div>

            {/* Navigation Links */}
            <ul className="flex-grow flex flex-col pt-4">
                <li className="px-4 py-2">
                    <a className="flex items-center gap-3 px-3 py-2 bg-primary text-on-primary font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform duration-100 active:scale-95 border border-primary" href="#">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>radar</span>
                        <span className="font-mono text-sm tracking-widest uppercase">DEPLOY</span>
                    </a>
                </li>
                <li className="px-4 py-2">
                    <a className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface hover:border-l-4 hover:border-primary transition-all duration-100 active:scale-95" href="#">
                        <span className="material-symbols-outlined">groups</span>
                        <span className="font-mono text-sm tracking-widest uppercase">UNITS</span>
                    </a>
                </li>
                <li className="px-4 py-2">
                    <a className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface hover:border-l-4 hover:border-primary transition-all duration-100 active:scale-95" href="#">
                        <span className="material-symbols-outlined">database</span>
                        <span className="font-mono text-sm tracking-widest uppercase">STORES</span>
                    </a>
                </li>
                <li className="px-4 py-2">
                    <a className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface hover:border-l-4 hover:border-primary transition-all duration-100 active:scale-95" href="#">
                        <span className="material-symbols-outlined">terminal</span>
                        <span className="font-mono text-sm tracking-widest uppercase">LOGS</span>
                    </a>
                </li>
            </ul>

            {/* Footer Actions */}
            <div className="p-gutter border-t border-outline-variant">
                <button className="w-full py-3 bg-surface-container text-primary border-2 border-outline-variant font-mono text-sm tracking-widest uppercase hover:border-primary hover:bg-surface-variant transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none mb-4 corner-cut">
                    SYSTEM_REBOOT
                </button>
                <a className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface hover:border-l-4 hover:border-primary transition-all" href="#">
                    <span className="material-symbols-outlined">settings</span>
                    <span className="font-mono text-sm tracking-widest uppercase">SETTINGS</span>
                </a>
            </div>
        </nav>
    );
}