// KASIAN BAGINDA Formula Applied - Progress Page Copy
// Kenapa (Why): Track progress to stay motivated and see growth
// Apa (What): Comprehensive progress tracking and achievements
// Siapa (Who): Indonesian learners on their skill development journey
// Kapan (When): Daily progress monitoring and continuous learning
// Bagaimana (How): Visual progress indicators and motivational messaging
// Di mana (Where): Centralized progress dashboard

export const PROGRESS_COPY = {
  // Meta Tags
  meta: {
    title: 'Genii | Progres Belajar - Yuk, Pantau Journey Skill Kamu!',
    description: 'Kenapa berhenti di tengah jalan? Track progres belajar kamu sekarang! Lihat pencapaian, raih streak, dan upgrade skill baru - karena kamu layak jadi yang terdepan di bidangmu. Mulai hari ini, rasakan bangga besok!',
  },

  // Error States
  errors: {
    networkError: {
      title: 'Aduh, Journey Kamu Tertunda Sebentar!',
      description: 'Kenapa harus stuck di sini? Data progres kamu lagi loading nih. Gak papa, semua pejuang sukses pasti pernah ngalamin kendala. Yuk, refresh halaman ini - progres keren kamu udah nungguin untuk dilihat!',
      retryButton: 'Muat Ulang',
    },
  },

  // Welcome Section
  welcome: {
    greeting: (name: string) => `Selamat Datang Kembali, ${name}!`,
    fallbackName: 'Pelajar',
    motivation: 'Kenapa keren banget sih konsisten balik ke sini? Kamu yang lagi upgrade skill deserves applause! Yuk, lanjutin journey belajar yang udah bikin kamu makin jago!',
  },

  // Stats Cards
  stats: {
    streak: {
      title: 'Streak Belajar Kamu',
      unit: 'hari',
      activeDescription: 'Keren! Konsistensi adalah kunci kesuksesan!',
      inactiveDescription: 'Mulai streak hari ini - one step closer to your dream!',
      startStreak: 'Mulai streak kamu',
    },
    courses: {
      title: 'Kelas yang Kamu Ambil',
      completedSuffix: (count: number) => `${count} udah selesai - keep going champion!`,
    },
    content: {
      title: 'Materi yang Udah Tamat',
      description: 'Setiap lesson yang selesai adalah investasi untuk masa depan kamu',
    },
    quiz: {
      title: 'Rata-rata Skor Quiz',
      attemptsSuffix: (count: number) => `${count} percobaan - practice makes perfect!`,
    },
  },

  // Main Sections
  sections: {
    enrolledCourses: {
      title: 'Kelas yang Lagi Kamu Tekuni 🚀',
      description: 'Apa yang bikin kamu istimewa? Konsistensi menyelesaikan yang udah dimulai! Yuk, lanjutin journey upgrade skill yang udah bikin kamu makin percaya diri!',
      viewAllButton: (count: number) => `Lihat Semua (${count})`,
    },
  },

  // Empty States
  emptyStates: {
    noCourses: {
      title: 'Kenapa Skill Baru = Peluang Emas? 💎',
      description: 'Siapa yang gak mau jadi yang paling dicari di industri? Ribuan kelas premium siap transformasi kamu jadi expert! Kapan lagi ada kesempatan upgrade skill dengan mentor terbaik? Mulai hari ini, rasakan confidence level yang berbeda besok!',
      ctaButton: 'Jelajahi Kelas',
    },
  },

  // Action Buttons
  actions: {
    continueLearning: 'Lanjut Belajar',
    reviewCourse: 'Review Kelas',
    exploreCourses: 'Jelajahi Kelas',
    refreshPage: 'Muat Ulang',
  },

  // Course Status Labels
  status: {
    notStarted: 'Belum Dimulai',
    inProgress: 'Sedang Berjalan',
    completed: 'Selesai',
  },

  // Progress Labels
  labels: {
    progress: 'Progres Kamu',
    level: 'Level',
    next: 'Next:',
  },

  // Activity Tabs
  tabs: {
    streak: 'Streak',
    activity: 'Aktivitas', 
    achievements: 'Pencapaian',
  },

  // Streak Status Messages (KASIAN BAGINDA enhanced)
  streakStatus: {
    none: {
      message: 'Start your learning journey!',
      emoji: '🚀',
      kasianBaginda: 'Kenapa masih menunggu? Mulai hari ini - setiap ahli pernah jadi pemula!',
    },
    building: {
      message: 'Building momentum!',
      emoji: '🌱',
      kasianBaginda: 'Keren, kamu udah mulai! Momentum ini yang bikin kamu beda dari yang lain.',
    },
    strong: {
      message: 'Strong streak!',
      emoji: '🔥',
      kasianBaginda: 'Wah, konsistensi level tinggi! Ini yang bikin skill upgrade secara exponential.',
    },
    champion: {
      message: 'Learning champion!',
      emoji: '👑',
      kasianBaginda: 'Champion! Kamu udah buktiin kalau commitment beats talent. Salut!',
    },
  },

  // Motivational Messages for different contexts
  motivational: {
    dailyStreak: (days: number) => 
      days > 0 
        ? `${days} hari streak!`
        : 'Mulai streak kamu',
    
    completionEncouragement: {
      high: 'Mantap! Tinggal sedikit lagi sampai finish line!',
      medium: 'Good progress! Konsistensi kamu keren banget!',
      low: 'Great start! Every expert was once a beginner.',
      zero: 'Ready to start this amazing journey?',
    },

    achievementContext: {
      unlocked: 'Achievement unlocked! Kamu memang luar biasa! 🏆',
      progress: 'Almost there! Sedikit lagi achievement baru menanti! 🎯',
      available: 'Ada achievement menanti untuk di-unlock! Siap tantangan? ⭐',
    },
  },

  // Call-to-Action Messages with KASIAN BAGINDA elements
  cta: {
    urgency: 'Mulai sekarang, jangan tunda lagi!',
    socialProof: 'Bergabung dengan ribuan pelajar yang udah berhasil upgrade skill',
    valueProposition: 'Belajar langsung dari praktisi dengan pengalaman real-world',
    fearOfMissingOut: 'Jangan sampai ketinggalan dari yang lain!',
  },

  // Time-related messages
  time: {
    justNow: 'Baru saja',
    daysAgo: (days: number) => `${days} hari yang lalu`,
    hoursAgo: (hours: number) => `${hours} jam yang lalu`, 
    minutesAgo: (minutes: number) => `${minutes} menit yang lalu`,
  },
} as const;

