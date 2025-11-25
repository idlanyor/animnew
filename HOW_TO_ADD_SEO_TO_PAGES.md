# 📘 Cara Menambahkan SEO ke Halaman Anime & Movie

## 🎯 Quick Guide: Implementasi SEO Helper

Gunakan utility functions di `src/lib/seo.ts` untuk menambahkan SEO optimal ke setiap halaman anime dan movie.

---

## 1️⃣ Untuk Halaman Anime Detail

### File: `src/app/anime/[slug]/page.tsx`

**SEBELUM** (Client Component tanpa metadata):
```typescript
'use client';

export default function AnimeDetailPage() {
  // ... component code
}
```

**SESUDAH** (Dengan Server Component untuk metadata):

Buat file baru: `src/app/anime/[slug]/layout.tsx`

```typescript
import type { Metadata } from 'next';
import { generateAnimeMetadata, generateAnimeStructuredData } from '@/lib/seo';
import { getAnimeDetailBySanka } from '@/lib/api';

// Generate dynamic metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const anime = await getAnimeDetailBySanka(params.slug);

    return generateAnimeMetadata({
      title: anime.judul,
      synopsis: anime.synopsis,
      image: anime.gambar,
      slug: params.slug,
      type: anime.tipe,
      status: anime.status,
      score: anime.skor,
      genres: anime.genre?.split(','),
      releaseYear: anime.rilis,
    });
  } catch (error) {
    // Fallback metadata jika gagal fetch
    return {
      title: 'Nonton Anime Sub Indo - KanataAnime',
      description: 'Streaming anime subtitle Indonesia dengan kualitas HD',
    };
  }
}

export default function AnimeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

**Tambahkan Structured Data** di `page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { generateAnimeStructuredData } from '@/lib/seo';

export default function AnimeDetailPage() {
  const [anime, setAnime] = useState(null);

  // ... existing code

  return (
    <>
      {anime && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateAnimeStructuredData({
                title: anime.judul,
                synopsis: anime.synopsis,
                image: anime.gambar,
                slug: anime.slug,
                type: anime.tipe,
                status: anime.status,
                score: anime.skor,
                genres: anime.genre?.split(','),
                releaseYear: anime.rilis,
              })
            ),
          }}
        />
      )}
      {/* Rest of component */}
    </>
  );
}
```

---

## 2️⃣ Untuk Halaman Movie Detail

### File: `src/app/movie/[slug]/page.tsx`

Buat file: `src/app/movie/[slug]/layout.tsx`

```typescript
import type { Metadata } from 'next';
import { generateMovieMetadata } from '@/lib/seo';
import { getMovieDetail } from '@/lib/api'; // Sesuaikan dengan API function Anda

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const movie = await getMovieDetail(params.slug);

    return generateMovieMetadata({
      title: movie.judul,
      synopsis: movie.synopsis,
      image: movie.gambar,
      slug: params.slug,
      releaseYear: movie.rilis,
      score: movie.skor,
      genres: movie.genre?.split(','),
    });
  } catch (error) {
    return {
      title: 'Nonton Anime Movie Sub Indo - KanataAnime',
      description: 'Streaming anime movie subtitle Indonesia dengan kualitas HD',
    };
  }
}

export default function MovieLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

---

## 3️⃣ Breadcrumb Implementation

Tambahkan breadcrumb untuk SEO internal linking:

```typescript
import { generateBreadcrumbStructuredData } from '@/lib/seo';

// Dalam component
const breadcrumbData = generateBreadcrumbStructuredData([
  { name: 'Home', url: 'https://anime.antidonasi.web.id' },
  { name: 'Anime', url: 'https://anime.antidonasi.web.id/ongoing' },
  { name: anime.judul, url: `https://anime.antidonasi.web.id/anime/${anime.slug}` },
]);

return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
    />

    {/* Visual breadcrumb */}
    <nav className="breadcrumb">
      <Link href="/">Home</Link> /
      <Link href="/ongoing">Anime</Link> /
      <span>{anime.judul}</span>
    </nav>
  </>
);
```

---

## 4️⃣ Optimasi Halaman Lainnya

### Ongoing Page (`src/app/ongoing/page.tsx`)

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Anime Ongoing Terbaru Sub Indo - KanataAnime',
  description: 'Nonton anime ongoing terbaru subtitle Indonesia. Update episode baru setiap hari dengan kualitas HD 720p tanpa iklan.',
  keywords: 'anime ongoing, anime ongoing sub indo, anime ongoing terbaru, nonton anime ongoing, streaming anime ongoing',
  openGraph: {
    title: 'Anime Ongoing Terbaru Sub Indo - KanataAnime',
    description: 'Nonton anime ongoing terbaru subtitle Indonesia dengan kualitas HD',
    url: 'https://anime.antidonasi.web.id/ongoing',
  },
};
```

