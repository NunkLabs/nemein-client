"use client";

import Game from "./(game)/Game";

export default function HomePage() {
  return (
    <div className="bg-gray-800 h-screen min-w-fit relative">
      <Game />
    </div>
  );
}
