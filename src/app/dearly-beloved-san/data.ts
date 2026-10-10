export interface StoryMilestone {
  id: string;
  date: string;
  badge: string;
  title: string;
  description: string;
  location?: string;
  quote?: string;
  polaroid: {
    caption: string;
    image?: string; // Opsional: URL gambar/foto asli
    rotation?: number; // deg
  };
}

export interface LoveReason {
  id: number;
  title: string;
  description: string;
  iconName: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  date: string;
  image?: string; // Opsional: URL gambar asli, misal '/images/timeline/foto1.jpg'
  caption: string;
  location?: string;
}

export interface Track {
  id: number;
  title: string;
  artist: string;
  src: string;
}

export interface SurpriseGiftCard {
  enabled: boolean;
  badge: string;
  quizQuestion: string;
  quizAnswerHashes: string[]; // SHA-256 Hash terenkripsi agar jawaban rahasia tidak bocor di source code / inspect
  encryptedVoucherMap?: Record<string, string>; // Kode voucher terenkripsi AES-GCM (hanya bisa didekripsi dengan jawaban yang benar)
  encryptedVoucherCode?: string; // (Opsional) jika hanya 1 jawaban
  voucherCode?: string; // (Opsional) fallback plaintext jika tidak ingin dienkripsi
  quizAnswers?: string[]; // (Opsional) fallback jika ingin teks biasa
  quizHint?: string;
  cardTitle: string;
  amountOrReward: string;
  validThru?: string;
  note: string;
  whatsappNumber?: string;
  redeemGuideUrl?: string;
}

export interface AnniversaryData {
  couple: {
    nicknamePartner: string;
    partnerFullName: string;
    myNickname: string;
    anniversaryDate: string; // YYYY-MM-DD
    ldrDate: string; // Tanggal mulai LDR
    ldrDateFormatted: string;
    tagline: string;
    distanceTagline: string;
  };
  music: Track;
  playlist: Track[];
  stats: {
    daysTogether: number;
    hoursCount: string;
    videoCallHours: string;
    virtualDates: string;
    heartDistance: string;
    ldrMilestone: string;
  };
  milestones: StoryMilestone[];
  reasons: LoveReason[];
  gallery: GalleryItem[];
  surprise: {
    boxLabel: string;
    letterTitle: string;
    letterDate: string;
    letterContent: string[];
    closingMessage: string;
    senderName: string;
    proposalQuestion: string;
    yesButtonText: string;
    giftCard?: SurpriseGiftCard;
  };
}

