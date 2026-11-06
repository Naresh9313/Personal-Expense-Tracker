import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import confetti from "canvas-confetti";

export default function Fireworks() {
  const location = useLocation();

  useEffect(() => {
    const end = Date.now() + 100;

    const colors = [
      "#ff0000",
      "#ff9900",
      "#ffff00",
      "#00ff00",
      "#00ccff",
      "#9933ff",
      "#ff66cc",
    ];

    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 25,
        spread: 360,
        startVelocity: 30,
        gravity: 0.8,
        ticks: 30,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        colors,
      });
    }, 50);

    return () => clearInterval(interval);
  }, [location.pathname]);

  return null;
}
