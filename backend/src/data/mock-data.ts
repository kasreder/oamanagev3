import type { Asset, VerificationSummary, User } from '@/types/domain';

export const users: User[] = [
  {
    id: 101,
    employeeId: 'EMP001',
    name: '홍길동',
    email: 'hong@example.com',
    provider: 'kakao',
    providerId: 'kakao_101',
    department: {
      hq: '본사',
      dept: 'IT부',
      team: '정보보안팀'
    },
    phone: '010-1111-2222',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 102,
    employeeId: 'EMP002',
    name: '김철수',
    email: 'kim@example.com',
    provider: 'google',
    providerId: 'google_102',
    department: {
      hq: '본사',
      dept: '인프라부',
      team: '네트워크팀'
    },
    phone: '010-3333-4444',
    createdAt: '2024-01-02T00:00:00Z'
  }
];

export const assets: Asset[] = [
  {
    uid: 'OA-001',
    name: '홍길동',
    assetType: '노트북',
    modelName: 'Gram 15',
    serialNumber: 'SN123',
    status: '사용',
    location: '본사 A동 3F',
    organization: '정보보안팀',
    metadata: {
      os: 'Windows 11',
      network: '내부',
      memo: '교체 예정'
    },
    owner: { id: 101, name: '홍길동' },
    barcodePhotoUrl: 'https://example.com/barcodes/OA-001.png',
    updatedAt: '2024-02-02T09:00:00Z'
  },
  {
    uid: 'OA-002',
    name: '김철수',
    assetType: '데스크톱',
    modelName: 'ThinkCentre',
    serialNumber: 'SN456',
    status: '가용',
    location: '본사 B동 5F',
    organization: '네트워크팀',
    metadata: {
      os: 'Windows 10',
      memo: '모니터 교체 요청'
    },
    owner: { id: 102, name: '김철수' },
    barcodePhotoUrl: 'https://example.com/barcodes/OA-002.png',
    updatedAt: '2024-02-03T10:00:00Z'
  }
];

export const verificationSummaries: VerificationSummary[] = [
  {
    assetUid: 'OA-001',
    team: '정보보안팀',
    user: { id: 101, name: '홍길동' },
    assetType: '노트북',
    barcodePhoto: true,
    signature: true,
    latestInspection: {
      scannedAt: '2024-02-01T09:12:00Z',
      status: '사용'
    }
  },
  {
    assetUid: 'OA-002',
    team: '네트워크팀',
    user: { id: 102, name: '김철수' },
    assetType: '데스크톱',
    barcodePhoto: false,
    signature: false,
    latestInspection: {
      scannedAt: '2024-01-25T13:45:00Z',
      status: '가용'
    }
  }
];
