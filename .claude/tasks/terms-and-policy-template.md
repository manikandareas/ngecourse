Siap. Di bawah ini ada **outline** dan **teks statis siap-tempel** (ringkas) untuk **/privacy** dan **/terms**, sudah disesuaikan dengan stack kamu: React Router 7 (SSR), **Clerk** (auth), **Sanity** (data utama), **Hono + Inngest** (services di Vercel), dan **AI SDK** (provider model pihak ketiga).
Catatan: ini **bukan nasihat hukum**; di industri, dokumen produksi biasanya direview legal.

---

# /privacy — Privacy Policy

## Outline konten

1. Ringkasan & ruang lingkup + tanggal berlaku.
2. Data yang dikumpulkan:

   * Identitas akun dari **Clerk** (email, nama, avatar, OAuth provider).
   * Konten & aktivitas belajar di **Sanity** (course, chapter, lesson, quiz/attempt, chat/session).
   * Event layanan dari **Hono/Inngest/Vercel** (IP, user-agent, log).
   * Data AI (prompt, respons) yang diproses oleh **AI model provider** via AI SDK.
   * (Opsional) Analitik/cookies & pembayaran jika ada.
3. Tujuan pemrosesan (menjalankan layanan, personalisasi/rekomendasi kursus, keamanan, dukungan, analitik).
4. Dasar hukum (jika relevan GDPR: kontrak, legitimate interest, persetujuan untuk cookies/marketing).
5. Berbagi data / sub-processor: Clerk, Sanity, Vercel, Inngest, AI provider, (opsional: email/analitik).
6. Retensi & penghapusan (berapa lama tiap kategori disimpan; kriteria wipe).
7. Hak pengguna (akses, koreksi, hapus, portabilitas, tarik consent) dan cara request.
8. Keamanan (enkripsi in-transit, kontrol akses via Clerk, least privilege, audit/log).
9. Transfer internasional data & mekanisme perlindungan standar.
10. Privasi anak (batas usia, larangan penggunaan).
11. Perubahan kebijakan & cara pemberitahuan.
12. Kontak (email support/DPO).

## Teks statis (ringkas, siap ditempel)

**Effective date:** \[\[DD Month YYYY]]
**Pemilik Layanan:** \[\[Nama Produk/Perusahaan]] — \[\[email kontak]]

**Ruang Lingkup.** Kebijakan ini menjelaskan bagaimana kami memproses data saat Anda menggunakan aplikasi dan situs kami di \[\[domain]].

**Data yang Kami Kumpulkan.**

* **Akun (Clerk):** email, nama, avatar, dan informasi OAuth.
* **Data Aplikasi (Sanity):** kursus, chapter, lesson, quiz & attempt, progres, chat session/message, rekomendasi.
* **Log Layanan (Hono/Inngest/Vercel):** alamat IP, user-agent, timestamp, dan event sistem untuk keamanan & keandalan.
* **Data AI (AI SDK):** prompt dan respons yang diproses oleh penyedia model pihak ketiga (mis. OpenAI/Anthropic/\[\[lainnya]]).
* **Cookies/Analitik (jika ada):** untuk performa, keamanan, dan peningkatan produk.

**Cara Kami Menggunakan Data.** Menyediakan dan mengoperasikan layanan, autentikasi, personalisasi & rekomendasi kursus, analitik agregat, dukungan, pencegahan penyalahgunaan, dan pemenuhan kewajiban hukum.

**Dasar Pemrosesan.** Pelaksanaan kontrak, kepentingan sah, dan/atau persetujuan (khususnya untuk cookies/marketing jika berlaku).

**Berbagi Data.** Kami menggunakan sub-processor: **Clerk** (auth), **Sanity** (penyimpanan konten), **Vercel** (hosting/edge), **Inngest** (job/queue), **AI provider** (inferensi). Mereka memproses data sesuai instruksi kami dan perjanjian pemrosesan data yang berlaku.

**Retensi.** Data akun disimpan selama akun aktif. Data belajar & log disimpan sesuai kebutuhan operasional dan hukum; setelahnya dihapus atau dianonimkan.

**Hak Anda.** Anda dapat meminta akses, koreksi, penghapusan, portabilitas, atau membatasi pemrosesan. Hubungi kami di \[\[email]]. Untuk penghapusan akun, Anda juga dapat menggunakan pengaturan akun di aplikasi (Clerk).

**Keamanan.** Enkripsi in-transit (HTTPS), kontrol akses berbasis peran, minimisasi data, dan audit log.

**Transfer Internasional.** Data dapat diproses di negara lain; kami menerapkan mekanisme perlindungan standar yang diakui.

**Privasi Anak.** Layanan tidak ditujukan untuk pengguna di bawah usia \[\[13/16]] tahun.

**Perubahan.** Kami dapat memperbarui kebijakan ini. Perubahan material akan diberitahukan melalui aplikasi atau email.

