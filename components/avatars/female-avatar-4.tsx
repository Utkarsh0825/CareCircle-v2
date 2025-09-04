export function FemaleAvatar4({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="50" cy="35" r="18" fill="#FFEFD5" stroke="#F5DEB3" strokeWidth="1"/>
      
      {/* Hair */}
      <path d="M32 25 Q50 8 68 25 Q68 18 50 5 Q32 18 32 25" fill="#8B008B"/>
      <path d="M32 25 Q25 30 25 40 Q25 50 35 50 Q45 50 50 45 Q55 50 65 50 Q75 50 75 40 Q75 30 68 25" fill="#8B008B"/>
      
      {/* Eyes */}
      <circle cx="44" cy="32" r="2.5" fill="#1A1A1A"/>
      <circle cx="56" cy="32" r="2.5" fill="#1A1A1A"/>
      
      {/* Eyebrows */}
      <path d="M40 28 Q44 26 48 28" stroke="#8B008B" strokeWidth="2" fill="none"/>
      <path d="M52 28 Q56 26 60 28" stroke="#8B008B" strokeWidth="2" fill="none"/>
      
      {/* Nose */}
      <path d="M50 35 Q48 38 50 40" stroke="#F5DEB3" strokeWidth="1" fill="none"/>
      
      {/* Mouth */}
      <path d="M45 45 Q50 48 55 45" stroke="#CD5C5C" strokeWidth="1.5" fill="none"/>
      
      {/* Body */}
      <rect x="40" y="53" width="20" height="30" rx="10" fill="#FF6347"/>
      
      {/* Arms */}
      <rect x="30" y="58" width="8" height="20" rx="4" fill="#FFEFD5"/>
      <rect x="62" y="58" width="8" height="20" rx="4" fill="#FFEFD5"/>
      
      {/* Legs */}
      <rect x="42" y="83" width="8" height="15" rx="4" fill="#2C3E50"/>
      <rect x="50" y="83" width="8" height="15" rx="4" fill="#2C3E50"/>
    </svg>
  )
}
