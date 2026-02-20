import type { IconName } from "./types";

type IconProps = {
  name: IconName;
  className?: string;
};

export function SymbolIcon({ name, className }: IconProps) {
  switch (name) {
    case "chat":
      return <Icon className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" /></Icon>;
    case "forum":
      return <Icon className={className}><path d="M8 9h8" /><path d="M8 13h5" /><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" /></Icon>;
    case "call":
      return <Icon className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 5.15 12.8 19.8 19.8 0 0 1 2.08 4.09 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.79.63 2.64a2 2 0 0 1-.45 2.11L8 9.71a16 16 0 0 0 6.29 6.29l1.24-1.24a2 2 0 0 1 2.11-.45c.85.3 1.74.51 2.64.63A2 2 0 0 1 22 16.92Z" /></Icon>;
    case "person":
      return <Icon className={className}><path d="M20 21a8 8 0 1 0-16 0" /><circle cx="12" cy="7" r="4" /></Icon>;
    case "star":
      return <Icon className={className}><path d="m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></Icon>;
    case "archive":
      return <Icon className={className}><path d="M3 7h18" /><path d="M5 7v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7" /><path d="M10 12h4" /><path d="M4 3h16v4H4z" /></Icon>;
    case "settings":
      return <Icon className={className}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-.33-1A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1-.33H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1-.33A1.65 1.65 0 0 0 4.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6c.39 0 .76-.14 1-.4.26-.24.4-.61.33-1V3a2 2 0 1 1 4 0v.09c-.07.39.07.76.33 1 .24.26.61.4 1 .33a1.65 1.65 0 0 0 1-.6l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 8c0 .39.14.76.4 1 .24.26.61.4 1 .33H21a2 2 0 1 1 0 4h-.09c-.39-.07-.76.07-1 .33-.26.24-.4.61-.33 1z" /></Icon>;
    case "search":
      return <Icon className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icon>;
    case "videocam":
      return <Icon className={className}><path d="m22 8-6 4 6 4V8z" /><rect x="2" y="6" width="14" height="12" rx="2" /></Icon>;
    case "more":
      return <Icon className={className}><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></Icon>;
    case "doneAll":
      return <Icon className={className}><path d="m3 12 3 3 6-6" /><path d="m9 12 3 3 9-9" /></Icon>;
    case "addCircle":
      return <Icon className={className}><circle cx="12" cy="12" r="9" /><path d="M12 8v8" /><path d="M8 12h8" /></Icon>;
    case "image":
      return <Icon className={className}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="10" r="1.5" /><path d="m21 15-5-5L5 19" /></Icon>;
    case "mood":
      return <Icon className={className}><circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><path d="M9 10h.01" /><path d="M15 10h.01" /></Icon>;
    case "send":
      return <Icon className={className}><path d="m22 2-7 20-4-9-9-4 20-7z" /></Icon>;
    default:
      return null;
  }
}

function Icon({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {children}
    </svg>
  );
}
