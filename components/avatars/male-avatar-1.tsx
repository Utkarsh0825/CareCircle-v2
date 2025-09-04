export function MaleAvatar1({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="50" cy="35" r="18" fill="#D4A574" stroke="#B8956A" strokeWidth="1"/>
      
      {/* Hair */}
      <path d="M32 25 Q50 15 68 25 Q68 20 50 12 Q32 20 32 25" fill="#2C1810"/>
      
      {/* Eyes */}
      <circle cx="44" cy="32" r="2" fill="#1A1A1A"/>
      <circle cx="56" cy="32" r="2" fill="#1A1A1A"/>
      
      {/* Nose */}
      <path d="M50 35 Q48 38 50 40" stroke="#B8956A" strokeWidth="1" fill="none"/>
      
      {/* Mouth */}
      <path d="M45 45 Q50 48 55 45" stroke="#8B4513" strokeWidth="1.5" fill="none"/>
      
      {/* Body */}
      <rect x="40" y="53" width="20" height="30" rx="10" fill="#4A90E2"/>
      
      {/* Arms */}
      <rect x="30" y="58" width="8" height="20" rx="4" fill="#D4A574"/>
      <rect x="62" y="58" width="8" height="20" rx="4" fill="#D4A574"/>
      
      {/* Legs */}
      <rect x="42" y="83" width="8" height="15" rx="4" fill="#2C3E50"/>
      <rect x="50" y="83" width="8" height="15" rx="4" fill="#2C3E50"/>
    </svg>
  )
}
