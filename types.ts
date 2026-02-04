
export interface RakutenItem {
  rank: number;
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  affiliateUrl: string;
  mediumImageUrls: { imageUrl: string }[];
  shopName: string;
}

export interface Genre {
  id: string;
  name: string;
  icon: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
