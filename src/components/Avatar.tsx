interface AvatarProps {
  skin: string;
  shirt: string;
  age: number;
  size?: number;
}

/** Le personnage dessiné. Cheveux gris et lunettes à partir de 60 ans. */
export function Avatar({ skin, shirt, age, size = 120 }: AvatarProps) {
  const old = age >= 60;
  return (
    <svg viewBox="0 0 120 160" width={size * 0.75} height={size} aria-hidden="true" style={{ display: "block" }}>
      <path d="M20 160 C20 118 38 104 60 104 C82 104 100 118 100 160 Z" fill={shirt} />
      <rect x="52" y="84" width="16" height="24" rx="6" fill={skin} />
      <circle cx="60" cy="60" r="30" fill={skin} />
      <path
        d="M30 60 C28 32 46 22 62 22 C80 22 93 34 90 58 C84 45 74 40 60 42 C46 42 36 48 30 60 Z"
        fill={old ? "#D9D6E4" : "#1F1A17"}
      />
      {old ? (
        <>
          <circle cx="49" cy="63" r="7" fill="none" stroke="#141A38" strokeWidth="2.5" />
          <circle cx="71" cy="63" r="7" fill="none" stroke="#141A38" strokeWidth="2.5" />
          <path d="M56 63 h8" stroke="#141A38" strokeWidth="2.5" />
        </>
      ) : null}
      <circle cx="50" cy="63" r="3.2" fill="#1F1A17" />
      <circle cx="70" cy="63" r="3.2" fill="#1F1A17" />
      <path d="M51 74 Q60 81 69 74" stroke="#1F1A17" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
