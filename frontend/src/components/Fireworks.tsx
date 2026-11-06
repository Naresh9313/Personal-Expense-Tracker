
import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function Fireworks() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;

      confetti({
        particleCount: 80,
        spread: 100,
        startVelocity: 35,
        origin: {
          x,
          y,
        },
        colors: [
          "#ff0000",
          "#ff9900",
          "#ffff00",
          "#00ff00",
          "#00ccff",
          "#9933ff",
          "#ff66cc",
        ],
      });
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}
