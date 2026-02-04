
import { Genre } from './types';

export const RAKUTEN_GENRES: Genre[] = [
  { id: '0', name: '総合', icon: 'fa-trophy' },
  { id: '100371', name: 'レディース', icon: 'fa-shirt' },
  { id: '551177', name: 'メンズ', icon: 'fa-user-tie' },
  { id: '100227', name: '食品', icon: 'fa-utensils' },
  { id: '562637', name: '家電', icon: 'fa-plug' },
  { id: '215783', name: 'コスメ', icon: 'fa-sparkles' },
  { id: '101205', name: '日用品', icon: 'fa-box' }
];

export const RAKUTEN_API_BASE_URL = 'https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20220601';
