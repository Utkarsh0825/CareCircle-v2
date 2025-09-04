export function MaleAvatar4({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="50" cy="35" r="18" fill="#D2B48C" stroke="#BC9A6A" strokeWidth="1"/>
      
      {/* Hair */}
      <path d="M32 25 Q50 8 68 25 Q68 20 50 5 Q32 20 32 25" fill="#654321"/>
      
      {/* Eyes */}
      <circle cx="44" cy="32" r="2.5" fill="#1A1A1A"/>
      <circle cx="56" cy="32" r="2.5" fill="#1A1A1A"/>
      
      {/* Eyebrows */}
      <path d="M40 28 Q44 26 48 28" stroke="#654321" strokeWidth="2" fill="none"/>
      <path d="M52 28 Q56 26 60 28" stroke="#654321" strokeWidth="2" fill="none"/>
      
      {/* Nose */}
      <path d="M50 35 Q48 38 50 40" stroke="#BC9A6A" strokeWidth="1" fill="none"/>
      
      {/* Mouth */}
      <path d="M45 45 Q50 48 55 45" stroke="#8B4513" strokeWidth="1.5" fill="none"/>
      
      {/* Body */}
      <rect x="40" y="53" width="20" height="30" rx="10" fill="#8E44AD"/>
      
      {/* Arms */}
      <rect x="30" y="58" width="8" height="20" rx="4" fill="#D2B48C"/>
      <rect x="62" y="58" width="8" height="20" rx="4" fill="#D2B48C"/>
      
      {/* Legs */}
      <rect x="42" y="83" width="8" height="15" rx="4" fill="#2C3E50"/>
      <rect x="50" y="83" width="8" height="15" rx="4" fill="#2C3E50"/>
    </svg>
  )
}
