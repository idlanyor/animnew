# KanataAnimeV2 - Aplikasi Web Streaming Anime

Aplikasi web streaming anime yang dibangun menggunakan Next.js dengan backend API dari Ryzumi.

## 🚀 Fitur Utama

- **Homepage** dengan anime ongoing dan populer
- **Halaman Ongoing** untuk anime yang sedang tayang
- **Halaman Complete** untuk anime yang sudah selesai
- **Pencarian Anime** dengan filter berdasarkan status
- **Detail Anime** dengan informasi lengkap dan daftar episode
- **Streaming Episode** dengan multiple quality dan server
- **Responsive Design** yang mobile-friendly
- **Dark Theme** dengan UI modern

## 🛠️ Teknologi yang Digunakan

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Radix UI** - UI components

## 📁 Struktur Project

```
anime-streaming/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── anime/[slug]/       # Detail anime
│   │   ├── episode/[slug]/     # Streaming episode
│   │   ├── ongoing/            # Anime ongoing
│   │   ├── complete/           # Anime complete
│   │   ├── search/             # Pencarian
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Homepage
│   ├── components/             # Reusable components
│   │   ├── AnimeCard.tsx       # Card anime
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Footer.tsx          # Footer
│   │   └── LoadingSpinner.tsx  # Loading indicator
│   └── lib/
│       └── api.ts              # API client & types
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
└── package.json                # Dependencies
```

## 🔧 Instalasi dan Setup

1. **Clone atau extract project**
   ```bash
   cd anime-streaming
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Jalankan development server**
   ```bash
   npm run dev
   ```

4. **Build untuk production**
   ```bash
   npm run build
   npm start
   ```

## 🌐 API Integration

Aplikasi ini mengintegrasikan dengan Ryzumi API dengan endpoint berikut:

- `GET /genre` - Daftar genre anime
- `GET /jadwal` - Jadwal anime harian
- `GET /anime` - Daftar anime (dengan filter)
- `GET /anime/{slug}` - Detail anime
- `GET /episode/{slug}` - Data episode
- `GET /mirror/episode/{slug}` - Mirror episode
- `GET /nonce` - Token nonce
- `GET /getIframe` - URL iframe streaming

### Fallback System

Aplikasi dilengkapi dengan sistem fallback yang menggunakan mock data ketika API tidak tersedia, memastikan aplikasi tetap berfungsi untuk demo dan testing.

## 📱 Halaman dan Fitur

### 1. Homepage (/)
- Hero section dengan CTA buttons
- Section anime ongoing terbaru
- Section anime populer
- Features showcase

### 2. Ongoing (/ongoing)
- Grid anime yang sedang tayang
- Pagination dengan load more
- Statistics section

### 3. Complete (/complete)
- Grid anime yang sudah selesai
- Pagination dengan load more
- Statistics section

### 4. Search (/search)
- Form pencarian dengan filter
- Filter berdasarkan status (all/ongoing/complete)
- Grid hasil pencarian
- Empty state dan error handling

### 5. Detail Anime (/anime/[slug])
- Hero section dengan poster dan info
- Informasi lengkap anime
- Daftar episode
- Download links (batch/complete)
- Sidebar dengan poster dan quick stats

### 6. Episode Streaming (/episode/[slug])
- Video player dengan multiple quality
- Server selector
- Download links per quality
- Quality information
- Responsive video player

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Secondary**: Purple (#8B5CF6)
- **Accent**: Pink (#EC4899)
- **Background**: Black (#000000)
- **Surface**: Gray-900 (#111827)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold weights
- **Body**: Regular weights

### Components
- **Cards**: Rounded corners dengan hover effects
- **Buttons**: Multiple variants dengan transitions
- **Forms**: Dark theme dengan focus states
- **Navigation**: Sticky header dengan mobile menu

## 📊 Performance

- **Static Generation** untuk halaman yang bisa di-cache
- **Dynamic Rendering** untuk halaman dengan parameter
- **Image Optimization** dengan Next.js Image component
- **Code Splitting** otomatis dengan Next.js
- **Responsive Images** dengan multiple breakpoints

## 🔒 Error Handling

- **API Error Handling** dengan retry mechanism
- **Loading States** untuk semua async operations
- **Empty States** untuk data kosong
- **404 Pages** untuk halaman tidak ditemukan
- **Fallback Data** ketika API tidak tersedia

## 🚀 Deployment

Aplikasi siap untuk di-deploy ke platform seperti:
- **Vercel** (recommended untuk Next.js)
- **Netlify**
- **Railway**
- **Heroku**

### Environment Variables
Tidak ada environment variables yang diperlukan karena API endpoint sudah hardcoded.

## 📝 Development Notes

### Mock Data
Aplikasi menggunakan mock data sebagai fallback ketika API tidak tersedia. Mock data mencakup:
- 6 anime sample dengan poster placeholder
- Episode data dengan multiple quality
- Genre dan schedule data

### API Client
File `src/lib/api.ts` berisi:
- Axios configuration dengan timeout dan interceptors
- TypeScript interfaces untuk semua data types
- Error handling dengan user-friendly messages
- Fallback ke mock data

### Responsive Design
- **Mobile First** approach
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid System**: Responsive grid dengan Tailwind CSS
- **Touch Friendly**: Buttons dan links yang mudah di-tap

## 🐛 Known Issues

1. **CORS**: API mungkin memerlukan CORS configuration
2. **Rate Limiting**: API mungkin memiliki rate limiting
3. **Image Loading**: Beberapa gambar mungkin lambat loading

## 🔮 Future Enhancements

- **User Authentication** untuk favorites dan watchlist
- **Comments System** untuk episode
- **Rating System** untuk anime
- **Recommendation Engine** berdasarkan viewing history
- **Offline Support** dengan service workers
- **Push Notifications** untuk episode baru
- **Social Features** untuk sharing dan diskusi

## 📄 License

Project ini dibuat untuk tujuan edukasi dan demo. Pastikan untuk mematuhi terms of service dari API provider.

## 🤝 Contributing

Untuk berkontribusi:
1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Create Pull Request

## 📞 Support

Jika ada pertanyaan atau issue, silakan buat issue di repository atau hubungi developer.

---

**KanataAnimeV2** - Enjoy watching anime with high quality streaming! 🎌

