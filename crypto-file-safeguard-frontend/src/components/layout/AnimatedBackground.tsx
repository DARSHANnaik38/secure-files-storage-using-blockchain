import { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim"; // loads a lightweight version of the library

const AnimatedBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    // This loads the tsparticles package bundle, it's required for it to work
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: "#111827", // This is your dark gray background color
          },
        },
        fpsLimit: 60,
        particles: {
          number: {
            value: 40, // Number of particles on screen
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: "#ffffff",
          },
          shape: {
            type: "image",
            image: {
              // You can use an SVG icon of a file or document here
              src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'/%3E%3Cpolyline points='14 2 14 8 20 8'/%3E%3C/svg%3E",
              width: 100,
              height: 100,
            },
          },
          opacity: {
            value: 0.5,
            random: true,
          },
          size: {
            value: 12,
            random: { enable: true, minimumValue: 5 },
          },
          move: {
            enable: true,
            speed: 3,
            direction: "top", // Particles move upwards
            straight: true,
            out_mode: "out",
          },
        },
        interactivity: {
          detectsOn: "canvas",
          events: {
            onHover: {
              enable: true,
              mode: "bubble",
            },
            resize: true,
          },
          modes: {
            bubble: {
              distance: 200,
              size: 20,
              duration: 2,
              opacity: 1,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default AnimatedBackground;
