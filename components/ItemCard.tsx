
import React, { useState } from 'react';
import { RakutenItem } from '../types';

interface ItemCardProps {
  item: RakutenItem;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.affiliateUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 mb-3">
      <div className="flex p-4 gap-4 relative">
        {/* Rank Badge */}
        <div className={`absolute top-0 left-0 px-2 py-1 text-xs font-bold text-white rounded-br-lg ${
          item.rank <= 3 ? 'bg-red-600' : 'bg-gray-400'
        }`}>
          {item.rank}位
        </div>

        {/* Image Container */}
        <div className="w-28 h-28 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
          <img 
            src={item.mediumImageUrls[0]?.imageUrl} 
            alt={item.itemName}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-relaxed mb-1">
              {item.itemName}
            </h3>
            <p className="text-xs text-gray-500 truncate mb-1">
              {item.shopName}
            </p>
          </div>

          <div className="flex items-end justify-between mt-auto">
            <div>
              <span className="text-lg font-bold text-red-600">
                ¥{item.itemPrice.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400 ml-1">税込</span>
            </div>
            
            <button 
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                copied 
                ? 'bg-green-100 text-green-600 ring-1 ring-green-600' 
                : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
            >
              <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
              {copied ? 'コピー済' : 'ROOM投稿URL'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;

