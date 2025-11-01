export interface Signature {
  id: number;
  assetUid: string;
  userId: number;
  userName?: string | null;
  storageLocation: string;
  fileSize?: number | null;
  mimeType: string;
  sha256?: string | null;
  capturedAt: string;
}
