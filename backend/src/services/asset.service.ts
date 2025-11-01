import { assetRepository } from '@/repositories/asset.repository';
import { Asset, AssetFilters } from '@/models/Asset';
import { PaginatedResponse } from '@/types/api.types';
import { AuthenticatedUser } from '@/types/api.types';

const PUBLIC_METADATA_KEYS = ['os'];

const sanitizeAsset = (asset: Asset): Asset => {
  if (!asset.metadata) {
    return { ...asset, owner: undefined };
  }

  const metadata: Record<string, unknown> = {};

  for (const key of PUBLIC_METADATA_KEYS) {
    if (asset.metadata[key] !== undefined) {
      metadata[key] = asset.metadata[key];
    }
  }

  return {
    ...asset,
    owner: undefined,
    metadata: Object.keys(metadata).length > 0 ? (metadata as Asset['metadata']) : undefined,
  };
};

export class AssetService {
  async listAssets(
    filters: AssetFilters,
    user?: AuthenticatedUser | null
  ): Promise<PaginatedResponse<Asset>> {
    const result = await assetRepository.findAll(filters);
    const items = user ? result.items : result.items.map(sanitizeAsset);

    return {
      data: items,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }

  async getAsset(uid: string, user?: AuthenticatedUser | null): Promise<Asset | null> {
    const asset = await assetRepository.findByUid(uid);

    if (!asset) {
      return null;
    }

    if (!user) {
      return sanitizeAsset(asset);
    }

    return asset;
  }

  async upsertAsset(asset: Asset): Promise<void> {
    const normalized: Asset = {
      ...asset,
      location: {
        text: asset.location?.text ?? null,
        building: asset.location?.building ?? null,
        floor: asset.location?.floor ?? null,
        row: asset.location?.row ?? null,
        col: asset.location?.col ?? null,
      },
    };

    await assetRepository.upsert(normalized, normalized.owner ?? null);
  }

  async deleteAsset(uid: string): Promise<void> {
    await assetRepository.delete(uid);
  }

  async getReferences(term?: string): Promise<Array<Pick<Asset, 'uid' | 'name' | 'assetType'>>> {
    return assetRepository.searchReferences(term);
  }
}

export const assetService = new AssetService();
