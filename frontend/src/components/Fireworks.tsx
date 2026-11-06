
import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function Fireworks() {
  useEffect(() => {
    const fireworks = () => {
      confetti({
        particleCount: 150,
        spread: 360,
        startVelocity: 45,
        gravity: 0.8,
        ticks: 200,
        origin: {
          x: 0.5,
          y: 0.5,
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

    fireworks();
  }, []);

  return null;
}
