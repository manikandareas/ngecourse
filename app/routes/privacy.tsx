import { PageBackground } from '~/components/ui/page-background';

export function meta() {
  return [
    { title: 'Kebijakan Privasi | Genii' },
    {
      name: 'description',
      content:
        'Kebijakan Privasi Genii - Pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.',
    },
  ];
}

export default function PrivacyPage() {
  return (
    <PageBackground variant="purple-cyan">
      <div className="relative min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 font-light text-4xl text-text-primary leading-tight tracking-tight md:text-5xl">
              Kebijakan Privasi
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed">
              Terakhir diperbarui: 28 Agustus 2025
            </p>
          </div>

          {/* Main Content */}
          <div className="glass-card space-y-8">
            {/* Introduction */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Ruang Lingkup
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Kebijakan ini menjelaskan bagaimana <strong>Genii</strong>{' '}
                memproses data saat Anda menggunakan aplikasi dan situs kami.
                Dengan menggunakan layanan kami, Anda menyetujui pengumpulan dan
                penggunaan informasi sesuai dengan kebijakan ini.
              </p>
            </section>

            {/* Data Collection */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Data yang Kami Kumpulkan
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-medium text-lg text-text-primary">
                    Akun (Clerk)
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    Email, nama, avatar, dan informasi OAuth dari penyedia
                    autentikasi yang Anda pilih.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-medium text-lg text-text-primary">
                    Data Aplikasi (Sanity)
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    Kursus, chapter, lesson, quiz & attempt, progres belajar,
                    chat session/message, dan rekomendasi yang dipersonalisasi.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-medium text-lg text-text-primary">
                    Log Layanan (Hono/Inngest/Vercel)
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    Alamat IP, user-agent, timestamp, dan event sistem untuk
                    keamanan & keandalan layanan.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-medium text-lg text-text-primary">
                    Data AI (AI SDK)
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    Prompt dan respons yang diproses oleh penyedia model pihak
                    ketiga (seperti OpenAI/Anthropic) untuk fitur AI kami.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-medium text-lg text-text-primary">
                    Cookies/Analitik (jika ada)
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    Data untuk performa, keamanan, dan peningkatan produk.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Usage */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Cara Kami Menggunakan Data
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Kami menggunakan data untuk menyediakan dan mengoperasikan
                layanan, autentikasi, personalisasi & rekomendasi kursus,
                analitik agregat, dukungan, pencegahan penyalahgunaan, dan
                pemenuhan kewajiban hukum.
              </p>
            </section>

            {/* Legal Basis */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Dasar Pemrosesan
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Pelaksanaan kontrak, kepentingan sah, dan/atau persetujuan
                (khususnya untuk cookies/marketing jika berlaku).
              </p>
            </section>

            {/* Data Sharing */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Berbagi Data
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Kami menggunakan sub-processor: <strong>Clerk</strong> (auth),{' '}
                <strong>Sanity</strong> (penyimpanan konten),
                <strong>Vercel</strong> (hosting/edge), <strong>Inngest</strong>{' '}
                (job/queue), <strong>AI provider</strong> (inferensi). Mereka
                memproses data sesuai instruksi kami dan perjanjian pemrosesan
                data yang berlaku.
              </p>
            </section>

            {/* Data Retention */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Retensi
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Data akun disimpan selama akun aktif. Data belajar & log
                disimpan sesuai kebutuhan operasional dan hukum; setelahnya
                dihapus atau dianonimkan.
              </p>
            </section>

            {/* User Rights */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Hak Anda
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Anda dapat meminta akses, koreksi, penghapusan, portabilitas,
                atau membatasi pemrosesan. Hubungi kami di{' '}
                <strong>[email kontak]</strong>. Untuk penghapusan akun, Anda
                juga dapat menggunakan pengaturan akun di aplikasi (Clerk).
              </p>
            </section>

            {/* Security */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Keamanan
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Enkripsi in-transit (HTTPS), kontrol akses berbasis peran,
                minimisasi data, dan audit log untuk melindungi informasi Anda.
              </p>
            </section>

            {/* International Transfer */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Transfer Internasional
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Data dapat diproses di negara lain; kami menerapkan mekanisme
                perlindungan standar yang diakui.
              </p>
            </section>

            {/* Children Privacy */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Privasi Anak
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Layanan tidak ditujukan untuk pengguna di bawah usia 13 tahun.
              </p>
            </section>

            {/* Policy Changes */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Perubahan
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Kami dapat memperbarui kebijakan ini. Perubahan material akan
                diberitahukan melalui aplikasi atau email.
              </p>
            </section>

            {/* Contact */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Kontak
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Untuk pertanyaan tentang kebijakan privasi ini, hubungi kami di{' '}
                <strong>[email kontak]</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </PageBackground>
  );
}
