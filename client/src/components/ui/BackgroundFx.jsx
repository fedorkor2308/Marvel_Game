import React from 'react';

export default function BackgroundFx() {
    return (
        <>
            {/* Blueprint Grid */}
            <div className="absolute inset-0 z-0 blueprint-grid opacity-30 pointer-events-none"></div>

            {/* CRT Overlay */}
            <div className="absolute inset-0 z-20 scanlines opacity-40 pointer-events-none"></div>

            {/* Corner Crosshairs */}
            <div className="fixed top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-outline-variant opacity-50 m-4 pointer-events-none z-50"></div>
            <div className="fixed top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-outline-variant opacity-50 m-4 pointer-events-none z-50"></div>
            <div className="fixed bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-outline-variant opacity-50 m-4 pointer-events-none z-50"></div>
            <div className="fixed bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-outline-variant opacity-50 m-4 pointer-events-none z-50"></div>
        </>
    );
}