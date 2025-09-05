// KASIAN BAGINDA Formula Applied - Quiz Assessment Copy
// Kenapa (Why): Skill validation gaps, career stagnation, imposter syndrome
// Apa (What): Interactive assessments, instant feedback, skill certificates
// Siapa (Who): Indonesian professionals wanting career advancement
// Kapan (When): Test knowledge immediately after learning
// Bagaimana (How): Progressive questions with detailed explanations
// Di mana (Where): Clear next steps, certificate sharing, career connections

export const QUIZ_COPY = {
  // Meta Tags
  meta: {
    title: (quizTitle: string) => `${quizTitle} | Uji Kemampuanmu - Genii`,
    description: (quizTitle: string) => `Mengapa ragu dengan skillmu? Buktikan kemampuan ${quizTitle} dan dapatkan validasi profesional. 15k+ professionals sudah membuktikan expertise mereka!`,
  },

  // Quiz States
  states: {
    loading: {
      title: 'Menyiapkan ujian terbaikmu...',
      description: 'Sebentar lagi kamu bisa membuktikan kemampuanmu!',
    },
    notStarted: {
      badge: '🎯 Saatnya Buktikan Kemampuan',
      title: 'Siap Memvalidasi Skillmu?',
      subtitle: 'Mengapa menunda validasi kemampuan? Jutaan peluang karir menunggu professionals dengan skill terverifikasi sepertimu.',
      startButton: 'Mulai Quiz Sekarang',
      instructions: {
        title: 'Yang Perlu Kamu Ketahui:',
        items: [
          '📝 Jawab semua pertanyaan dengan jujur - ini untuk kemajuan karirmu',
          '⏰ Tidak ada batasan waktu - fokus pada kualitas jawaban',
          '🔄 Bisa diulang jika belum puas dengan hasil',
          '🏆 Dapatkan sertifikat digital untuk portfolio profesionalmu',
        ],
      },
    },
    inProgress: {
      progressText: (current: number, total: number) => `Pertanyaan ${current} dari ${total}`,
      progressEncouragement: (percentage: number) => {
        if (percentage < 25) return 'Bagus! Kamu sudah memulai perjalanan validasi skill';
        if (percentage < 50) return 'Hebat! Kamu sedang menunjukkan kemampuanmu';
        if (percentage < 75) return 'Luar biasa! Hampir selesai membuktikan expertise';
        return 'Excellent! Tinggal sedikit lagi untuk mendapatkan validasi';
      },
      submitButton: 'Submit Jawaban',
      nextButton: 'Pertanyaan Selanjutnya',
      backButton: 'Kembali',
      skipButton: 'Lewati Dulu',
    },
    completed: {
      submittingTitle: 'Menghitung skor expertise-mu...',
      submittingDescription: 'Sebentar lagi kamu tahu seberapa ahli skillmu!',
    },
  },

  // Results & Scoring
  results: {
    badge: '🎉 Hasil Assessment',
    scoreDisplay: (score: number, total: number, percentage: number) => ({
      primary: `${score}/${total}`,
      secondary: `${percentage}% Correct`,
    }),
    
    // Performance-based messaging
    performance: {
      excellent: {
        title: 'Outstanding! Kamu Expert di Bidang Ini',
        message: 'Mengapa menyembunyikan talent seperti ini? Expertise-mu sudah level profesional. Saatnya showcase skill ini di LinkedIn dan raih peluang karir yang lebih besar!',
        cta: 'Share Pencapaian ke LinkedIn',
        badge: '🏆 Expert Level',
        color: 'success' as const,
      },
      good: {
        title: 'Great Job! Skill-mu Sudah Solid',
        message: 'Kemampuanmu sudah di atas rata-rata! Dengan sedikit polish lagi, kamu bisa jadi expert. Jangan berhenti di sini - lanjutkan belajar dan raih level tertinggi.',
        cta: 'Tingkatkan ke Expert Level',
        badge: '⭐ Advanced Level',
        color: 'primary' as const,
      },
      average: {
        title: 'Good Start! Ada Potensi Besar',
        message: 'Kamu sudah di jalur yang benar! Skill ini butuh sedikit penguatan lagi. Ingat, setiap expert pernah berada di posisimu sekarang. Keep going!',
        cta: 'Perkuat Skill Fundamental',
        badge: '💪 Intermediate Level',
        color: 'warning' as const,
      },
      needsImprovement: {
        title: 'Jangan Menyerah! Ini Baru Permulaan',
        message: 'Setiap master pernah jadi beginner. Hasil ini menunjukkan area yang perlu fokus. Dengan dedikasi, kamu pasti bisa menguasai skill ini dan boost karir!',
        cta: 'Mulai Learning Path',
        badge: '🌱 Beginner Level',
        color: 'secondary' as const,
      },
    },

    // Detailed feedback
    feedback: {
      title: 'Breakdown Kemampuanmu',
      correctAnswers: (count: number) => `✅ ${count} Jawaban Benar`,
      incorrectAnswers: (count: number) => `❌ ${count} Perlu Review`,
      improvements: {
        title: 'Rekomendasi Pengembangan:',
        subtitle: 'Fokus di area ini untuk maximalize career growth',
      },
    },

    // Action buttons
    actions: {
      retake: 'Ulangi Quiz',
      reviewAnswers: 'Review Jawaban',
      shareCertificate: 'Share Certificate',
      continuelearning: 'Lanjut Belajar',
      viewAllQuizzes: 'Quiz Lainnya',
    },

    // Social proof
    socialProof: {
      statsTitle: 'Kamu Bagian dari Komunitas Pembelajar',
      totalAttempts: (count: number) => `${count.toLocaleString()}+ attempts`,
      averageScore: (score: number) => `Rata-rata: ${score}%`,
      yourRanking: (percentile: number) => `Top ${100 - percentile}% performers`,
      communityMessage: 'Bergabung dengan 15k+ professionals yang sudah memvalidasi skill mereka',
    },

    // Certificate info
    certificate: {
      title: 'Dapatkan Certificate Digital',
      description: 'Showcase achievement ini di profile profesionalmu',
      benefits: [
        '📋 Sertifikat digital untuk LinkedIn',
        '🎯 Bukti skill tervalidasi',
        '📈 Boost credibility di industri',
        '🚀 Buka peluang karir baru',
      ],
      downloadButton: 'Download Certificate',
      shareButton: 'Share ke LinkedIn',
    },
  },

  // Error States
  errors: {
    loadFailed: {
      title: 'Aduh! Quiz Tidak Bisa Dimuat',
      description: 'Jangan khawatir, ini bukan salahmu. Server mungkin sedang sibuk. Mari coba lagi dan lanjutkan journey validasi skillmu.',
      retryButton: 'Coba Lagi',
    },
    submitFailed: {
      title: 'Jawaban Belum Terkirim',
      description: 'Sayang banget jawabanmu belum tersimpan. Coba submit lagi - jangan sampai usahamu sia-sia!',
      retryButton: 'Submit Ulang',
    },
    networkError: {
      title: 'Koneksi Terputus',
      description: 'Sepertinya ada masalah koneksi. Cek internet kamu dan coba lagi. Quiz-mu akan tetap tersimpan!',
      retryButton: 'Reconnect',
    },
    timeOut: {
      title: 'Session Expired',
      description: 'Session-mu sudah habis, tapi jangan worry! Login ulang dan lanjutkan dari mana kamu tadi berhenti.',
      loginButton: 'Login Ulang',
    },
    unauthorized: {
      title: 'Akses Terbatas',
      description: 'Sepertinya kamu belum enrolled ke course ini. Enroll dulu yuk biar bisa akses semua quiz dan materials!',
      enrollButton: 'Enroll Sekarang',
    },
    quizNotFound: {
      title: 'Quiz Tidak Ditemukan',
      description: 'Quiz yang kamu cari mungkin sudah dipindah atau dihapus. Cek course content atau hubungi support.',
      backButton: 'Kembali ke Course',
    },
  },

  // Navigation & UI
  navigation: {
    breadcrumb: {
      courses: 'Courses',
      backToCourse: 'Kembali ke Course',
      quizList: 'Quiz List',
    },
    pagination: {
      previous: 'Sebelumnya', 
      next: 'Selanjutnya',
      finish: 'Selesai',
    },
    quiz: {
      questionCounter: (current: number, total: number) => `${current}/${total}`,
      timeRemaining: (time: string) => `⏰ ${time}`,
      answered: 'Terjawab',
      unanswered: 'Belum dijawab',
    },
  },

  // Motivational Messages
  motivation: {
    encouragement: [
      'Kamu bisa! Setiap expert pernah di posisimu',
      'Great job! Skill-mu terus berkembang',
      'Keep going! Success is just around the corner',
      'Excellent progress! Kamu on the right track',
      'Amazing! Professional mindset detected',
    ],
    milestones: {
      quarter: '🎯 25% selesai! Momentum bagus, terus lanjut!',
      half: '🚀 50% selesai! Kamu sudah prove commitment-mu!',
      threeQuarter: '⭐ 75% selesai! Almost there, champion!',
      almostDone: '🏆 Hampir selesai! Victory is within reach!',
    },
    streaks: {
      correct: (count: number) => `🔥 ${count} jawaban benar berturut! On fire!`,
      improvement: '📈 Progress detected! Skill-mu makin terasah',
      consistency: '💪 Consistent effort = guaranteed results!',
    },
  },

  // Call-to-Action Messages  
  cta: {
    urgency: 'Validasi skill-mu sekarang, jangan tunda karir impian!',
    socialProof: '15k+ professionals sudah membuktikan expertise mereka',
    valueProposition: 'Dapatkan skill validation yang diakui industri',
    fomo: 'Jangan tertinggal - competitors kamu sudah start!',
    career: 'Skill tervalidasi = peluang karir terbuka lebar',
  },

  // Help & Support
  help: {
    faqButton: 'Butuh Bantuan?',
    supportMessage: 'Tim support siap membantu journey belajar kamu!',
    commonQuestions: {
      retake: {
        question: 'Bisa mengulang quiz?',
        answer: 'Tentu! Kamu bisa mengulang quiz untuk improve score.',
      },
      certificate: {
        question: 'Certificate berlaku berapa lama?',
        answer: 'Certificate digital permanent dan bisa di-share kapan saja.',
      },
      score: {
        question: 'Minimum score untuk pass?',
        answer: 'Tidak ada minimum - focus pada learning dan improvement.',
      },
    },
  },
} as const;

// Type for better TypeScript support
export type QuizCopyType = typeof QUIZ_COPY;