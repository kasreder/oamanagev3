export interface DepartmentInfo {
  hq?: string;
  dept?: string;
  team?: string;
  part?: string;
}

export interface User {
  id: number;
  employeeId: string;
  name: string;
  email?: string;
  phone?: string;
  provider?: string;
  providerId?: string;
  department?: DepartmentInfo;
  createdAt: string;
}

export interface AssetOwnerSummary {
  id: number;
  name: string;
}

export interface AssetMetadata {
  os?: string;
  os_ver?: string;
  network?: string;
  memo?: string;
  memo2?: string;
}

export interface Asset {
  uid: string;
  name?: string;
  assetType?: string;
  modelName?: string;
  serialNumber?: string;
  status?: string;
  location?: string;
  organization?: string;
  metadata?: AssetMetadata;
  owner?: AssetOwnerSummary;
  barcodePhotoUrl?: string;
  updatedAt: string;
}

export interface VerificationSummary {
  assetUid: string;
  team?: string;
  user?: AssetOwnerSummary;
  assetType?: string;
  barcodePhoto: boolean;
  signature: boolean;
  latestInspection?: {
    scannedAt: string;
    status: string;
  };
}
