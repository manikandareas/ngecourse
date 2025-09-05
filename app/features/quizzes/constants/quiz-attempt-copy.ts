// KASIAN BAGINDA Formula Applied - Quiz Attempt Flow Copy
// Kenapa (Why): Active skill validation anxiety, career advancement pressure, imposter syndrome during testing
// Apa (What): Real-time skill assessment experience with supportive guidance and instant feedback
// Siapa (Who): Indonesian professionals actively proving their competency and expertise
// Kapan (When): Critical moment during active skill validation - reduce anxiety, boost confidence
// Bagaimana (How): Encouraging journey with milestone celebrations and anxiety-reducing support
// Di mana (Where): Clear progress tracking, achievement recognition, next steps for career advancement

export const QUIZ_ATTEMPT_COPY = {
  // Meta Tags for Active Quiz Taking
  meta: {
    title: (quizTitle: string) => `${quizTitle} - Sedang Membuktikan Expertise | Genii`,
    description: (quizTitle: string) => `Mengapa ragu dengan kemampuanmu? Sedang membuktikan expertise ${quizTitle} untuk validasi profesional. Showcase skill dan advance karir sekarang!`,
  },

  // Progress & Navigation
  progress: {
    title: 'Membuktikan Expertise-mu',
    completionText: (percentage: number) => `${Math.round(percentage)}% Skill Tervalidasi`,
    questionCounter: (current: number, total: number) => `Validasi ${current} dari ${total}`,
    
    // Milestone celebrations
    milestones: {
      start: 'Excellent start! Perjalanan validasi skill dimulai',
      quarter: '🎯 25% selesai! Momentum bagus, expertise mulai terlihat!',
      half: '🚀 50% selesai! Skill-mu terbukti solid, terus buktikan!',
      threeQuarter: '⭐ 75% selesai! Almost expert level, push harder!',
      almostDone: '🏆 Hampir selesai! Expertise-mu akan segera tervalidasi!'
    },

    encouragement: [
      'Great job! Skill-mu terus terbukti',
      'Excellent! Professional mindset detected',
      'Outstanding! Expertise level terlihat jelas',
      'Amazing! Kamu on track jadi expert',
      'Brilliant! Industry-ready skill confirmed'
    ]
  },

  // Active Quiz State
  activeQuiz: {
    questionLabel: (index: number) => `Skill Challenge ${index}`,
    nextButton: 'Validasi & Lanjut',
    submitButton: 'Prove My Expertise',
    backButton: 'Review Sebelumnya',
    
    // Loading states during quiz
    submitting: 'Menganalisis jawaban expert-mu...',
    processing: 'Menghitung tingkat expertise...',
    finalizing: 'Memproses validasi skill profesional...'
  },

  // Answer Feedback - Reduce anxiety, boost confidence
  feedback: {
    correct: {
      title: 'Benar! Skill Terbukti',
      messages: [
        'Expert level response! Skill-mu solid',
        'Professional answer! Industry-ready detected',
        'Brilliant! Expertise-mu terkonfirmasi',
        'Outstanding! Master level thinking',
        'Perfect! Skill validation berhasil'
      ]
    },
    
    incorrect: {
      title: 'Learning Opportunity',
      messages: [
        'Tidak apa-apa! Setiap expert pernah di sini',
        'Good attempt! Growth mindset terlihat',
        'Keep going! Professional journey continues',
        'Learning detected! Expertise sedang berkembang',
        'Progress made! Skill improvement in action'
      ]
    },

    transition: {
      nextQuestion: 'Skill challenge berikutnya loading...',
      finalSubmission: 'Preparing expertise validation results...',
      almostDone: 'Tinggal sedikit lagi prove total expertise-mu!'
    }
  },

  // Navigation & UI Elements
  navigation: {
    backToQuiz: 'Kembali ke Overview',
    breadcrumb: {
      courses: 'Semua Kursus',
      backToCourse: 'Kembali ke Course'
    },
    
    // Mobile responsive text
    mobile: {
      back: 'Kembali',
      progress: 'Progress',
      question: 'Q'
    }
  },

  // Error States - Reduce frustration, maintain motivation
  errors: {
    notFound: {
      title: 'Quiz Tidak Tersedia Saat Ini',
      description: 'Jangan worry! Quiz mungkin sedang maintenance. Skill validation journey-mu akan tetap berlanjut.',
      action: 'Coba Lagi'
    },
    
    unauthorized: {
      title: 'Akses Terbatas untuk Skill Validation',
      description: 'Untuk membuktikan expertise, pastikan kamu sudah enrolled di course ini. Don\'t miss the chance!',
      action: 'Enroll & Start Validation'
    },

    networkError: {
      title: 'Koneksi Terputus',
      description: 'Jawaban-mu aman tersimpan! Check koneksi dan lanjutkan prove expertise journey.',
      action: 'Reconnect & Continue'
    }
  },

  // Completion States
  completion: {
    finalSubmit: {
      title: 'Submit Final Answer',
      description: 'Prove total expertise-mu sekarang!',
      button: 'Validate My Professional Skills',
      icon: '🎯'
    },
    
    processing: {
      title: 'Menganalisis Level Expertise-mu',
      description: 'AI sedang menghitung tingkat professional skill-mu...',
      stages: [
        'Analyzing technical competency...',
        'Evaluating professional readiness...',
        'Calculating expertise percentage...',
        'Preparing skill validation report...'
      ]
    }
  },

  // Motivational Context Throughout Journey
  motivation: {
    contextual: {
      earlyStage: 'Setiap expert mulai dari sini - you\'re on the right path!',
      midStage: 'Skill-mu makin teruji - professional level detected!',
      lateStage: 'Almost validated! Expertise-mu hampir terkonfirmasi',
      finalStage: 'This is it! Moment validasi expertise terbesar!'
    },

    streaks: {
      correct: (count: number) => `🔥 ${count} jawaban expert berturut! Skill terbukti solid`,
      consistent: 'Professional consistency detected - industry-ready!',
      improvement: 'Skill growth terlihat - expertise sedang naik level!'
    }
  },

  // Social Proof & Career Context
  social: {
    validation: '15k+ professionals sudah membuktikan expertise mereka',
    career: 'Skill tervalidasi = career opportunities terbuka lebar',
    urgency: 'Prove expertise sekarang - competitors sudah start!',
    achievement: 'Join elite group of validated professionals'
  },

  // Accessibility & User Experience
  accessibility: {
    announcements: {
      questionChange: 'Pindah ke skill challenge berikutnya',
      correctAnswer: 'Jawaban benar - expertise terkonfirmasi',
      incorrectAnswer: 'Kesempatan belajar - growth mindset aktif',
      progressUpdate: 'Progress skill validation bertambah'
    }
  }
} as const;

// Type for better TypeScript support
export type QuizAttemptCopyType = typeof QUIZ_ATTEMPT_COPY;