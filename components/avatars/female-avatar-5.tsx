export function FemaleAvatar5({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="50" cy="35" r="18" fill="#FFF8DC" stroke="#F5DEB3" strokeWidth="1"/>
      
      {/* Hair */}
      <path d="M32 25 Q50 10 68 25 Q68 18 50 8 Q32 18 32 25" fill="#2C1810"/>
      <path d="M32 25 Q25 30 25 40 Q25 50 35 50 Q45 50 50 45 Q55 50 65 50 Q75 50 75 40 Q75 30 68 25" fill="#2C1810"/>
      
      {/* Eyes */}
      <circle cx="44" cy="32" r="2" fill="#1A1A1A"/>
      <circle cx="56" cy="32" r="2" fill="#1A1A1A"/>
      
      {/* Nose */}
      <path d="M50 35 Q48 38 50 40" stroke="#F5DEB3" strokeWidth="1" fill="none"/>
      
      {/* Mouth */}
      <path d="M45 45 Q50 48 55 45" stroke="#CD5C5C" strokeWidth="1.5" fill="none"/>
      
      {/* Body */}
      <rect x="40" y="53" width="20" height="30" rx="10" fill="#20B2AA"/>
      
      {/* Arms */}
      <rect x="30" y="58" width="8" height="20" rx="4" fill="#FFF8DC"/>
      <rect x="62" y="58" width="8" height="20" rx="4" fill="#FFF8DC"/>
      
      {/* Legs */}
      <rect x="42" y="83" width="8" height="15" rx="4" fill="#2C3E50"/>
      <rect x="50" y="83" width="8" height="15" rx="4" fill="#2C3E50"/>
    </svg>
  )
}
