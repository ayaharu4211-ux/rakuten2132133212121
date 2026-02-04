
import React, { useState, useEffect, useCallback } from 'react';
import { fetchRankings } from './services/rakutenService';
import { RakutenItem, AppStatus, Genre } from './types';
import { RAKUTEN_GENRES } from './constants';
import ItemCard from './components/ItemCard';
import SkeletonCard from './components/SkeletonCard';

const App: React.FC = () => {
  const [items, setItems] = useState<RakutenItem[]>([]);
  const [activeGenreId, setActiveGenreId] = useState<string>(RAKUTEN_GENRES[0].id);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGenreId]);

  return (
    <div className="min-h-screen pb-10 flex flex-col max-w-2xl mx-auto bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white">
              <i className="fas fa-chart-line"></i>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Rakuten Ranking
            </h1>
          </div>
          <button 
            onClick={() => loadData(activeGenreId)}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
            title="更新"
          >
            <i className={`fas fa-rotate ${status === AppStatus.LOADING ? 'animate-spin' : ''}`}></i>
          </button>
        </div>

        {/* Genre Horizontal Scroll */}
        <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1 -mx-2 px-2">
          {RAKUTEN_GENRES.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setActiveGenreId(genre.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeGenreId === genre.id
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300'
              }`}
            >
              <i className={`fas ${genre.icon} text-xs ${activeGenreId === genre.id ? 'text-white' : 'text-gray-400'}`}></i>
              {genre.name}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pt-4 flex-1">
        {status === AppStatus.ERROR && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <i className="fas fa-circle-exclamation text-red-400 text-3xl mb-3"></i>
            <h2 className="text-red-800 font-bold mb-1">エラーが発生しました</h2>
            <p className="text-red-600 text-sm mb-4">{errorMsg}</p>
            <button 
              onClick={() => loadData(activeGenreId)}
              className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-red-700 shadow-sm"
            >
              再読み込み
            </button>
            <p className="mt-4 text-xs text-gray-500">
              ※APIキーが正しく設定されていない可能性があります。
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-1">
          {status === AppStatus.LOADING ? (
            Array.from({ length: 10 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))
          ) : (
            items.map((item) => (
              <ItemCard key={`${item.rank}-${item.itemUrl}`} item={item} />
            ))
          )}
        </div>

        {status === AppStatus.SUCCESS && items.length === 0 && (
          <div className="py-20 text-center text-gray-400">
            <i className="fas fa-box-open text-4xl mb-4"></i>
            <p>商品が見つかりませんでした。</p>
          </div>
        )}
      </main>

      {/* Footer / Branding */}
      <footer className="mt-8 text-center px-4">
        <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-widest">
          Powered by Rakuten Web Service
        </p>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default App;
