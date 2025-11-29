import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faGhost, faSadTear } from '@fortawesome/free-solid-svg-icons';

const funnyMessages = [
  "Sepertinya kamu tersesat di dunia isekai yang salah...",
  "Halaman ini sudah di-ban oleh Truck-kun 🚚",
  "Error 404: Waifu tidak ditemukan",
  "Halaman ini pergi mencari One Piece...",
  "Gomen ne~ Halaman ini sedang hiatus seperti Hunter x Hunter",
  "Halaman ini masuk ke dalam Kamui dimension",
  "Plot armor tidak bisa menyelamatkan halaman ini",
  "Halaman ini kena Infinity Tsukuyomi",
  "This page used EXPLOSION! It's super effective... on itself",
  "Halaman ini sudah tamat, tidak ada season 2",
];

const animeQuotes = [
  { quote: "Believe it!", anime: "Naruto" },
  { quote: "I'll take a potato chip... and EAT IT!", anime: "Death Note" },
  { quote: "PLUS ULTRA!", anime: "My Hero Academia" },
  { quote: "Omae wa mou shindeiru", anime: "Fist of the North Star" },
  { quote: "It's over 9000!", anime: "Dragon Ball Z" },
];

export default function NotFoundPage() {
  const [message] = useState(() => funnyMessages[Math.floor(Math.random() * funnyMessages.length)]);
  const [quote] = useState(() => animeQuotes[Math.floor(Math.random() * animeQuotes.length)]);
  const [glitchText, setGlitchText] = useState('404');

  useEffect(() => {
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let interval: NodeJS.Timeout;
    
    const startGlitch = () => {
      let iterations = 0;
      interval = setInterval(() => {
        setGlitchText(
          '404'.split('').map((char, index) => {
            if (index < iterations) return '404'[index];
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }).join('')
        );
        iterations += 1/3;
        if (iterations >= 4) {
          clearInterval(interval);
          setGlitchText('404');
        }
      }, 50);
    };

    startGlitch();
    const repeatInterval = setInterval(startGlitch, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(repeatInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/30 dark:bg-purple-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Glitch 404 Text */}
        <div className="relative mb-8">
          <h1 
            className="text-[120px] sm:text-[180px] font-black leading-none bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent select-none"
            style={{ 
              textShadow: '0 0 80px rgba(168, 85, 247, 0.4)',
              fontFamily: 'monospace'
            }}
          >
            {glitchText}
          </h1>
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <span className="text-[120px] sm:text-[180px] font-black text-purple-500 blur-sm" style={{ fontFamily: 'monospace' }}>404</span>
          </div>
        </div>

        {/* Ghost Icon */}
        <div className="mb-6 relative inline-block">
          <FontAwesomeIcon 
            icon={faGhost} 
            className="text-6xl text-purple-500 dark:text-purple-400 animate-bounce"
          />
          <FontAwesomeIcon 
            icon={faSadTear} 
            className="absolute -top-2 -right-4 text-2xl text-pink-500"
          />
        </div>

        {/* Main Message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Halaman Tidak Ditemukan
        </h2>

        {/* Funny Message */}
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 px-4">
          {message}
        </p>

        {/* Anime Quote */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 mb-8 border border-gray-200 dark:border-gray-700 inline-block">
          <p className="text-gray-700 dark:text-gray-300 italic">"{quote.quote}"</p>
          <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">— {quote.anime}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/25"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100"></span>
            <FontAwesomeIcon icon={faHome} className="relative z-10" />
            <span className="relative z-10">Kembali ke Home</span>
          </Link>
          
          <Link
            to="/search"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 shadow-md"
          >
            <FontAwesomeIcon icon={faSearch} className="group-hover:text-purple-500" />
            <span>Cari Anime</span>
          </Link>
        </div>

        {/* Fun Stats */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-gray-800">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">∞</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Anime Universe</p>
          </div>
          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-gray-800">
            <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">404</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Errors Found</p>
          </div>
          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-gray-800">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">100%</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Still Lost</p>
          </div>
        </div>
      </div>

      {/* CSS for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
