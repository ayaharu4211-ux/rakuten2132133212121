
import React, { useState, useEffect, useCallback } from 'react';
import { fetchRankings, isRakutenConfigured } from './services/rakutenService';
import { RakutenItem, AppStatus } from './types';
import { RAKUTEN_GENRES } from './constants';
import ItemCard from './components/ItemCard';
import SkeletonCard from './components/SkeletonCard';

const App: React.FC = () => {
  const [items, setItems] = useState<RakutenItem[]>([]);
  const [activeGenreId, setActiveGenreId] = useState<string>(RAKUTEN_GENRES[0].id);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const isDemoMode = !isRakutenConfigured;

  const loadData = useCallback(async (genreId: string) => {
    setStatus(AppStatus.LOADING);
    setErrorMsg(null);
    try {
      const results = await fetchRankings(genreId);
      setItems(results);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'データの取得に失敗しました');
      setStatus(AppStatus.ERROR);
    }
  }, []);

  useEffect(() => {
    loadData(activeGenreId);
  }, [activeGenreId, loadData]);

  return (
    <div className="min-h-screen pb-10 flex flex-col max-w-2xl mx-auto bg-gray-50 shadow-xl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-200">
              <i className="fas fa-bolt-lightning text-sm"></i>
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900 leading-none">
                Rakuten Ranking
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">
                Real-time Insights
              </p>
            </div>
          </div>
          <button 
            onClick={() => loadData(activeGenreId)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all active:scale-95"
            aria-label="リロード"
          >
            <i className={`fas fa-arrows-rotate ${status === AppStatus.LOADING ? 'animate-spin text-red-600' : ''}`}></i>
          </button>
        </div>

        {/* Genre Horizontal Scroll */}
        <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1 -mx-2 px-2">
          {RAKUTEN_GENRES.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setActiveGenreId(genre.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                activeGenreId === genre.id
                ? 'bg-gray-900 text-white shadow-lg shadow-gray-200 scale-105'
                : 'bg-white text-gray-500 border border-gray-100 hover:border-gray-300'
              }`}
            >
              <i className={`fas ${genre.icon} ${activeGenreId === genre.id ? 'text-red-400' : 'text-gray-300'}`}></i>
              {genre.name}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-3 pt-4 flex-1">
        <div className="space-y-3">
          {status === AppStatus.LOADING ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))
          ) : (
            items.map((item, idx) => (
              <ItemCard key={`${item.rank}-${idx}`} item={item} />
            ))
          )}
        </div>

        {status === AppStatus.SUCCESS && items.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <i className="fas fa-magnifying-glass text-3xl"></i>
            </div>
            <p className="text-gray-400 font-bold">このジャンルの商品は見つかりませんでした。</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 mb-6 text-center px-4">
        <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.2em]">
          Data provided by Rakuten Web Service
        </p>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