**Kontak.** \[\[email]], \[\[alamat (opsional)]].

---

# /terms — Terms of Service

## Outline konten

1. Penerimaan syarat & ringkasan (siapa pihaknya, tanggal berlaku).
2. Akun & keamanan (Clerk), tanggung jawab pengguna, keakuratan data.
3. Lisensi penggunaan layanan & batasan (AUP): larangan penyalahgunaan, scraping, reverse engineering, spam.
4. Konten pengguna (UGC): kepemilikan pengguna, lisensi terbatas ke platform untuk pengoperasian, moderasi.
5. Fitur AI & Disklaimer: konten AI bisa keliru; bukan nasihat profesional; tanggung jawab penggunaan.
6. Pembayaran & langganan (jika ada): harga, billing, refund, pembatasan.
7. Perubahan layanan, downtime, dan SLA (best-effort untuk edukasi konsumen).
8. Hak kekayaan intelektual (merek, materi kursus, kode).
9. Penghentian (suspensi/terminasi) & dampaknya pada akses data.
10. Batasan tanggung jawab & disclaimer garansi.
11. Hukum yang berlaku & penyelesaian sengketa.
12. Perubahan ToS & cara pemberitahuan.
13. Kontak.

## Teks statis (ringkas, siap ditempel)

**Effective date:** \[\[DD Month YYYY]]
Dengan membuat akun atau menggunakan **\[\[Nama Produk]]**, Anda setuju pada Syarat Layanan ini.

**Akun & Keamanan.** Pendaftaran dan masuk menggunakan **Clerk**. Anda bertanggung jawab menjaga kredensial dan aktivitas pada akun Anda.

**Lisensi Penggunaan.** Kami memberi Anda lisensi terbatas, non-eksklusif, tidak dapat dipindahtangankan untuk mengakses dan menggunakan layanan sesuai Syarat ini. Dilarang menyalahgunakan layanan, termasuk: merusak keamanan, scraping tanpa izin, otomatisasi berlebihan, atau pelanggaran hukum.

**Konten Pengguna.** Anda tetap memiliki hak atas materi yang Anda unggah atau hasil kerja Anda. Anda memberi kami lisensi terbatas untuk menyimpan, menyalin, dan menampilkan konten tersebut semata-mata guna mengoperasikan dan meningkatkan layanan.

**Fitur AI & Disklaimer.** Layanan menyertakan fitur AI (melalui **AI SDK** dengan penyedia model pihak ketiga). Output AI mungkin tidak akurat, tidak lengkap, atau tidak sesuai konteks. Konten AI disediakan “apa adanya” dan **bukan** nasihat profesional. Anda bertanggung jawab meninjau sebelum digunakan.

**Pembayaran (jika berlaku).** Ketentuan harga, penagihan, dan kebijakan refund akan dijelaskan di halaman harga atau pada saat pembelian. Kegagalan pembayaran dapat menyebabkan penangguhan layanan.

**Perubahan Layanan.** Kami dapat memperbarui, menambah, atau menghapus fitur. Kami berupaya menjaga ketersediaan, namun tidak menjamin bebas gangguan.

**Kekayaan Intelektual.** Merek, UI, kode, dan materi resmi milik **\[\[Nama Produk/Perusahaan]]** atau pemberi lisensi. Dilarang menggunakan tanpa izin.

**Penghentian.** Kami dapat menangguhkan atau mengakhiri akses jika terjadi pelanggaran Syarat. Anda dapat berhenti menggunakan layanan kapan saja; beberapa ketentuan (mis. kepemilikan IP, batasan tanggung jawab) tetap berlaku.

**Batasan Tanggung Jawab.** Sejauh diizinkan hukum, kami tidak bertanggung jawab atas kerugian tidak langsung, insidental, konsekuensial, atau kehilangan data/keuntungan yang timbul dari penggunaan layanan.

**Hukum yang Berlaku.** Syarat ini diatur oleh hukum \[\[jurisdiksi]]. Sengketa diselesaikan di pengadilan \[\[kota/negara]] atau melalui mekanisme penyelesaian sengketa yang disepakati.

**Perubahan Syarat.** Kami dapat memperbarui Syarat ini dan akan memberi tahu perubahan material melalui aplikasi atau email.

**Kontak.** Pertanyaan tentang Syarat: \[\[email]].

---

## Tips praktis (statis tanpa CMS)

* Tambahkan **“Effective date”** dan update versi secara manual saat ada perubahan.
* Tautkan keduanya dari **footer** dan dari layar **signup/login** (Clerk) sebagai checkbox/link.
* Simpan **versi saat setuju** di metadata user (kalau nanti ingin), tetapi untuk saat ini bisa cukup statis.
* Jika belum pakai analitik atau pembayaran, biarkan barisnya ada sebagai “jika berlaku” agar mudah diaktifkan nanti.
