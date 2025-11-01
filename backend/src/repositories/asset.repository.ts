import { RowDataPacket } from 'mysql2/promise';

import { getPool } from '@/config/database';
import { Asset, AssetFilters, AssetMetadata } from '@/models/Asset';
import { UserSummary } from '@/models/User';

interface AssetRow extends RowDataPacket {
  uid: string;
  name: string | null;
  asset_type: string | null;
  model_name: string | null;
  serial_number: string | null;
  vendor: string | null;
  status: string;
  location_text: string | null;
  building: string | null;
  floor: string | null;
  location_row: number | null;
  location_col: number | null;
  owner_user_id: number | null;
  owner_name: string | null;
  owner_email: string | null;
  metadata: string | null;
  created_at: string;
  updated_at: string;
}

const mapAsset = (row: AssetRow): Asset => ({
  uid: row.uid,
  name: row.name,
  assetType: row.asset_type,
  modelName: row.model_name,
  serialNumber: row.serial_number,
  vendor: row.vendor,
  status: row.status as Asset['status'],
  location: {
    text: row.location_text,
    building: row.building,
    floor: row.floor,
    row: row.location_row,
    col: row.location_col,
  },
  owner:
    row.owner_user_id && row.owner_name
      ? {
          id: row.owner_user_id,
          name: row.owner_name,
          email: row.owner_email ?? undefined,
        }
      : null,
  metadata: row.metadata ? (JSON.parse(row.metadata) as AssetMetadata) : null,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export interface AssetSearchResult {
  items: Asset[];
  total: number;
  page: number;
  pageSize: number;
}

export class AssetRepository {
  async findAll(filters: AssetFilters): Promise<AssetSearchResult> {
    const pool = getPool();
    const page = Math.max(filters.page ?? 0, 0);
    const pageSize = Math.min(Math.max(filters.pageSize ?? 20, 1), 100);
    const offset = page * pageSize;

    const conditions: string[] = [];
    const params: Record<string, unknown> = { limit: pageSize, offset };

    if (filters.q) {
      conditions.push(
        `(a.uid LIKE :q OR a.name LIKE :q OR a.model_name LIKE :q OR a.serial_number LIKE :q)`
      );
      params.q = `%${filters.q}%`;
    }

    if (filters.status) {
      conditions.push(`a.status = :status`);
      params.status = filters.status;
    }

    if (filters.team) {
      conditions.push(`u.department_team = :team`);
      params.team = filters.team;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.query<AssetRow[]>(
      `SELECT a.*, u.id as owner_user_id, u.name as owner_name, u.email as owner_email
       FROM assets a
       LEFT JOIN users u ON u.id = a.owner_user_id
       ${where}
       ORDER BY a.updated_at DESC
       LIMIT :limit OFFSET :offset` as string,
      params
    );

    const [countRows] = await pool.query<Array<{ count: number } & RowDataPacket>>(
      `SELECT COUNT(*) as count
       FROM assets a
       LEFT JOIN users u ON u.id = a.owner_user_id
       ${where}` as string,
      params
    );

    const total = countRows[0]?.count ?? 0;

    return {
      items: rows.map(mapAsset),
      total,
      page,
      pageSize,
    };
  }

  async findByUid(uid: string): Promise<Asset | null> {
    const [rows] = await getPool().query<AssetRow[]>(
      `SELECT a.*, u.id as owner_user_id, u.name as owner_name, u.email as owner_email
       FROM assets a
       LEFT JOIN users u ON u.id = a.owner_user_id
       WHERE a.uid = :uid
       LIMIT 1` as string,
      { uid }
    );

    return rows[0] ? mapAsset(rows[0]) : null;
  }

  async upsert(asset: Asset, owner?: UserSummary | null): Promise<void> {
    await getPool().query(
      `INSERT INTO assets (
        uid, name, asset_type, model_name, serial_number, vendor, status,
        location_text, building, floor, location_row, location_col,
        owner_user_id, metadata
      ) VALUES (
        :uid, :name, :assetType, :modelName, :serialNumber, :vendor, :status,
        :locationText, :building, :floor, :locationRow, :locationCol,
        :ownerId, :metadata
      )
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        asset_type = VALUES(asset_type),
        model_name = VALUES(model_name),
        serial_number = VALUES(serial_number),
        vendor = VALUES(vendor),
        status = VALUES(status),
        location_text = VALUES(location_text),
        building = VALUES(building),
        floor = VALUES(floor),
        location_row = VALUES(location_row),
        location_col = VALUES(location_col),
        owner_user_id = VALUES(owner_user_id),
        metadata = VALUES(metadata)`,
      {
        uid: asset.uid,
        name: asset.name ?? null,
        assetType: asset.assetType ?? null,
        modelName: asset.modelName ?? null,
        serialNumber: asset.serialNumber ?? null,
        vendor: asset.vendor ?? null,
        status: asset.status,
        locationText: asset.location.text ?? null,
        building: asset.location.building ?? null,
        floor: asset.location.floor ?? null,
        locationRow: asset.location.row ?? null,
        locationCol: asset.location.col ?? null,
        ownerId: owner?.id ?? null,
        metadata: asset.metadata ? JSON.stringify(asset.metadata) : null,
      }
    );
  }

  async delete(uid: string): Promise<void> {
    await getPool().query(`DELETE FROM assets WHERE uid = :uid`, { uid });
  }

  async searchReferences(term?: string): Promise<Array<Pick<Asset, 'uid' | 'name' | 'assetType'>>> {
    const params: Record<string, unknown> = {};
    let where = '';

    if (term) {
      params.term = `%${term}%`;
      where =
        'WHERE a.uid LIKE :term OR a.name LIKE :term OR a.model_name LIKE :term OR a.asset_type LIKE :term';
    }

    const [rows] = await getPool().query<AssetRow[]>(
      `SELECT a.uid, a.name, a.asset_type FROM assets a ${where} ORDER BY a.uid ASC LIMIT 20` as string,
      params
    );

    return rows.map(row => ({ uid: row.uid, name: row.name ?? undefined, assetType: row.asset_type ?? undefined }));
  }
}

export const assetRepository = new AssetRepository();
