import { assets } from '@/data/mock-data';
import type { Asset } from '@/types/domain';

interface AssetQuery {
  q?: string;
  status?: string;
  team?: string;
  page?: number;
  pageSize?: number;
  updatedSince?: string;
}

class AssetRepository {
  list(query: AssetQuery) {
    const { q, status, team, page = 0, pageSize = 20 } = query;
    let filtered = assets;

    if (q) {
      const keyword = q.toLowerCase();
      filtered = filtered.filter((asset) =>
        [asset.uid, asset.name, asset.modelName, asset.serialNumber]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(keyword))
      );
    }

    if (status) {
      filtered = filtered.filter((asset) => asset.status === status);
    }

    if (team) {
      filtered = filtered.filter((asset) => asset.organization === team);
    }

    const total = filtered.length;
    const start = page * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return { items, page, pageSize, total };
  }

  findByUid(uid: string): Asset | undefined {
    return assets.find((asset) => asset.uid === uid);
  }

  upsert(asset: Asset): Asset {
    const index = assets.findIndex((candidate) => candidate.uid === asset.uid);
    if (index >= 0) {
      assets[index] = { ...assets[index], ...asset, updatedAt: new Date().toISOString() };
      return assets[index];
    }

    const created: Asset = { ...asset, updatedAt: new Date().toISOString() };
    assets.push(created);
    return created;
  }
}

export const assetRepository = new AssetRepository();
