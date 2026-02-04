import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  WiMoonAltFull,
  WiMoonAltWaningGibbous1,
  WiMoonAltWaningGibbous2,
  WiMoonAltWaningGibbous3,
  WiMoonAltWaningGibbous4,
  WiMoonAltWaningGibbous5,
  WiMoonAltWaningGibbous6,
  WiMoonAltWaningCrescent4,
  WiMoonAltWaningCrescent5,
  WiMoonAltWaningCrescent6,
  WiMoonAltNew,
} from "react-icons/wi";

const MoonAnimation = () => {
  const [animationKey, setAnimationKey] = useState(0); // Key to trigger restart of animation

  const moonIcons = [
    <WiMoonAltFull size={80} />,
    <WiMoonAltWaningGibbous1 size={80} />,
    <WiMoonAltWaningGibbous2 size={80} />,
    <WiMoonAltWaningGibbous3 size={80} />,
    <WiMoonAltWaningGibbous4 size={80} />,
    <WiMoonAltWaningGibbous5 size={80} />,
    <WiMoonAltWaningGibbous6 size={80} />,
    <WiMoonAltWaningCrescent4 size={80} />,
    <WiMoonAltWaningCrescent5 size={80} />,
    <WiMoonAltWaningCrescent6 size={80} />,
    <WiMoonAltNew size={80} />,
  ];

  // Function to reset animation after one full cycle
  const handleAnimationComplete = () => {
    setAnimationKey((prevKey) => prevKey + 1); // Change the key to restart the animation
  };

  return (
    <motion.div
      key={animationKey} // This will trigger the entire animation to restart
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        position: "relative",
        filter: "invert(1)",
      }}
    >
      {moonIcons.map((icon, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1 }} // Start with hidden and normal size
          animate={{
            opacity: [0, 1, 0], // Fade in, stay, then fade out
            scale: [1, 1, 1], // No scaling, just a smooth transition
          }}
          transition={{
            duration: 2, // Total duration for each icon
            repeat: Infinity, // Repeat animation forever
            repeatType: "loop",
            delay: index * 2, // Delay each icon appearance
          }}
          style={{
            position: "absolute", // Icons overlap each other
          }}
          onAnimationComplete={handleAnimationComplete} // Trigger restart after each cycle
        >
          {icon}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MoonAnimation;
