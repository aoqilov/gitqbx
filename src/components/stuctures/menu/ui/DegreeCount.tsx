import React from "react";
import "./degreeCount.css";
import { useColorMode } from "@/components/ui/provider/color-mode";

const DegreeCount = ({ percent = 47, size = 200, color = "#7d2ae8" }) => {
  // To'lqin darajasi
  const waveTop = 100 - percent; // pastdan yuqoriga foiz
  const { colorMode } = useColorMode();

  return (
    <div
      className="liquid-container "
      style={{
        width: size,
        height: size,
        border: `1px solid ${color}`,
        backgroundColor: colorMode == "light" ? "#FFF" : "#262626",
      }}
    >
      {/* Foiz matni */}
      <span
        className="percent-text"
        style={{ color: percent > 90 ? "#fff" : "#999" }}
      >
        {percent}
      </span>

      {/* To'lqin */}
      <div className="wave-wrapper" style={{ top: 50 }}>
        <svg
          className="wave-svg"
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
        >
          <path fill={color} />
        </svg>
      </div>
    </div>
  );
};

export default DegreeCount;
