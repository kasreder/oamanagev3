import { verificationSummaries } from '@/data/mock-data';
import type { VerificationSummary } from '@/types/domain';

class VerificationRepository {
  list(): VerificationSummary[] {
    return verificationSummaries;
  }

  findByAssetUid(uid: string): VerificationSummary | undefined {
    return verificationSummaries.find((summary) => summary.assetUid === uid);
  }
}

export const verificationRepository = new VerificationRepository();
