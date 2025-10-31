import type { Request, Response } from 'express';

import { assets, users } from '@/data/mock-data';

export const searchUsers = (req: Request, res: Response): void => {
  const { q, team } = req.query;
  const keyword = q?.toString().toLowerCase();
  const filtered = users.filter((user) => {
    const matchesKeyword = keyword
      ? [user.name, user.employeeId, user.email].filter(Boolean).some((value) => value!.toLowerCase().includes(keyword))
      : true;
    const matchesTeam = team ? user.department?.team === team : true;
    return matchesKeyword && matchesTeam;
  });

  res.json({ items: filtered });
};

export const searchAssets = (req: Request, res: Response): void => {
  const { q } = req.query;
  const keyword = q?.toString().toLowerCase();
  const filtered = assets.filter((asset) => (keyword ? asset.uid.toLowerCase().includes(keyword) : true));
  res.json({ items: filtered.map((asset) => ({ uid: asset.uid, name: asset.name })) });
};
