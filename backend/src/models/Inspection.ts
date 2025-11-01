export interface Inspection {
  id: string;
  assetUid: string;
  status: string;
  memo?: string | null;
  scannedAt: string;
  synced: boolean;
  userTeam?: string | null;
  userId?: number | null;
  assetType?: string | null;
  verified: boolean;
  barcodePhotoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}
