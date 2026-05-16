export default function CardOnBoard({ card = null, isPlayer = false }) {
    const size = isPlayer ? 'w-28 h-40' : 'w-24 h-32'

    if (!card) {
        return (
            <div className={`${size} bg-surface border border-outline-variant flex items-center justify-center`}
                 style={{ boxShadow: 'inset 4px 4px 0px 0px rgba(0,0,0,0.8)' }}>
                <span className="text-outline/30 text-2xl">+</span>
            </div>
        )
    }

    return (
        <div className={`${size} bg-surface-container-high border border-primary p-1.5 flex flex-col shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
            <div className="flex-1 bg-surface-container relative overflow-hidden mb-1">
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] text-outline/40">ART</span>
                <div className="absolute top-1 left-1 bg-surface-container-highest px-1 border border-primary/50">
                    <span className="font-mono text-[9px] text-primary">{card.cost}</span>
                </div>
            </div>
            <span className="font-mono text-[9px] text-on-surface uppercase truncate">{card.name}</span>
            <div className="flex justify-between mt-1">
                <span className="font-mono text-[9px] text-outline">⚔ {card.attack}</span>
                <span className="font-mono text-[9px] text-outline">🛡 {card.defense}</span>
            </div>
        </div>
    )
}