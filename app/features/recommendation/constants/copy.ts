// KASIAN BAGINDA Formula Applied - Recommendation Page Copy
// Kenapa (Why): Generic learning paths waste time, professionals need targeted skill development for career growth
// Apa (What): AI-powered personalized course recommendations based on specific career goals and experience
// Siapa (Who): Indonesian professionals seeking strategic, relevant skill upgrading to advance their careers
// Kapan (When): Act now on personalized suggestions - timing is critical for career momentum
// Bagaimana (How): AI analyzes your profile → curates perfect courses → provides direct enrollment path
// Di mana (Where): Start recommended courses immediately through the platform, don't miss this personalized opportunity

export const RECOMMENDATION_COPY = {
  // Meta Tags
  meta: {
    title: 'Rekomendasi Personal | Genii - Kursus yang Tepat untuk Karirmu',
    description: 'Mengapa belajar sembarangan? AI kami sudah menyiapkan kursus terbaik sesuai tujuan karirmu. 12k+ profesional sudah berhasil upgrade skill!',
  },

  // Loading States
  loading: {
    pending: {
      title: 'Sedang Mempersiapkan',
      subtitle: 'AI kami sedang menganalisis profil dan tujuan karirmu',
      message: 'Menganalisis kebutuhan karirmu...',
      liveIndicator: 'Pembaruan real-time aktif',
    },
    processing: {
      title: 'AI Sedang Bekerja Untukmu',
      subtitle: 'Mencari kursus terbaik yang sesuai dengan jalur karirmu',
      message: 'Memproses ribuan kursus untuk menemukan yang paling cocok...',
    },
  },

  // Success State
  success: {
    title: 'Jalur Karir Personalmu Sudah Siap!',
    description: 'Mengapa buang waktu belajar yang tidak relevan? AI kami telah menyiapkan kursus terbaik berdasarkan tujuan karirmu. Mulai sekarang dan jangan tertinggal dari yang lain!',
    fallbackDescription: 'AI kami telah menganalisis profil dan tujuan karirmu untuk menyiapkan kursus-kursus terbaik yang akan membawa karirmu ke level selanjutnya.',
  },

  // Error States
  error: {
    failed: {
      title: 'Ups! AI Kami Sedang Kelelahan',
      subtitle: 'Sistem rekomendasi mengalami kendala teknis',
      description: 'Jangan khawatir, ini bukan salahmu! AI kami sedang istirahat sebentar. Coba lagi atau jelajahi semua kursus terbaik kami.',
      retryButton: 'Coba Lagi',
      supportText: 'Masih bermasalah?',
      contactSupport: 'Hubungi Tim Support',
    },
    timeout: {
      title: 'Sabar ya, AI Sedang Kerja Keras Untukmu',
      subtitle: 'Rekomendasi personalmu masih dalam proses',
      description: 'AI kami benar-benar serius mencari kursus terbaik untukmu. Tunggu sebentar lagi atau mulai jelajahi kursus yang tersedia sekarang juga!',
      waitButton: 'Tunggu Sebentar Lagi',
      browseButton: 'Jelajahi Kursus Sekarang',
    },
    empty: {
      title: 'Belum Menemukan yang Pas? Tenang!',
      subtitle: 'Tidak ada kursus yang cocok dengan kriteria spesifikmu',
      description: 'Ini artinya kamu punya preferensi yang unik! Jangan menyerah, jelajahi semua kursus kami. Siapa tahu menemukan passion baru yang mengubah karirmu.',
      browseButton: 'Jelajahi Semua Kursus',
    },
    network: {
      title: 'Koneksi Bermasalah Nih',
      subtitle: 'Tidak dapat terhubung ke layanan rekomendasi',
      description: 'Cek koneksi internetmu dan coba lagi. Rekomendasi personal menunggumu!',
      retryButton: 'Coba Lagi',
    },
  },

  // Call-to-Action Messages
  cta: {
    skipButton: 'Jelajahi Semua Kursus',
    skipDescription: 'Lihat koleksi lengkap kursus terbaik',
    urgency: 'Mulai hari ini, jangan tunda karir impianmu!',
    socialProof: 'Bergabung dengan 12k+ profesional yang sudah berhasil upgrade skill dengan rekomendasi AI',
    valueProposition: 'Rekomendasi personal berdasarkan AI untuk hasil pembelajaran yang maksimal',
  },

  // Status Messages
  status: {
    completed: {
      title: 'Siap Upgrade Skill!',
      subtitle: 'Kursus personalmu sudah siap dipelajari',
    },
    failed: {
      title: 'Ada kendala teknis',
      subtitle: 'Yuk coba pendekatan yang berbeda',
    },
  },

  // Progress and Timing
  progress: {
    autoTimeoutText: 'Otomatis timeout dalam',
    seconds: 'detik',
  },
} as const;

// Type for better TypeScript support
export type RecommendationCopyType = typeof RECOMMENDATION_COPY;