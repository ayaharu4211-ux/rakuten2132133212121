
import { RakutenItem, AppStatus } from '../types';
import { RAKUTEN_API_BASE_URL } from '../constants';

// For Vercel/Production, these would be in environment variables
const APP_ID = process.env.RAKUTEN_APP_ID || '';
const AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID || '';

export const fetchRankings = async (genreId: string): Promise<RakutenItem[]> => {
  if (!APP_ID) {
    throw new Error('Rakuten Application ID is not configured.');
  }

  const url = new URL(RAKUTEN_API_BASE_URL);
  url.searchParams.append('applicationId', APP_ID);
  if (AFFILIATE_ID) {
    url.searchParams.append('affiliateId', AFFILIATE_ID);
  }
  url.searchParams.append('genreId', genreId);
  url.searchParams.append('period', 'realtime');
  url.searchParams.append('hits', '30');
  url.searchParams.append('format', 'json');

  const response = await fetch(url.toString());
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error_description || 'Failed to fetch rankings');
  }

  const data = await response.json();
  
  // Transform API response structure to our clean interface
  return data.Items.map((item: any) => ({
    rank: item.Item.rank,
    itemName: item.Item.itemName,
    itemPrice: item.Item.itemPrice,
    itemUrl: item.Item.itemUrl,
    affiliateUrl: item.Item.affiliateUrl || item.Item.itemUrl,
    mediumImageUrls: item.Item.mediumImageUrls,
    shopName: item.Item.shopName
  }));
};
