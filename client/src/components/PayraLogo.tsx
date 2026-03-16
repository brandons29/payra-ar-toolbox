import payraLogoSvg from "@/assets/payra-logo.svg";

/** Payra icon mark only — the green/blue chevron */
function PayraIconMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1200 1700"
      fill="none"
      aria-label="Payra Logo"
    >
      {/* Green upper chevron */}
      <path
        d="M1111.4,597.2L332.7,188.2c-20.6-10.8-44.8-10.1-64.7,1.9-19.9,12-31.8,33.1-31.8,56.4v266.9c0,24.7,13.5,47.4,35.3,59.1l878.3,473.1.9.5v-384c0-27.4-15.1-52.3-39.3-65.1Z"
        fill="#1BD489"
      />
      {/* Blue lower chevron */}
      <path
        d="M1150.1,653.4v-1s-883.7,459.1-883.7,459.1c-18.7,9.7-30.3,28.8-30.3,49.9v267.5c0,25.6,13.1,48.8,35.1,62,11.5,6.9,24.3,10.4,37.1,10.4s23.3-2.9,34.1-8.6l794.1-424.7c8.7-4.6,14.1-13.6,14.1-23.5l-.5-391Z"
        fill="#2CC5E7"
      />
      {/* Teal overlap */}
      <path
        d="M1150.1,653.4v-1s-370.9,192.7-370.9,192.7l-1,.5,371.5,200.1.9.5v-1c0-.1,0-.2,0-.3,0-.2,0-.3,0-.5l-.5-391Z"
        fill="#0FB9B0"
      />
    </svg>
  );
}

/**
 * Full Payra logo — chevron mark + wordmark as an <img> tag.
 * Used on the landing page header where the full horizontal lockup is needed.
 */
export function PayraLogoFull({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`} data-testid="logo-payra">
      <img
        src={payraLogoSvg}
        alt="Payra"
        className="h-7"
        draggable={false}
      />
    </div>
  );
}

/**
 * Compact Payra logo — chevron icon + "PAYRA" text + "AR Toolbox" label.
 * Used in the sidebar and wherever space is limited.
 */
export function PayraLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} data-testid="logo-payra">
      <PayraIconMark size={26} />
      <span className="font-semibold text-base tracking-tight">
        <span style={{ color: "#022947" }} className="dark:text-white">PAYRA</span>
        <span className="text-muted-foreground font-normal ml-1.5">AR Toolbox</span>
      </span>
    </div>
  );
}
