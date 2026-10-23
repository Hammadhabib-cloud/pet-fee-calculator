// Small stroke icons (24×24 grid). Decorative unless a title is given.
type P = { className?: string };
const base = (className = "h-5 w-5") => ({
  className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const CheckIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M20 6 9 17l-5-5" /></svg>
);
export const XIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M18 6 6 18M6 6l12 12" /></svg>
);
export const InfoIcon = ({ className }: P) => (
  <svg {...base(className)}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
);
export const AlertIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4M12 17h.01" /></svg>
);
export const CalendarIcon = ({ className }: P) => (
  <svg {...base(className)}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
);
export const PlaneIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" /></svg>
);
export const RulerIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" /><path d="m14.5 12.5 2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2" /></svg>
);
export const WeightIcon = ({ className }: P) => (
  <svg {...base(className)}><circle cx="12" cy="5" r="3" /><path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z" /></svg>
);
export const BoxIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5M12 22V12" /></svg>
);
export const ShieldIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>
);
export const ExternalIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
);
export const ArrowRightIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
);
export const ChevronIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="m6 9 6 6 6-6" /></svg>
);
export const PawIcon = ({ className = "h-5 w-5" }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <ellipse cx="6" cy="9.5" rx="2" ry="2.6" />
    <ellipse cx="10" cy="5.5" rx="2" ry="2.6" />
    <ellipse cx="14" cy="5.5" rx="2" ry="2.6" />
    <ellipse cx="18" cy="9.5" rx="2" ry="2.6" />
    <path d="M12 11c-2.6 0-5.5 3.6-5.5 6.2 0 1.8 1.4 2.8 3 2.8 1 0 1.7-.5 2.5-.5s1.5.5 2.5.5c1.6 0 3-1 3-2.8 0-2.6-2.9-6.2-5.5-6.2Z" />
  </svg>
);
