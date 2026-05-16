import React from 'react';

export default function CreateRoomModal() {
    return (
        <div className="md:col-span-4 flex flex-col gap-4">

            {/* Action Card */}
            <div className="bg-surface-container border border-outline-variant p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
                <div className="absolute top-2 right-2 font-mono text-xs text-outline uppercase tracking-widest">MOD-042</div>

                <h3 className="font-grotesk text-2xl text-on-surface uppercase mb-4 font-bold">NEW_DEPLOY</h3>
                <p className="font-grotesk text-sm text-on-surface-variant mb-6">Initialize a new operative instance and await team connection.</p>

                <div className="space-y-4">
                    <div className="relative">
                        <input
                            className="w-full bg-surface-container-highest border-b-2 border-outline-variant p-3 font-mono text-sm text-on-surface placeholder-outline focus:border-primary focus:bg-primary/5 focus:outline-none transition-all uppercase tracking-wider"
                            placeholder="ENTER_MISSION_CODE..."
                            type="text"
                        />
                    </div>

                    <button className="w-full bg-primary text-on-primary font-mono text-sm font-bold uppercase tracking-widest py-4 corner-cut shadow-[4px_4px_0px_0px_rgba(255,180,170,0.2)] hover:bg-primary-container active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">add_box</span>
                        HOST_SESSION
                    </button>
                </div>
            </div>

            {/* Telemetry Readout */}
            <div className="bg-surface-container-high border border-outline-variant p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-mono text-xs text-outline uppercase tracking-widest mb-2 border-b border-outline-variant pb-2">NETWORK_TELEMETRY</p>

                <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                        <span className="font-mono text-xs text-on-surface-variant uppercase">PING</span>
                        <span className="font-mono text-sm text-tertiary">24ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-mono text-xs text-on-surface-variant uppercase">ACTIVE_OPS</span>
                        <span className="font-mono text-sm text-on-surface">1,042</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-mono text-xs text-on-surface-variant uppercase">SERVER_LOAD</span>
                        <span className="font-mono text-sm text-on-surface">42%</span>
                    </div>

                    {/* Segmented Bar */}
                    <div className="flex gap-1 h-2 mt-4 w-full">
                        <div className="bg-primary flex-1"></div>
                        <div className="bg-primary flex-1"></div>
                        <div className="bg-primary flex-1"></div>
                        <div className="bg-primary flex-1"></div>
                        <div className="bg-surface-container-highest flex-1"></div>
                        <div className="bg-surface-container-highest flex-1"></div>
                        <div className="bg-surface-container-highest flex-1"></div>
                        <div className="bg-surface-container-highest flex-1"></div>
                        <div className="bg-surface-container-highest flex-1"></div>
                        <div className="bg-surface-container-highest flex-1"></div>
                    </div>
                </div>
            </div>

        </div>
    );
}