// Type for better TypeScript support
export type ProgressCopyType = typeof PROGRESS_COPY;

// Helper function to get copy with fallbacks
export const getProgressCopy = <T extends keyof ProgressCopyType>(
  section: T
): ProgressCopyType[T] => {
  return PROGRESS_COPY[section];
};

// Helper function for dynamic content with KASIAN BAGINDA context
export const getMotivationalMessage = (
  context: 'streak' | 'completion' | 'achievement',
  value?: number | string
) => {
  switch (context) {
    case 'streak':
      return typeof value === 'number' && value > 0
        ? PROGRESS_COPY.motivational.dailyStreak(value)
        : PROGRESS_COPY.streakStatus.none.kasianBaginda;
    case 'completion':
      if (typeof value === 'number') {
        if (value >= 80) return PROGRESS_COPY.motivational.completionEncouragement.high;
        if (value >= 50) return PROGRESS_COPY.motivational.completionEncouragement.medium;
        if (value > 0) return PROGRESS_COPY.motivational.completionEncouragement.low;
        return PROGRESS_COPY.motivational.completionEncouragement.zero;
      }
      return PROGRESS_COPY.motivational.completionEncouragement.zero;
    case 'achievement':
      return PROGRESS_COPY.motivational.achievementContext.available;
    default:
      return PROGRESS_COPY.cta.valueProposition;
  }
};