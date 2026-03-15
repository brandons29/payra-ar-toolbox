/**
 * Subtle construction-inspired SVG background patterns.
 * All patterns use the Payra brand green at extremely low opacity
 * to evoke construction/industrial themes without competing with content.
 */

/** Blueprint grid — thin lines suggesting architectural drawings */
export function BlueprintGrid() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="blueprint-grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          {/* Major grid */}
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.07"
          />
          {/* Minor grid */}
          <path
            d="M 20 0 L 20 40 M 0 20 L 40 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.3"
            opacity="0.04"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
    </svg>
  );
}

/** Steel crosshatch — diagonal lines like I-beam cross-sections */
export function SteelCrosshatch() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="steel-hatch"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0" y1="0" x2="0" y2="24"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.05"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#steel-hatch)" />
    </svg>
  );
}

/** Concrete speckle — scattered dots suggesting aggregate texture */
export function ConcreteSpeckle() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <filter id="concrete-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="4"
            seed="2"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="saturate"
            values="0"
          />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.04" intercept="0" />
          </feComponentTransfer>
        </filter>
      </defs>
      <rect width="100%" height="100%" filter="url(#concrete-noise)" />
    </svg>
  );
}

/** Topographic contour lines — terrain/elevation lines suggesting construction sites */
export function TopoContours() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 800 600"
    >
      <g stroke="currentColor" fill="none" strokeWidth="0.6" opacity="0.045">
        <ellipse cx="200" cy="300" rx="120" ry="80" />
        <ellipse cx="200" cy="300" rx="180" ry="130" />
        <ellipse cx="200" cy="300" rx="250" ry="180" />
        <ellipse cx="200" cy="300" rx="330" ry="240" />
        <ellipse cx="600" cy="250" rx="100" ry="70" />
        <ellipse cx="600" cy="250" rx="160" ry="120" />
        <ellipse cx="600" cy="250" rx="230" ry="170" />
        <ellipse cx="600" cy="250" rx="310" ry="230" />
        <ellipse cx="400" cy="500" rx="80" ry="50" />
        <ellipse cx="400" cy="500" rx="140" ry="100" />
        <ellipse cx="400" cy="500" rx="210" ry="150" />
      </g>
    </svg>
  );
}

/** Measurement marks — ruler tick marks along edges, like a construction plan */
export function MeasurementMarks() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="measure-marks"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          {/* Small tick marks */}
          <line x1="0" y1="0" x2="4" y2="0" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
          <line x1="15" y1="0" x2="17" y2="0" stroke="currentColor" strokeWidth="0.3" opacity="0.04" />
          <line x1="30" y1="0" x2="34" y2="0" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
          <line x1="45" y1="0" x2="47" y2="0" stroke="currentColor" strokeWidth="0.3" opacity="0.04" />
          {/* Vertical ticks */}
          <line x1="0" y1="0" x2="0" y2="4" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
          <line x1="0" y1="15" x2="0" y2="17" stroke="currentColor" strokeWidth="0.3" opacity="0.04" />
          <line x1="0" y1="30" x2="0" y2="34" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
          <line x1="0" y1="45" x2="0" y2="47" stroke="currentColor" strokeWidth="0.3" opacity="0.04" />
          {/* Cross at 0,0 */}
          <circle cx="0" cy="0" r="1" fill="currentColor" opacity="0.04" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#measure-marks)" />
    </svg>
  );
}
