
import { RakutenItem } from '../types';
import { RAKUTEN_API_BASE_URL } from '../constants';

// ユーザーから提供された認証情報
const APP_ID = '1069849120479290339';
const AFFILIATE_ID = '1cd2c935.7bc813b2.1cd2c936.7c0882f2';

export const isRakutenConfigured = !!APP_ID;

/**
 * デモ用のダミーデータを生成
 * (APP_ID自体が未設定の場合のみのバックアップとして残しますが、通常のエラー時は使用しません)
 */
const getMockData = (genreId: string): RakutenItem[] => {
  const genres: Record<string, string> = {
    '0': '総合',
    '100371': 'レディース',
    '100227': '食品',
    '562637': '家電'
  };
  const genreName = genres[genreId] || '注目';

  return Array.from({ length: 15 }).map((_, i) => ({
    rank: i + 1,
    itemName: `【デモ】${genreName}の人気商品ランキング第${i + 1}位のおすすめアイテム`,
    itemPrice: Math.floor(Math.random() * 10000) + 1000,
    itemUrl: '#',
    affiliateUrl: 'https://room.rakuten.co.jp/',
    mediumImageUrls: [{ imageUrl: `https://picsum.photos/seed/${genreId}${i}/300/300` }],
    shopName: `${genreName}セレクトショップ 楽天市場店`
  }));
};

export const fetchRankings = async (genreId: string): Promise<RakutenItem[]> => {
  if (!APP_ID) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getMockData(genreId)), 800);
    });
  }

  try {
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
      throw new Error(errorData.error_description || `APIエラー: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.Items || !Array.isArray(data.Items)) {
      return [];
    }

    return data.Items.map((item: any) => ({
      rank: item.Item.rank,
      itemName: item.Item.itemName,
      itemPrice: item.Item.itemPrice,
      itemUrl: item.Item.itemUrl,
      affiliateUrl: item.Item.affiliateUrl || item.Item.itemUrl,
      mediumImageUrls: item.Item.mediumImageUrls,
      shopName: item.Item.shopName
    }));
  } catch (error) {
    console.error('Fetch error:', error);
    // 取得失敗時は、不正確なデモデータを出さずにエラーを上位に投げる
    throw error;
  }
};
