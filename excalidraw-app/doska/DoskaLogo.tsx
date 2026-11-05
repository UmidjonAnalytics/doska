import React from "react";

/** Doska mark: a hand-drawn board with a pen stroke. Uses currentColor. */
export const DoskaMark = ({ size = 40 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    aria-hidden="true"
    className="doska-mark"
  >
    <rect
      x="7"
      y="9"
      width="50"
      height="38"
      rx="6"
      stroke="currentColor"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
    <path
      d="M16 35c5-9 9-11 12-6s6 5 10-3 7-6 10-4"
      stroke="#E8833A"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24 47l-6 10M40 47l6 10"
      stroke="currentColor"
      strokeWidth="4.5"
      strokeLinecap="round"
    />
  </svg>
);

export const DoskaLogo = () => (
  <span
    className="doska-logo"
    style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}
  >
    <DoskaMark size={44} />
    <span style={{ fontSize: "2.25rem", lineHeight: 1 }}>Doska</span>
  </span>
);
