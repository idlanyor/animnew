'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faDatabase, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Author {
  name: string;
  role: string;
  github: string;
  description: string;
  avatar: string;
  skills: string[];
  website: string;
}

export default function AuthorPage() {
  const [loading, setLoading] = useState(true);

  // Simulasi loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const authors: Author[] = [
    {
      name: 'Roynaldi',
      role: 'Owner & Author Utama',
      github: 'https://github.com/idlanyor',
      description: 'Developer utama KanataAnimeV2. Bertanggung jawab untuk pengembangan frontend dan UI/UX aplikasi.',
      avatar: 'https://github.com/idlanyor.png',
      website: 'https://puki.bukankah-ini.my.id',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Bun', 'Elysia', 'etc']
    },
    {
      name: 'Fatih Firdaus',
      role: 'Penyedia API/Backend',
      github: 'https://github.com/ShirokamiRyzen',
      description: 'Developer backend dan penyedia API Ryzumi untuk KanataAnimeV2. Bertanggung jawab untuk infrastruktur dan data anime.',
      avatar: 'https://github.com/ShirokamiRyzen.png',
      website: 'https://ryzumi.vip/',
      skills: ['Node.js', 'Express', 'REST API', 'Firebase', 'etc']
    },
    {
      name: 'Sandika',
      role: 'Penyedia API/Backend',
      github: 'https://github.com/SankaVollereii',
      description: 'Penyedia API Sankanime untuk KanataAnimeV2',
      avatar: 'https://github.com/SankaVollereii.png',
      website: 'https://sankavollerei.com/',
      skills: ['Node.js', 'Express', 'Scraping', 'etc']
    },
    {
      name: 'Antidonasi Team',
      role: 'Penonton setia & Supporter',
      github: 'https://github.com/ShirokamiRyzen',
      description: 'Pendukung setia Project KanataAnimeV2',
      avatar: 'https://github.com/AntiDonasi.png',
      website: 'https://antidonasi.web.id/',
      skills: ['Rebahan', 'Tidur', 'Makan', 'Minum', 'Nonton Anime', 'Ngoding', 'etc']
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner size="lg" text="Loading author information..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Meet Our Team</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {authors.map((author) => (
          <div key={author.name} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-blue-900/20 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="relative w-20 h-20 mr-4">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="rounded-full border-2 border-blue-500 object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{author.name}</h2>
                  <p className="text-blue-400 flex items-center gap-2">
                    {author.role === 'Author Utama' ? (
                      <>
                        <FontAwesomeIcon icon={faCode} className="h-4 w-4" />
                        {author.role}
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faDatabase} className="h-4 w-4" />
                        {author.role}
                      </>
                    )}
                  </p>
                </div>
              </div>

              <p className="text-gray-300 mb-6">{author.description}</p>

              <div className="mb-6">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCode} className="h-4 w-4" />
                  Skills:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {author.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-gray-800 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {skill.toLowerCase().includes('database') ? <FontAwesomeIcon icon={faDatabase} className="h-3 w-3" /> : <FontAwesomeIcon icon={faCode} className="h-3 w-3" />}
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <a
                  href={author.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faGithub} className="h-5 w-5" />
                  GitHub Profile
                </a>
                <a
                  href={author.website}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faGlobe} className="h-5 w-5" />
                  Website
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center text-gray-400">
        <p className="flex items-center justify-center gap-2">
          KanataAnimeV2 adalah platform streaming anime yang dikembangkan dengan ❤️ oleh Roy Antidonasi dkk.
        </p>
        <p className="mt-2 flex items-center justify-center gap-2">
          Powered by Ryzumi API & Sankanime
        </p>
      </div>
    </div>
  );
}