const MOCK_HAND = [
    { id: 1, name: 'THE HULK',     cost: 5, attack: 6, defense: 8, rotate: '-rotate-6',  ty: 'translate-y-4' },
    { id: 2, name: 'CAPT. MARVEL', cost: 6, attack: 8, defense: 5, rotate: 'rotate-0',   ty: '' },
    { id: 3, name: 'IRON MAN',     cost: 4, attack: 7, defense: 6, rotate: 'rotate-3',   ty: 'translate-y-2' },
]

export default function PlayerHand({ cards = MOCK_HAND }) {
    return (
        <div className="h-48 w-full flex justify-center items-end gap-2 pb-0">
            {cards.map((card) => (
                <div
                    key={card.id}
                    className={`
            w-32 h-48 bg-surface-container-high border border-primary/60
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 flex flex-col
            hover:-translate-y-4 transition-transform cursor-pointer
            ${card.rotate} ${card.ty}
          `}
                >
                    {/* Art area */}
                    <div className="h-24 w-full bg-surface border border-outline-variant mb-2 relative overflow-hidden">
                        <div className="absolute inset-0 blueprint-grid opacity-40" />
                        <div className="absolute top-1 left-1 bg-surface-container-highest px-1 border border-primary/60">
                            <span className="font-mono text-[10px] text-primary">{card.cost}</span>
                        </div>
                        <span className="absolute inset-0 flex items-end justify-center pb-1 font-mono text-[9px] text-outline/30">ART</span>
                    </div>

                    {/* Name */}
                    <span className="font-mono text-[10px] text-on-surface font-bold uppercase truncate">
            {card.name}
          </span>

                    {/* Stats */}
                    <div className="mt-auto flex justify-between">
                        <span className="font-mono text-[9px] text-outline">⚔ {card.attack}</span>
                        <span className="font-mono text-[9px] text-outline">🛡 {card.defense}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}