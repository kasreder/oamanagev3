import { RowDataPacket } from 'mysql2/promise';

import { getPool } from '@/config/database';
import { Signature } from '@/models/Signature';

interface SignatureRow extends RowDataPacket {
  id: number;
  asset_uid: string;
  user_id: number;
  user_name: string | null;
  storage_location: string;
  file_size: number | null;
  mime_type: string;
  sha256: string | null;
  captured_at: string;
}

const mapSignature = (row: SignatureRow): Signature => ({
  id: row.id,
  assetUid: row.asset_uid,
  userId: row.user_id,
  userName: row.user_name ?? undefined,
  storageLocation: row.storage_location,
  fileSize: row.file_size ?? undefined,
  mimeType: row.mime_type,
  sha256: row.sha256 ?? undefined,
  capturedAt: row.captured_at,
});

export class SignatureRepository {
  async create(signature: Omit<Signature, 'id'>): Promise<void> {
    await getPool().query(
      `INSERT INTO signatures (
        asset_uid, user_id, user_name, storage_location,
        file_size, mime_type, sha256, captured_at
      ) VALUES (
        :assetUid, :userId, :userName, :storageLocation,
        :fileSize, :mimeType, :sha256, :capturedAt
      )`,
      {
        assetUid: signature.assetUid,
        userId: signature.userId,
        userName: signature.userName ?? null,
        storageLocation: signature.storageLocation,
        fileSize: signature.fileSize ?? null,
        mimeType: signature.mimeType,
        sha256: signature.sha256 ?? null,
        capturedAt: signature.capturedAt,
      }
    );
  }

  async findLatestByAsset(assetUid: string): Promise<Signature | null> {
    const [rows] = await getPool().query<SignatureRow[]>(
      `SELECT * FROM signatures WHERE asset_uid = :assetUid ORDER BY captured_at DESC LIMIT 1`,
      { assetUid }
    );

    return rows[0] ? mapSignature(rows[0]) : null;
  }
}

export const signatureRepository = new SignatureRepository();