export const anniversaryConfig: AnniversaryData = {
  couple: {
    nicknamePartner: 'Sayangku',
    partnerFullName: 'My Dearly Beloved Sandrina',
    myNickname: 'Aku',
    anniversaryDate: '2024-10-08', // Tanggal jadian: 8 Oktober 2024
    ldrDate: '2025-07-31', // Tanggal mulai LDR: 31 Juli
    ldrDateFormatted: '31 Juli',
    tagline: 'Terpisah Ratusan Kilometer Sejak 31 Juli, Namun Hati Kita Selalu Menetap di Rumah yang Sama',
    distanceTagline: '✈️ LDR Sejak 31 Juli • Dua Raga Terpisah Jarak, Satu Hati Disatukan Cinta 📍',
  },
  music: {
    id: 1,
    title: 'Kota Ini Tak Sama Tanpamu',
    artist: 'Nadhif Basalamah',
    src: '/music/nadhif-basalamah-kota-ini-tak-sama-tanpamu.mp3',
  },
  playlist: [
    {
      id: 1,
      title: 'Kota Ini Tak Sama Tanpamu',
      artist: 'Nadhif Basalamah',
      src: '/music/nadhif-basalamah-kota-ini-tak-sama-tanpamu.mp3',
    },
    {
      id: 2,
      title: '1000x',
      artist: 'Ghea Indrawari',
      src: '/music/ghea-indrawari-1000X.mp3',
    },
    {
      id: 3,
      title: 'Everything U Are',
      artist: 'Hindia',
      src: '/music/hindia-everything-u-are.mp3',
    },
  ],
  stats: {
    daysTogether: 732,
    hoursCount: '1,800+', // Jam chat harian, voice note & percakapan selama 2 tahun
    videoCallHours: '280+', // Jam video call & sleep call realistis (2+ bulan LDR + virtual sebelumnya)
    virtualDates: '60+', // Sesi kencan virtual, nonton bareng, & makan online
    heartDistance: '0 cm (Selalu di Hati)',
    ldrMilestone: 'LDR sejak 31 Juli',
  },
  milestones: [
    {
      id: 'chapter-1',
      date: '8 Oktober 2024 (Hari Jadian)',
      badge: 'Chapter 01 : Our Beginning',
      title: 'Hari Pertama Segalanya Dimulai',
      description:
        '8 Oktober 2024 menjadi hari paling berharga saat kita resmi memulai hubungan ini. Momen manis saat kita saling berjanji, tawa canggung di awal, dan rasa bahagia yang membuncah setiap kali menatap matamu.',
      location: 'Awal Kisah Manis Kita: Ground Cafe',
      quote: '"Kadang hal terindah datang tanpa aba-aba, dan kamu adalah anugerah terindah bagiku."',
      polaroid: {
        caption: '29 Oktober 2024 • Usahamu biar aku engga canggung lagi 💍❤️',
        image: '/images/timeline/chapter-1.jpeg',
        rotation: -2,
      },
    },
    {
      id: 'chapter-2',
      date: 'Memori Bersama (Sebelum Berjarak)',
      badge: 'Chapter 02 : Sweet Memories',
      title: 'Kenangan Hangat yang Menjadi Penguat',
      description:
        'Jalan berdua, tawa di meja makan, genggaman tanganmu, hingga pose manis di foto studio dan kebanggaan momen wisuda kita. Semua kenangan berharga itu menjadi jangkar yang menjaga hati ini tetap kokoh, sejauh apa pun jarak membentang.',
      location: 'Perjalanan & Momen Manis Kita',
      quote: '"Setiap detik yang pernah kita habiskan bersama adalah bekal terindah saat rindu datang."',
      polaroid: {
        caption: 'Kenangan manis yang selalu kurindukan ☕✨',
        image: '/images/timeline/chapter-2.png',
        rotation: 3,
      },
    },
    {
      id: 'chapter-3',
      date: '31 Juli (Hari Mulai LDR)',
      badge: 'Chapter 03 : The Departure & Promise',
      title: '31 Juli: Saat Jarak Mulai Memisahkan',
      description:
        'Tanggal 31 Juli menjadi hari yang tak akan pernah kulupakan. Hari di mana kita harus melambaikan tangan perpisahan dan memulai babak baru sebagai pejuang LDR. Berat rasanya melepaskan genggaman itu, tapi kita saling berjanji bahwa jarak tidak akan pernah mengalahkan rasa kita.',
      location: 'Whatsapp Chat & Kelling Kota Terakhir',
      quote: '"Perpisahan di tanggal 31 Juli bukan akhir, melainkan awal pembuktian seberapa kuat cinta kita."',
      polaroid: {
        caption: '31 Juli • Titik awal perjuangan LDR kita ✈️💌',
        image: '/images/timeline/chapter-3.png',
        rotation: -3,
      },
    },
    {
      id: 'chapter-4',
      date: 'Fase LDR (Video Call)',
      badge: 'Chapter 04 : Screens & Deep Longing',
      title: 'Menembus Jarak Lewat Layar Ponsel',
      description:
        'Sejak 31 Juli, layar ponsel menjadi jembatan pertemuan kita setiap hari. Ribuan jam obrolan, suaramu di seberang sana selalu berhasil menjadi penenang terbaik di hari-hariku yang lelah.',
      location: 'Di Balik Layar Panggilan Rindu',
      quote: '"Suaramu di seberang pulau selalu berhasil memeluk hatiku yang sedang rindu."',
      polaroid: {
        caption: 'Ratusan kisah di layar ponsel 📱🌙',
        image: '/images/timeline/chapter-4.png',
        rotation: 2,
      },
    },
    {
      id: 'chapter-5',
      date: 'Hari Ini (Spesial 2nd Anniversary)',
      badge: 'Chapter 05 : 2 Years Strong',
      title: 'Dua Tahun Bertahan, Cinta Makin Kokoh',
      description:
        'Dua tahun sejak 8 Oktober 2024, dan berhasil melalui ujian jarak sejak 31 Juli dengan penuh kesetiaan. Hubungan ini membuktikan bahwa kita bukan hanya bisa bersama saat dekat, tapi juga saling menjaga saat berjauhan. Selamat 2nd Anniversary, Sayangkuu!',
      location: 'Menuju Hari Bersatu Selamanya',
      quote: '"Jarak sejak 31 Juli ini hanya sementara, tapi cintaku padamu adalah selamanya."',
      polaroid: {
        caption: 'Happy 2nd Anniversary, Sayangku! 🥂💖',
        image: '/images/timeline/chapter-5.jpg',
        rotation: -1,
      },
    },
  ],
  reasons: [
    {
      id: 1,
      title: 'Suara Sebagai Obat Kangen',
      description: 'Mendengar suaramu di telepon selalu berhasil menenangkan hati dan menjadi obat paling ampuh saat rindu melanda.',
      iconName: 'Volume2',
    },
    {
      id: 2,
      title: 'Wajah Saat Video Call',
      description: 'Tatap matamu dan senyum manismu di layar ponsel yang selalu kurindukan setiap hari, membuat jarak terasa tak lagi membatasi.',
      iconName: 'Video',
    },
    {
      id: 3,
      title: 'Kesabaran dan Kepercayaan',
      description: 'Ketulusanmu dalam menjaga komitmen, saling percaya, dan sabar menjalani hari-hari LDR ini adalah pondasi terkuat cinta kita.',
      iconName: 'ShieldCheck',
    },
    {
      id: 4,
      title: 'Mimpi Masa Depan',
      description: 'Rencana dan impian indah yang kita rajut bersama, keyakinan bahwa suatu hari nanti kita akan hidup berdampingan di bawah satu atap.',
      iconName: 'Compass',
    },
    {
      id: 5,
      title: 'Kesupportif-an',
      description: 'Kamu yang selalu ada mendukung setiap langkahku dan selalu percaya padaku bahkan saat duniaku sedang berat.',
      iconName: 'HeartHandshake',
    },
  ],
  gallery: [
    {
      id: 1,
      title: 'Seminar Proposal Sayangku',
      category: 'Sebelum LDR',
      date: 'Awal 2025',
      image: '/images/gallery/1.jpg',
      caption: 'Hari aku berpikir bahwa aku bahagia karena kamu ada di hidupku.',
      location: 'Seminar Proposalmu 😁',
    },
    {
      id: 2,
      title: 'Sebelum Kamu Seminar Proposal',
      category: 'Sebelum LDR',
      date: 'Awal 2025',
      image: '/images/gallery/2.jpg',
      caption: 'Aku yakin kamu akan menjadi orang yang sangat istimewa dalam hidupku.',
      location: 'Depan Ruang Seminar',
    },
    {
      id: 3,
      title: 'Kita Habis Beli Kopi',
      category: 'Sebelum LDR',
      date: 'Awal 2025',
      image: '/images/gallery/3.jpg',
      caption: 'Kita habis beli kopi kenangan sore-sore 😁',
      location: 'Kopi Kenangan',
    },
    {
      id: 4,
      title: 'Dinner setelah Night Ride',
      category: 'Sebelum LDR',
      date: 'Awal 2025',
      image: '/images/gallery/4.jpg',
      caption: 'Kita habis jalan-jalan, terus lagi makan nasi goreng bareng di Vorvo.',
      location: 'Simpang Vorvo',
    },
    {
      id: 5,
      title: 'Jalan-jalan ke City Centrum',
      category: 'Sebelum LDR',
      date: 'Awal 2025',
      image: '/images/gallery/5.jpg',
      caption: 'Kita lagi jalan-jalan ke City Centrum nyari tempat nugas.',
      location: 'City Centrum',
    },
    {
      id: 6,
      title: 'Persiapan Magang ke Cepu',
      category: 'Sebelum LDR',
      date: 'Awal 2025',
      image: '/images/gallery/6.jpg',
      caption: 'Kita lagi mau bikin surat keterangan sehat di Klinik Tentara arah Islamic Center.',
      location: 'Klinik Tentara',
    },
    {
      id: 7,
      title: 'Jogging Pagi di Bojonegoro',
      category: 'Sebelum LDR',
      date: 'Agustus 2025',
      image: '/images/gallery/7.jpg',
      caption: 'Pagi bahagia di Bojonegoro, kita mau jalan pagi ke Pasar.',
      location: 'Panglima Polim',
    },
    {
      id: 8,
      title: 'Senyum Manis Favoritku',
      category: 'Potret Manis',
      date: 'Spesial',
      image: '/images/gallery/8.jpg',
      caption: 'Senyum yang selalu menjadi obat paling ampuh dan alasan terindah untuk tetap semangat menjalani hari.',
      location: 'Selalu di Ingatan',
    },
    {
      id: 9,
      title: 'Momen Sego Kobong',
      category: 'Makan-makan',
      date: 'Jam Istirahat',
      image: '/images/gallery/9.jpg',
      caption: 'Momen kita lagi mesan makan di Sego Kobong langganan kita.',
      location: 'Cepu',
    },
    {
      id: 10,
      title: 'Semarang We Go!',
      category: 'Jalan-jalan',
      date: 'Waktu Liburan',
      image: '/images/gallery/10.jpg',
      caption: 'Pertama kali kita pergi jalan-jalan jauh pakai motor.',
      location: 'Semarang',
    },
    {
      id: 11,
      title: 'Beli Jajan di depan PPSDM',
      category: 'Jalan-jajan',
      date: 'Jam Istirahat',
      image: '/images/gallery/11.jpg',
      caption: 'Momen kita beli jajan di depan PPSDM.',
      location: 'Tempat jajan favorit kita',
    },
    {
      id: 12,
      title: 'Naik ke Bromo',
      category: 'Liburan',
      date: 'Habis Magang',
      image: '/images/gallery/12.jpg',
      caption: 'Hari kita nekat ke Bromo dan memang terbayarkan, terima kasih sayang.',
      location: 'Gunung Bromo',
    },
    {
      id: 13,
      title: 'Foto untuk Ijazah',
      category: 'Sebelum LDR',
      date: 'Awal 2026',
      image: '/images/gallery/13.jpg',
      caption: 'Kamu yang lagi bantuin aku foto untuk ijazah.',
      location: 'Kings Foto Studio',
    },
    {
      id: 14,
      title: 'Liburan ke Borobudur',
      category: 'Liburan',
      date: 'Pas Kita di Jawa',
      image: '/images/gallery/14.jpg',
      caption: 'Momen kita liburan ke Borobudur naik motor dan bawa banyak barang wkwkw.',
      location: 'Borobudur',
    },
    {
      id: 15,
      title: 'Foto Studio untuk Kenangan',
      category: 'Potret Manis',
      date: 'Habis Wisuda',
      image: '/images/gallery/15.jpg',
      caption: 'Kamu ngajakin aku foto studio untuk pertama kalinya dan aku sangat senang hehe, terima kasih sayangkuu.',
      location: 'UKIYO',
    },
    {
      id: 16,
      title: 'Mau Foto Lagi tapi Tema Wisuda',
      category: 'Potret Manis',
      date: 'Habis Wisuda',
      image: '/images/gallery/16.jpg',
      caption: 'Mau foto di perpustakaan daerah, tapi kita kehujanan yang syukurnya hasilnya bagus.',
      location: 'Perpustakaan Daerah',
    },
    {
      id: 17,
      title: 'Ngopi di Klinik untuk menikmati Momen Bersama',
      category: 'Potret Manis',
      date: 'Sebelum LDR',
      image: '/images/gallery/17.jpg',
      caption: 'Quality time di klinik, menikmati momen bersama dan membahas segala hal.',
      location: 'Klinik Kopi',
    },
  ],
  surprise: {
    boxLabel: 'Buka Surat Kejutan untuk Pejuang LDR-ku 🎁💌',
    letterTitle: 'Surat Cinta 2 Tahun: Menjaga Hati Sejak 8 Oktober 2024 & LDR Sejak 31 Juli',
    letterDate: '8 Oktober 2024 – Hari Ini (2nd Anniversary)',
    letterContent: [
      'Halooo, sayangkuu cintakuuu 😘💖',
      'Engga kerasa udah dua tahun sejak 8 Oktober 2024 kita memulai hubungan ini. Dan ketika tanggal 31 Juli kemarin tiba saat jarak harus memisahkan langkah kita, jujur aku punya rasa cemas dan rindu yang sangat berat setiap kali kita tatap muka via layar.',
      'Tapi kamu selalu membuktikan bahwa kita bisa melalui ini bersama walau percakapan kita hanya bisa lewat panggilan suara, caramu menjaga kesetiaan dan kesabaranmu membuatku merasa menjadi orang paling beruntung di dunia.',
      'Terima kasih banyak ya, sayang... Terima kasih sudah bertahan sejak dengan aku dari awal hingga hari ini, terima kasih sudah selalu percaya pada janji kita, dan terima kasih sudah mencintaiku dengan begitu tulus meski raga kita terpaut jarak.',
      'Percayalah, hari-hari penantian ini akan berbuah sangat manis. Suatu hari nanti, kita pasti engga perlu hidup berjarak lagi. Engga perlu lagi khawatir satu sama lain atas hal-hal kecil. Yang ada hanyalah kita, membuka pintu rumah yang sama setiap sore.',
      'Aku ingin kita terus berjuang bersama, menjaga hati ini tetap utuh, dan membuktikan bahwa cinta kita lebih kuat dari jarak yang memisahkan. Aku yakin kita bisa melewati semua ini, karena aku percaya bahwa kita pasti bisa sayanggg.',
      'Aku memohon maaf kalau selama ini aku belum bisa menjadi pasangan yang sempurna dan seringkali membuat masalah, tapi aku janji bahwa aku berusaha menjadi yang terbaik untukmu. Aku ingin kita selalu saling mendukung, saling menguatkan, dan saling mencintai tanpa batas.',
      'Mungkin kata-kata ini engga cukup untuk menggambarkan betapa besar rasa cintaku padamu, tapi aku ingin kamu tahu bahwa aku mencintaimu lebih dari apapun di dunia ini, dalam suka maupun duka.',
      'Sekali lagi, aku memohon maaf atas segala kekurangan dan kesalahan yang pernah aku lakukan. Khususnya disaat kamu sedang butuh aku, tapi aku tidak bisa secara maksimal ada untukmu.',
      'Happy anniversary yang ke-2, ya sayangkuuu. Aku menyayangimu lebih dari bentangan jarak mana pun di dunia ini. Semoga takdir kita dapat mempertemukan kita lebih cepat. ❤️✈️',
    ],
    closingMessage: 'Dari pasanganmu yang selalu merindukanmu dari kejauhan,',
    senderName: 'Sayangmu yang selalu sibuk ✨',
    proposalQuestion: 'Maukah kamu terus berjuang dan menjaga hati ini bersamaku sampai jarak ini selamanya kalah?',
    yesButtonText: 'Iya, Kita Pasti Selalu Bersama! 💖✈️',
    giftCard: {
      enabled: true,
      badge: 'Spesial Jajan Sayang 💳🍰',
      quizQuestion: 'Apa sebutan yang kamu bilang kalau kamu lagi pakai pashmina?',
      quizAnswerHashes: [
        '0327bd1b5fa2aaa8b465ea3edaf480c709516d5151640c6736d15c58a266305d',
      ],
      quizHint: 'Clue: Looks yang kamu dapet pas pakai pashmina, bulat seperti... hehe 😉🔥',
      cardTitle: 'Kartu Jajan Spesial Anniversary',
      amountOrReward: 'Saldo Jajan Rp 200.000',
      validThru: '6 Bulan',
      encryptedVoucherMap: {
        '0327bd1b5fa2aaa8b465ea3edaf480c709516d5151640c6736d15c58a266305d': 'bbb0241acb791aab4a5fd55f:4bdd30c607447cecd28fdafeb9f78acd32b540a51577523625dbfc78994b31ff',
      },
      note: 'Voucher ini bisa kamu pakai belanja apa aja di Shopee. Untuk masa berlakunya hanya 6 bulan yaa sayang jadi jangan lupa dipakai! Love youu sayangkuu! ❤️',
      whatsappNumber: '6281346862104',
      redeemGuideUrl: 'https://help.shopee.co.id/portal/4/article/73779-[Shopee-Gift-Card]-Bagaimana-cara-membeli-dan-menukarkan-Shopee-Gift-Card',
    },
  },
};
