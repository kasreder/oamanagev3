import { signatureRepository } from '@/repositories/signature.repository';
import { Signature } from '@/models/Signature';

export class SignatureService {
  async createSignature(signature: Omit<Signature, 'id'>): Promise<void> {
    await signatureRepository.create(signature);
  }

  async getLatestForAsset(assetUid: string): Promise<Signature | null> {
    return signatureRepository.findLatestByAsset(assetUid);
  }
}

export const signatureService = new SignatureService();
