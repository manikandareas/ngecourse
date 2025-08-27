import type React from 'react';

interface PageBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?:
    | 'default'
    | 'purple-cyan'
    | 'emerald-violet'
    | 'amber-indigo'
    | 'rose-teal'
    | 'sapphire-magenta';
}

export function PageBackground({
  children,
  className = '',
  variant = 'default',
}: PageBackgroundProps) {
  const gradientVariants = {
    // Original theme - biru dengan aksen subtle
    default: `
      radial-gradient(
        ellipse 1400px 1000px at 20% 80%,
        oklch(0.22 0.14 220 / 0.5) 0%,
        transparent 60%
      ),
      radial-gradient(
        ellipse 1200px 1400px at 80% 20%,
        oklch(0.20 0.12 180 / 0.45) 0%,
        transparent 55%
      ),
      radial-gradient(
        circle 1100px at 40% 40%,
        oklch(0.18 0.10 140 / 0.4) 0%,
        transparent 60%
      ),
      oklch(0.08 0.02 240)
    `,

    // Ungu ke Cyan
    'purple-cyan': `
      radial-gradient(
        ellipse 1600px 900px at 10% 70%,
        oklch(0.25 0.18 290 / 0.55) 0%,
        transparent 65%
      ),
      radial-gradient(
        ellipse 1300px 1500px at 85% 30%,
        oklch(0.23 0.16 190 / 0.5) 0%,
        transparent 60%
      ),
      radial-gradient(
        circle 1000px at 55% 90%,
        oklch(0.20 0.14 240 / 0.35) 0%,
        transparent 55%
      ),
      oklch(0.07 0.03 250)
    `,

    // Emerald ke Violet
    'emerald-violet': `
      radial-gradient(
        ellipse 1500px 1100px at 25% 15%,
        oklch(0.24 0.15 160 / 0.5) 0%,
        transparent 60%
      ),
      radial-gradient(
        ellipse 1400px 1200px at 75% 85%,
        oklch(0.22 0.17 280 / 0.55) 0%,
        transparent 65%
      ),
      radial-gradient(
        circle 1200px at 50% 50%,
        oklch(0.19 0.12 220 / 0.4) 0%,
        transparent 60%
      ),
      oklch(0.06 0.02 260)
    `,

    // Amber ke Indigo
    'amber-indigo': `
      radial-gradient(
        ellipse 1700px 800px at 90% 60%,
        oklch(0.26 0.14 85 / 0.45) 0%,
        transparent 55%
      ),
      radial-gradient(
        ellipse 1200px 1600px at 15% 25%,
        oklch(0.23 0.18 240 / 0.55) 0%,
        transparent 65%
      ),
      radial-gradient(
        circle 1300px at 45% 75%,
        oklch(0.20 0.10 200 / 0.35) 0%,
        transparent 60%
      ),
      oklch(0.08 0.03 230)
    `,

    // Rose ke Teal
    'rose-teal': `
      radial-gradient(
        ellipse 1400px 1300px at 35% 85%,
        oklch(0.24 0.16 350 / 0.5) 0%,
        transparent 60%
      ),
      radial-gradient(
        ellipse 1500px 1100px at 70% 20%,
        oklch(0.22 0.14 180 / 0.55) 0%,
        transparent 65%
      ),
      radial-gradient(
        circle 1100px at 20% 45%,
        oklch(0.19 0.11 200 / 0.4) 0%,
        transparent 55%
      ),
      oklch(0.07 0.02 210)
    `,

    // Sapphire ke Magenta
    'sapphire-magenta': `
      radial-gradient(
        ellipse 1600px 1000px at 60% 10%,
        oklch(0.25 0.17 220 / 0.55) 0%,
        transparent 65%
      ),
      radial-gradient(
        ellipse 1300px 1400px at 25% 80%,
        oklch(0.23 0.15 320 / 0.5) 0%,
        transparent 60%
      ),
      radial-gradient(
        circle 1250px at 80% 55%,
        oklch(0.20 0.12 270 / 0.4) 0%,
        transparent 60%
      ),
      oklch(0.06 0.03 250)
    `,
  };

  return (
    <div className={`relative min-h-screen text-gray-100 ${className}`}>
      {/* Fixed Cosmic Dark Abstract Background */}
      <div className="-z-10 fixed inset-0">
        <div
          className="h-full w-full"
          style={{
            background: gradientVariants[variant],
          }}
        />
      </div>

      {children}
    </div>
  );
}
