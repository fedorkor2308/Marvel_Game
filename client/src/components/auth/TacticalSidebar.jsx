import cardArt from "../../assets/nick_fury.png";

export function TacticalSidebar() {
    return (
        <div
            className="lg:col-span-7 relative bg-surface-container-lowest border-b lg:border-b-0 lg:border-r border-outline-variant min-h-[280px] lg:min-h-full overflow-hidden">
            <img src={cardArt} alt="" className="absolute inset-0 w-full h-full object-cover object-center opacity-80"/>

            <div className="absolute inset-0 blueprint-grid"/>
            <div className="absolute inset-0 scanlines opacity-30"/>
            <div className="absolute inset-0 bg-surface-container-lowest/30"/>

            {['top-4 left-4 border-t-2 border-l-2', 'top-4 right-4 border-t-2 border-r-2',
                'bottom-4 left-4 border-b-2 border-l-2', 'bottom-4 right-4 border-b-2 border-r-2']
                .map((cls, i) => (
                    <div key={i} className={`absolute w-5 h-5 border-primary/35 ${cls}`}/>
                ))}

            <div className="absolute top-6 left-8 z-10">
        <span
            className="font-mono text-[10px] text-secondary/50 border border-secondary/20 px-2 py-0.5 uppercase tracking-widest">
          SYS.AUTH.REG
        </span>
            </div>

            <div className="absolute bottom-6 right-8 flex items-end gap-1 opacity-40 z-10">
                {[5, 3, 7, 4, 6, 8, 3].map((h, i) => (
                    <div key={i} className="w-1 bg-primary" style={{height: h * 3}}/>
                ))}
            </div>
        </div>
    )
}