'use client';

export default function ScrollingTextBlock() {
  return (
    <div className="absolute top-0 overflow-hidden whitespace-nowrap text-white p-4 z-50 cursor-pointer">
      <div className="animate-marquee inline-block hover:animate-paused">
        🔥 Bot service is temporarily suspended due to AWS hosting costs! 🔥
        &nbsp;&nbsp;&nbsp;
        🤖 Click on <strong>Icon Chat</strong> in the right down corner of screen!
        &nbsp;&nbsp;&nbsp;
        🔥 Bot service is temporarily suspended due to AWS hosting costs! 🔥
        &nbsp;&nbsp;&nbsp;
        🤖 Click on <strong>Icon Chat</strong> in the right down corner of screen!
        &nbsp;&nbsp;&nbsp;
      </div>
    </div>
  );
}
