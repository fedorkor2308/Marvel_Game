export default function TurnTimer({ seconds = 30 }) {
    const display = String(Math.max(0, seconds)).padStart(2, '0')
    const urgent  = seconds <= 10

    return (
        <section className="flex-none h-14 w-full flex items-center justify-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-outline-variant" />
            <div className={`relative bg-surface-container border px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 z-10 transition-colors ${urgent ? 'border-primary' : 'border-outline-variant'}`}>
                <span className={`text-sm ${urgent ? 'text-primary animate-pulse' : 'text-tertiary animate-pulse'}`}>⏱</span>
                <span className={`font-mono text-sm tracking-widest ${urgent ? 'text-primary' : 'text-tertiary'}`}>
                    00:{display}
                </span>
            </div>
        </section>
    )
}
