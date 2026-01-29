"use client";

import React from "react";

// GHS Pictogram types
export type GHSPictogramType = 
  | "Flame"
  | "Exclamation Mark"
  | "Health Hazard"
  | "Corrosion"
  | "Skull and Crossbones"
  | "Environment"
  | "Oxidizer"
  | "Gas Cylinder"
  | "Exploding Bomb";

export const ALL_PICTOGRAMS: GHSPictogramType[] = [
  "Flame",
  "Exclamation Mark",
  "Health Hazard",
  "Corrosion",
  "Skull and Crossbones",
  "Environment",
  "Oxidizer",
  "Gas Cylinder",
  "Exploding Bomb"
];

interface GHSPictogramProps {
  type: GHSPictogramType;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-14 h-14",
  xl: "w-20 h-20"
};

const innerSizeClasses = {
  sm: "w-[22px] h-[22px]",
  md: "w-[28px] h-[28px]",
  lg: "w-[40px] h-[40px]",
  xl: "w-[56px] h-[56px]"
};

// GHS pictograms are red diamonds with black symbols on white background
const PictogramWrapper: React.FC<{ children: React.ReactNode; size: "sm" | "md" | "lg" | "xl"; className?: string }> = ({ 
  children, 
  size,
  className = ""
}) => (
  <div 
    className={`${sizeClasses[size]} ${className} relative flex items-center justify-center flex-shrink-0`}
    style={{
      transform: "rotate(45deg)",
      border: size === "sm" ? "2px solid #dc2626" : size === "md" ? "2.5px solid #dc2626" : "3px solid #dc2626",
      backgroundColor: "white",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
    }}
  >
    <div 
      style={{ transform: "rotate(-45deg)" }} 
      className={`${innerSizeClasses[size]} flex items-center justify-center`}
    >
      {children}
    </div>
  </div>
);

// Individual pictogram SVG icons
const FlameIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5">
    <path d="M12 2c0 4-3 6-3 10a5 5 0 0010 0c0-4-3-6-3-10" fill="#000" stroke="none"/>
    <path d="M12 22c-4 0-7-3-7-7 0-3 2-5 3-7 1 2 2 3 4 3s3-1 4-3c1 2 3 4 3 7 0 4-3 7-7 7z" fill="#000" stroke="none"/>
  </svg>
);

const ExclamationMarkIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#000">
    <rect x="10" y="4" width="4" height="11" rx="1"/>
    <circle cx="12" cy="19" r="2"/>
  </svg>
);

const HealthHazardIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#000">
    <path d="M12 4c-2 0-3.5 1.5-3.5 3.5S10 11 12 11s3.5-1.5 3.5-3.5S14 4 12 4z"/>
    <path d="M12 13c-3 0-5 2-5 4v3h10v-3c0-2-2-4-5-4z"/>
    <path d="M8 9l-2 2 2 2M16 9l2 2-2 2" stroke="#000" strokeWidth="1.5" fill="none"/>
    <path d="M7 15l-3 1M17 15l3 1" stroke="#000" strokeWidth="1.5"/>
  </svg>
);

const CorrosionIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#000">
    <path d="M8 4h8l-2 6h3l-7 10 2-7H9l-1-9z"/>
    <ellipse cx="12" cy="20" rx="4" ry="1.5" fill="none" stroke="#000" strokeWidth="1"/>
    <path d="M6 19c0-2 2-3 3-4M18 19c0-2-2-3-3-4" stroke="#000" strokeWidth="1" fill="none"/>
  </svg>
);

const SkullIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#000">
    <circle cx="12" cy="10" r="7" fill="none" stroke="#000" strokeWidth="1.5"/>
    <circle cx="9" cy="9" r="1.5"/>
    <circle cx="15" cy="9" r="1.5"/>
    <path d="M9 14h6M10 14v3M14 14v3" stroke="#000" strokeWidth="1.5"/>
    <path d="M8 17l-1 4h2M16 17l1 4h-2" stroke="#000" strokeWidth="1.5" fill="none"/>
  </svg>
);

const EnvironmentIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#000">
    <path d="M12 3c-3 0-6 3-6 6 0 4 6 9 6 9s6-5 6-9c0-3-3-6-6-6z" fill="none" stroke="#000" strokeWidth="1.5"/>
    <path d="M4 18c2-1 4-1 6 0s4 1 6 0 4-1 6 0" stroke="#000" strokeWidth="1.5" fill="none"/>
    <ellipse cx="12" cy="20" rx="3" ry="1"/>
  </svg>
);

const OxidizerIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#000">
    <circle cx="12" cy="14" r="5" fill="none" stroke="#000" strokeWidth="1.5"/>
    <path d="M12 4v6M9 7l3 3 3-3" stroke="#000" strokeWidth="1.5" fill="none"/>
    <path d="M10 12a2 2 0 014 0" fill="none" stroke="#000" strokeWidth="1"/>
  </svg>
);

const GasCylinderIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#000">
    <rect x="8" y="6" width="8" height="14" rx="3" fill="none" stroke="#000" strokeWidth="1.5"/>
    <path d="M10 6V4h4v2" stroke="#000" strokeWidth="1.5" fill="none"/>
    <line x1="8" y1="10" x2="16" y2="10" stroke="#000" strokeWidth="1"/>
    <line x1="8" y1="14" x2="16" y2="14" stroke="#000" strokeWidth="1"/>
  </svg>
);

const ExplodingBombIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#000">
    <circle cx="12" cy="14" r="5"/>
    <path d="M12 9V6M14 7l2-3M10 7l-2-3" stroke="#000" strokeWidth="1.5" fill="none"/>
    <path d="M5 5l2 2M19 5l-2 2M5 19l3-2M19 19l-3-2" stroke="#000" strokeWidth="1.5" fill="none"/>
  </svg>
);

// Map pictogram types to their icons
const pictogramIcons: Record<GHSPictogramType, React.FC<{ className?: string }>> = {
  "Flame": FlameIcon,
  "Exclamation Mark": ExclamationMarkIcon,
  "Health Hazard": HealthHazardIcon,
  "Corrosion": CorrosionIcon,
  "Skull and Crossbones": SkullIcon,
  "Environment": EnvironmentIcon,
  "Oxidizer": OxidizerIcon,
  "Gas Cylinder": GasCylinderIcon,
  "Exploding Bomb": ExplodingBombIcon
};

// Main GHS Pictogram component
export function GHSPictogram({ type, size = "md", showLabel = false, className = "" }: GHSPictogramProps) {
  const IconComponent = pictogramIcons[type];
  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-8 h-8",
    xl: "w-11 h-11"
  };
  const iconSize = iconSizes[size];

  return (
    <div className={`flex flex-col items-center gap-2 relative group ${className}`}>
      <PictogramWrapper size={size}>
        <IconComponent className={iconSize} />
      </PictogramWrapper>
      {showLabel && (
        <span className="text-xs text-gray-600 text-center whitespace-nowrap mt-0.5">{type}</span>
      )}
      {/* Hover tooltip - only show when label is not visible */}
      {!showLabel && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-[100]">
          {type}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900" />
        </div>
      )}
    </div>
  );
}

// Multiple pictograms display component
interface GHSPictogramListProps {
  pictograms: GHSPictogramType[];
  size?: "sm" | "md" | "lg" | "xl";
  showLabels?: boolean;
  className?: string;
}

export function GHSPictogramList({ pictograms, size = "sm", showLabels = false, className = "" }: GHSPictogramListProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {pictograms.map((type) => (
        <GHSPictogram key={type} type={type} size={size} showLabel={showLabels} />
      ))}
    </div>
  );
}

// Pictogram selector for forms
interface GHSPictogramSelectorProps {
  selected: GHSPictogramType[];
  onChange: (selected: GHSPictogramType[]) => void;
  className?: string;
}

export function GHSPictogramSelector({ selected, onChange, className = "" }: GHSPictogramSelectorProps) {
  const togglePictogram = (type: GHSPictogramType) => {
    if (selected.includes(type)) {
      onChange(selected.filter(p => p !== type));
    } else {
      onChange([...selected, type]);
    }
  };

  return (
    <div className={`grid grid-cols-3 gap-3 ${className}`}>
      {ALL_PICTOGRAMS.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => togglePictogram(type)}
          className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
            selected.includes(type)
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300 bg-white"
          }`}
        >
          <GHSPictogram type={type} size="md" />
          <span className="text-xs text-gray-700 text-center">{type}</span>
        </button>
      ))}
    </div>
  );
}

export default GHSPictogram;
