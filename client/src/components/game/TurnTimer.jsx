export default function TurnTimer({ seconds = 30 }) {
    const display = String(seconds).padStart(2, '0')

    return (
        <section className="flex-none h-14 w-full flex items-center justify-center relative">
            {/* Line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-outline-variant" />
            {/* Timer pill */}
            <div className="relative bg-surface-container border border-outline-variant px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 z-10">
                <span className="text-tertiary text-sm animate-pulse">⏱</span>
                <span className="font-mono text-sm text-tertiary tracking-widest">
          00:{display}
        </span>
            </div>
        </section>
    )
}