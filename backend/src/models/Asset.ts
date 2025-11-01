import { UserSummary } from './User';

export type AssetStatus = '사용' | '점검' | '폐기' | '분실';

export interface AssetMetadata {
  os?: string;
  memo?: string;
  memo2?: string;
  [key: string]: unknown;
}

export interface AssetLocation {
  text?: string | null;
  building?: string | null;
  floor?: string | null;
  row?: number | null;
  col?: number | null;
}

export interface Asset {
  uid: string;
  name?: string | null;
  assetType?: string | null;
  modelName?: string | null;
  serialNumber?: string | null;
  vendor?: string | null;
  status: AssetStatus;
  location: AssetLocation;
  owner?: UserSummary | null;
  metadata?: AssetMetadata | null;
  createdAt: string;
  updatedAt: string;
}

export interface AssetFilters {
  q?: string;
  status?: string;
  team?: string;
  page?: number;
  pageSize?: number;
}
