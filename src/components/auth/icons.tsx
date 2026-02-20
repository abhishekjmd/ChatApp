type IconProps = {
  className?: string;
};

export function MessageSquare({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
    </svg>
  );
}

export function Mail({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M4 4h16v16H4z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

export function Lock({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function Eye({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M2.06 12.35a1 1 0 0 1 0-.7C3.77 7.6 7.52 5 12 5s8.23 2.6 9.94 6.65a1 1 0 0 1 0 .7C20.23 16.4 16.48 19 12 19s-8.23-2.6-9.94-6.65Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeOff({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M10.58 10.58A3 3 0 0 0 12 15a3 3 0 0 0 2.42-4.42" />
      <path d="M9.88 4.24A10.94 10.94 0 0 1 12 4c4.48 0 8.23 2.6 9.94 6.65a1 1 0 0 1 0 .7 11 11 0 0 1-4.18 5.08" />
      <path d="M6.61 6.61A11 11 0 0 0 2.06 11.65a1 1 0 0 0 0 .7C3.77 16.4 7.52 19 12 19a10.94 10.94 0 0 0 5.24-1.32" />
      <path d="M2 2l20 20" />
    </svg>
  );
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function GoogleLogo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a6 6 0 0 1-2.21 3.31v2.77h3.57a11 11 0 0 0 3.28-8.09Z" fill="#4285F4" />
      <path d="M12 23a10.9 10.9 0 0 0 7.28-2.66l-3.57-2.77a6.5 6.5 0 0 1-3.71 1.06A6.93 6.93 0 0 1 5.84 14.1H2.18v2.84A11 11 0 0 0 12 23Z" fill="#34A853" />
      <path d="M5.84 14.1A7 7 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84Z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.93 10.93 0 0 0 12 1 11 11 0 0 0 2.18 7.07l3.66 2.84A6.93 6.93 0 0 1 12 5.38Z" fill="#EA4335" />
    </svg>
  );
}