### Complete Page

```typescript
export const metadata: Metadata = {
  title: 'Anime Complete Sub Indo Terlengkap - KanataAnime',
  description: 'Koleksi anime complete subtitle Indonesia terlengkap. Download anime batch atau streaming langsung dengan kualitas HD tanpa iklan.',
  keywords: 'anime complete, anime complete sub indo, anime tamat, download anime batch, nonton anime complete',
  openGraph: {
    title: 'Anime Complete Sub Indo - KanataAnime',
    description: 'Koleksi anime complete subtitle Indonesia terlengkap',
    url: 'https://anime.antidonasi.web.id/complete',
  },
};
```

### Movie Page

```typescript
export const metadata: Metadata = {
  title: 'Anime Movie Sub Indo Terbaru - KanataAnime',
  description: 'Nonton anime movie subtitle Indonesia terbaru. Streaming anime movie dengan kualitas HD 720p/1080p tanpa iklan.',
  keywords: 'anime movie, anime movie sub indo, nonton anime movie, streaming anime movie, download anime movie',
  openGraph: {
    title: 'Anime Movie Sub Indo - KanataAnime',
    description: 'Nonton anime movie subtitle Indonesia dengan kualitas HD',
    url: 'https://anime.antidonasi.web.id/movie',
  },
};
```

---

## 5️⃣ Tips SEO Tambahan

### A. Alt Text untuk Images
```typescript
<Image
  src={anime.gambar}
  alt={`Nonton ${anime.judul} Sub Indo - KanataAnime`}
  fill
  className="object-cover"
/>
```

### B. Semantic HTML
```typescript
// Gunakan heading hierarchy yang benar
<h1>Nonton {anime.judul} Sub Indo</h1>
<h2>Sinopsis</h2>
<h3>Informasi Anime</h3>
<h3>Episode List</h3>
```

### C. Internal Linking
```typescript
// Link ke halaman related
<Link href={`/anime/${related.slug}`}>
  Nonton {related.title} Sub Indo
</Link>

// Link dengan keyword
<Link href="/ongoing">
  Lihat semua anime ongoing sub indo terbaru
</Link>
```

---

## 6️⃣ Testing SEO Implementation

### Tools untuk Test:

1. **Google Rich Results Test**
   ```
   https://search.google.com/test/rich-results
   ```
   - Test structured data
   - Pastikan 0 errors

2. **Meta Tags Checker**
   ```
   https://metatags.io/
   ```
   - Preview OG tags
   - Check Twitter cards

3. **Schema Validator**
   ```
   https://validator.schema.org/
   ```
   - Validate JSON-LD
   - Check TVSeries/Movie schema

4. **PageSpeed Insights**
   ```
   https://pagespeed.web.dev/
   ```
   - Test performance
   - Check Core Web Vitals

---

## ✅ Checklist Implementasi

Untuk setiap halaman baru, pastikan:

- [ ] Metadata title mengandung keyword Indonesia
- [ ] Description natural dan mengandung keyword
- [ ] Open Graph tags lengkap
- [ ] Structured data (JSON-LD) ditambahkan
- [ ] Alt text untuk semua images
- [ ] Semantic HTML (h1, h2, h3)
- [ ] Internal linking ke related pages
- [ ] Canonical URL set
- [ ] Mobile-friendly
- [ ] Loading speed optimal

---

## 🚀 Deploy Checklist

Sebelum deploy ke production:

1. **Build Test**
   ```bash
   npm run build
   ```
   - Pastikan no errors
   - Check build output

2. **Metadata Test**
   - Test metadata di development
   - Check source code (view page source)
   - Validate structured data

3. **Performance Test**
   - Test loading speed
   - Check image optimization
   - Verify caching

4. **Post-Deploy**
   - Submit sitemap ke Google Search Console
   - Test dengan Google Rich Results
   - Monitor indexing status

---

**Happy Optimizing! 🎯**

Dengan implementasi SEO yang benar, website akan ranking lebih tinggi untuk keyword:
- nonton anime
- streaming anime
- anime sub indo
- kanatanime
- anime tanpa iklan

Target: **Page 1 Google dalam 3-6 bulan!** 🚀
