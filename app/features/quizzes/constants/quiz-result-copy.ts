// KASIAN BAGINDA Formula Applied - Quiz Result Page Copy
// Kenapa (Why): Combat imposter syndrome, prove professional competence in career
// Apa (What): Expert-validated skill assessment with personalized competency insights
// Siapa (Who): Indonesian professionals wanting career advancement and skill credibility  
// Kapan (When): Immediate skill validation results with actionable next steps
// Bagaimana (How): Industry-standard assessment designed by practitioners
// Di mana (Where): Clear CTAs for continued learning and career development

export const QUIZ_RESULT_COPY = {
  // Meta Tags
  meta: {
    title: (quizTitle: string) => `Hasil ${quizTitle} | Validasi Skill Profesional - Genii`,
    description: (quizTitle: string) => `Lihat hasil validasi skill profesional untuk ${quizTitle}. Dapatkan insight kemampuan dari expert dan langkah selanjutnya untuk karir yang lebih maju.`,
  },

  // Performance Messages (4 tiers based on percentage)
  performance: {
    outstanding: {
      message: 'Luar biasa! Skill Expert-mu sudah diakui industri!',
      description: 'Kemampuanmu sudah setara dengan praktisi senior. Saatnya mentoring junior atau explore challenge yang lebih advance!',
      color: 'text-green-400',
      badge: '🏆 Expert Level',
    },
    excellent: {
      message: 'Hebat! Kemampuan Profesional Terkonfirmasi!', 
      description: 'Skillmu sudah ready untuk project-project besar. Tingkatkan lagi untuk jadi expert di bidang ini!',
      color: 'text-blue-400',
      badge: '💎 Professional Level',
    },
    good: {
      message: 'Bagus! Kemampuan Dasar Sudah Kuat!',
      description: 'Foundation-mu solid, tinggal poles skill advance. Lanjut belajar untuk naik ke level professional!',
      color: 'text-yellow-400', 
      badge: '⭐ Intermediate Level',
    },
    needsWork: {
      message: 'Keep Going! Fundamental Perlu Diperkuat!',
      description: 'Jangan menyerah! Setiap expert pernah di posisi ini. Fokus kuasai fundamental dulu, sisanya akan mengikuti.',
      color: 'text-red-400',
      badge: '💪 Beginner Level',
    },
  },

  // Section Headers and Labels
  sections: {
    header: {
      backButton: 'Kembali ke Dashboard',
      badge: '🏆 Hasil Validasi Skill',
    },
    scoreDisplay: {
      title: (quizTitle: string) => quizTitle,
      scoreSuffix: '%',
    },
    stats: {
      expertise: {
        label: 'Kemampuan',
        format: (correct: number, total: number) => `${correct}/${total} benar`,
      },
      duration: {
        label: 'Waktu',
        format: (minutes: number) => `${minutes} menit`,
      },
      attempt: {
        label: 'Percobaan',
        format: (attemptNumber: number) => `ke-${attemptNumber}`,
      },
    },
    breakdown: {
      title: '📊 Analisis Kemampuan Detail',
      subtitle: 'Lihat di mana kamu sudah expert dan area mana yang perlu diperkuat lagi',
    },
  },

  // Question Review
  questionReview: {
    badges: {
      userChoice: 'Jawaban Kamu',
      expertAnswer: '✅ Expert Answer',
    },
    insight: {
      title: '💡 Insight Expert',
    },
  },

  // Action Buttons and CTAs
  actions: {
    primary: {
      retake: 'Tingkatkan Score Lagi',
      retakeIcon: '🚀',
      description: 'Challenge yourself untuk dapat score yang lebih tinggi!',
    },
    secondary: {
      backToOverview: 'Kembali ke Overview',
      icon: 'ArrowLeft',
    },
    motivational: {
      socialProof: 'Bergabung dengan 12k+ profesional yang sudah membuktikan kemampuan mereka',
      nextStep: 'Lanjut ke materi berikutnya untuk upgrade skill lebih jauh',
      urgency: 'Jangan berhenti di sini - momentum belajar sedang bagus!',
    },
  },

  // Loading and Error States
  states: {
    inProgress: {
      title: 'Validasi Skill Belum Selesai',
      description: 'Quiz expertise-mu masih dalam proses. Lanjutkan untuk mendapatkan hasil validasi profesional!',
      cta: 'Lanjut Mengerjakan',
    },
    error: {
      title: 'Oops! Ada kendala teknis',
      description: 'Tenang, ini bukan salahmu. Hasil quiz-mu aman tersimpan. Coba refresh halaman atau hubungi support.',
      retryButton: 'Coba Lagi',
    },
  },

  // Course Completion Modal Enhancement
  completion: {
    celebration: {
      title: 'Keren! Kursus Selesai! 🎉',
      subtitle: (courseTitle: string) => `Selamat menyelesaikan ${courseTitle}! Skill baru sudah di kantong, saatnya praktik di dunia kerja.`,
      emoji: '🎉',
    },
    stats: {
      timeSpent: 'Total Waktu',
      lessonsCompleted: 'Materi',
      averageScore: 'Rata-rata Score',
    },
    achievements: {
      title: 'Achievement Baru Terbuka!',
      newBadge: 'Badge Baru',
      pointsEarned: 'XP didapat',
    },
    actions: {
      continueLearning: 'Lanjut Belajar Skill Lain',
      viewProgress: 'Lihat Progress Belajar',
      shareAchievement: 'Share Achievement',
    },
  },

  // Social Proof and Motivation
  socialProof: {
    community: '12k+ profesional Indonesia',
    validation: 'sudah membuktikan kemampuan mereka',
    trustSignal: 'Dipercaya oleh praktisi dari perusahaan unicorn',
  },

  // Career-focused messaging
  career: {
    nextSteps: {
      expert: 'Siap jadi mentor atau tech lead di bidang ini',
      professional: 'Ready untuk project-project challenging',
      intermediate: 'Lanjut ke materi advanced untuk naik level',
      beginner: 'Focus strengthen fundamental dulu',
    },
    value: {
      industryStandard: 'Standar industri untuk posisi',
      careerBoost: 'Skill yang dicari employer',
      portfolioWorthy: 'Layak masuk ke portfolio profesional',
    },
  },
} as const;

// Type for better TypeScript support
export type QuizResultCopyType = typeof QUIZ_RESULT_COPY;