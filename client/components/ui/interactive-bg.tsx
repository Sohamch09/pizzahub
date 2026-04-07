import { useEffect, useState } from "react";

export function InteractiveBg() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-background">
        {/* Base Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Static Animated Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Interactive Mouse Glow */}
      <div 
        className="fixed inset-0 z-[100] pointer-events-none mix-blend-screen transition-opacity duration-300"
        style={{
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(234, 88, 12, 0.08), transparent 40%)`
        }}
      />
    </>
  );
}
