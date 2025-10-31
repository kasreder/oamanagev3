import type { Request, Response } from 'express';

import { users } from '@/data/mock-data';
import { notFound } from '@/utils/errors';

export const getMe = (req: Request, res: Response): void => {
  const user = users.find((candidate) => candidate.id === Number(req.user?.id)) || users[0];
  if (!user) {
    throw notFound('user', 'me');
  }

  res.json(user);
};

export const updateMe = (req: Request, res: Response): void => {
  const user = users.find((candidate) => candidate.id === Number(req.user?.id)) || users[0];
  Object.assign(user, req.body);
  res.json(user);
};
