import { inspectionRepository } from '@/repositories/inspection.repository';
import { Inspection } from '@/models/Inspection';

export class InspectionService {
  async getInspection(id: string): Promise<Inspection | null> {
    return inspectionRepository.findById(id);
  }

  async listByAsset(assetUid: string): Promise<Inspection[]> {
    return inspectionRepository.findManyByAsset(assetUid);
  }

  async createInspection(inspection: Omit<Inspection, 'createdAt' | 'updatedAt'>): Promise<void> {
    await inspectionRepository.create(inspection);
  }

  async updateInspection(
    id: string,
    updates: Partial<Pick<Inspection, 'status' | 'memo' | 'synced' | 'verified'>>
  ): Promise<void> {
    await inspectionRepository.update(id, updates);
  }

  async deleteInspection(id: string): Promise<void> {
    await inspectionRepository.delete(id);
  }
}

export const inspectionService = new InspectionService();
