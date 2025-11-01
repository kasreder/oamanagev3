import { RowDataPacket } from 'mysql2/promise';

import { getPool } from '@/config/database';
import { Inspection } from '@/models/Inspection';

interface InspectionRow extends RowDataPacket {
  id: string;
  asset_uid: string;
  status: string;
  memo: string | null;
  scanned_at: string;
  synced: number;
  user_team: string | null;
  user_id: number | null;
  asset_type: string | null;
  verified: number;
  barcode_photo_url: string | null;
  created_at: string;
  updated_at: string;
}

const mapInspection = (row: InspectionRow): Inspection => ({
  id: row.id,
  assetUid: row.asset_uid,
  status: row.status,
  memo: row.memo ?? undefined,
  scannedAt: row.scanned_at,
  synced: Boolean(row.synced),
  userTeam: row.user_team ?? undefined,
  userId: row.user_id ?? undefined,
  assetType: row.asset_type ?? undefined,
  verified: Boolean(row.verified),
  barcodePhotoUrl: row.barcode_photo_url ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export class InspectionRepository {
  async findById(id: string): Promise<Inspection | null> {
    const [rows] = await getPool().query<InspectionRow[]>(
      `SELECT * FROM inspections WHERE id = :id LIMIT 1`,
      { id }
    );

    return rows[0] ? mapInspection(rows[0]) : null;
  }

  async findManyByAsset(assetUid: string): Promise<Inspection[]> {
    const [rows] = await getPool().query<InspectionRow[]>(
      `SELECT * FROM inspections WHERE asset_uid = :assetUid ORDER BY scanned_at DESC`,
      { assetUid }
    );

    return rows.map(mapInspection);
  }

  async create(payload: Omit<Inspection, 'createdAt' | 'updatedAt'>): Promise<void> {
    await getPool().query(
      `INSERT INTO inspections (
        id, asset_uid, status, memo, scanned_at, synced,
        user_team, user_id, asset_type, verified, barcode_photo_url
      ) VALUES (
        :id, :assetUid, :status, :memo, :scannedAt, :synced,
        :userTeam, :userId, :assetType, :verified, :barcodePhotoUrl
      )`,
      {
        id: payload.id,
        assetUid: payload.assetUid,
        status: payload.status,
        memo: payload.memo ?? null,
        scannedAt: payload.scannedAt,
        synced: payload.synced ? 1 : 0,
        userTeam: payload.userTeam ?? null,
        userId: payload.userId ?? null,
        assetType: payload.assetType ?? null,
        verified: payload.verified ? 1 : 0,
        barcodePhotoUrl: payload.barcodePhotoUrl ?? null,
      }
    );
  }

  async update(
    id: string,
    updates: Partial<Pick<Inspection, 'status' | 'memo' | 'synced' | 'verified'>>
  ): Promise<void> {
    const fields: string[] = [];
    const params: Record<string, unknown> = { id };

    if (updates.status !== undefined) {
      fields.push('status = :status');
      params.status = updates.status;
    }

    if (updates.memo !== undefined) {
      fields.push('memo = :memo');
      params.memo = updates.memo ?? null;
    }

    if (updates.synced !== undefined) {
      fields.push('synced = :synced');
      params.synced = updates.synced ? 1 : 0;
    }

    if (updates.verified !== undefined) {
      fields.push('verified = :verified');
      params.verified = updates.verified ? 1 : 0;
    }

    if (fields.length === 0) {
      return;
    }

    await getPool().query(
      `UPDATE inspections SET ${fields.join(', ')} WHERE id = :id`,
      params
    );
  }

  async delete(id: string): Promise<void> {
    await getPool().query(`DELETE FROM inspections WHERE id = :id`, { id });
  }
}

export const inspectionRepository = new InspectionRepository();
