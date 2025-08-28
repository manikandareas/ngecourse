import { PageBackground } from '~/components/ui/page-background';

export function meta() {
  return [
    { title: 'Syarat Layanan | Genii' },
    {
      name: 'description',
      content:
        'Syarat dan Ketentuan Layanan Genii - Pelajari hak dan kewajiban Anda sebagai pengguna platform pembelajaran kami.',
    },
  ];
}

export default function TermsPage() {
  return (
    <PageBackground variant="purple-cyan">
      <div className="relative min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 font-light text-4xl text-text-primary leading-tight tracking-tight md:text-5xl">
              Syarat Layanan
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
                Penerimaan Syarat
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Dengan membuat akun atau menggunakan <strong>Genii</strong>,
                Anda setuju pada Syarat Layanan ini. Jika Anda tidak setuju
                dengan syarat-syarat ini, mohon tidak menggunakan layanan kami.
              </p>
            </section>

            {/* Account & Security */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Akun & Keamanan
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Pendaftaran dan masuk menggunakan <strong>Clerk</strong>. Anda
                bertanggung jawab menjaga kredensial dan aktivitas pada akun
                Anda. Pastikan informasi akun Anda selalu akurat dan terkini.
              </p>
            </section>

            {/* License */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Lisensi Penggunaan
              </h2>
              <p className="mb-4 text-text-secondary leading-relaxed">
                Kami memberi Anda lisensi terbatas, non-eksklusif, tidak dapat
                dipindahtangankan untuk mengakses dan menggunakan layanan sesuai
                Syarat ini.
              </p>
              <div className="space-y-2">
                <h3 className="font-medium text-lg text-text-primary">
                  Dilarang:
                </h3>
                <ul className="ml-4 list-inside list-disc space-y-1 text-text-secondary leading-relaxed">
                  <li>Merusak keamanan sistem</li>
                  <li>Scraping konten tanpa izin</li>
                  <li>Otomatisasi berlebihan</li>
                  <li>Pelanggaran hukum yang berlaku</li>
                </ul>
              </div>
            </section>

            {/* User Content */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Konten Pengguna
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Anda tetap memiliki hak atas materi yang Anda unggah atau hasil
                kerja Anda. Anda memberi kami lisensi terbatas untuk menyimpan,
                menyalin, dan menampilkan konten tersebut semata-mata guna
                mengoperasikan dan meningkatkan layanan.
              </p>
            </section>

            {/* AI Features */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Fitur AI & Disclaimer
              </h2>
              <div className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  Layanan menyertakan fitur AI (melalui <strong>AI SDK</strong>{' '}
                  dengan penyedia model pihak ketiga). Output AI mungkin tidak
                  akurat, tidak lengkap, atau tidak sesuai konteks.
                </p>
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
                  <p className="font-medium text-sm text-yellow-700">
                    � Konten AI disediakan "apa adanya" dan{' '}
                    <strong>bukan</strong> nasihat profesional. Anda bertanggung
                    jawab meninjau sebelum digunakan.
                  </p>
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Pembayaran
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Ketentuan harga, penagihan, dan kebijakan refund akan dijelaskan
                di halaman harga atau pada saat pembelian. Kegagalan pembayaran
                dapat menyebabkan penangguhan layanan.
              </p>
            </section>

            {/* Service Changes */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Perubahan Layanan
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Kami dapat memperbarui, menambah, atau menghapus fitur. Kami
                berupaya menjaga ketersediaan, namun tidak menjamin bebas
                gangguan 100%.
              </p>
            </section>

            {/* Intellectual Property */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Kekayaan Intelektual
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Merek, UI, kode, dan materi resmi milik <strong>Genii</strong>{' '}
                atau pemberi lisensi. Dilarang menggunakan tanpa izin tertulis
                dari kami.
              </p>
            </section>

            {/* Termination */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Penghentian
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Kami dapat menangguhkan atau mengakhiri akses jika terjadi
                pelanggaran Syarat. Anda dapat berhenti menggunakan layanan
                kapan saja; beberapa ketentuan (mis. kepemilikan IP, batasan
                tanggung jawab) tetap berlaku setelah penghentian.
              </p>
            </section>

            {/* Liability Limitation */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Batasan Tanggung Jawab
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Sejauh diizinkan hukum, kami tidak bertanggung jawab atas
                kerugian tidak langsung, insidental, konsekuensial, atau
                kehilangan data/keuntungan yang timbul dari penggunaan layanan.
              </p>
            </section>

            {/* Governing Law */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Hukum yang Berlaku
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Syarat ini diatur oleh hukum Indonesia. Sengketa diselesaikan di
                pengadilan yang berwenang atau melalui mekanisme penyelesaian
                sengketa yang disepakati.
              </p>
            </section>

            {/* Terms Changes */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Perubahan Syarat
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Kami dapat memperbarui Syarat ini dan akan memberi tahu
                perubahan material melalui aplikasi atau email. Penggunaan
                layanan yang berkelanjutan setelah perubahan berarti Anda
                menyetujui syarat yang baru.
              </p>
            </section>

            {/* Contact */}
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl text-text-primary">
                Kontak
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Pertanyaan tentang Syarat Layanan ini dapat ditujukan ke{' '}
                <strong>[email kontak]</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </PageBackground>
  );
}
