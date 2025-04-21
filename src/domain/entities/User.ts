import { z } from 'zod';

export const BlockUser = z
  .object({
    userId: z.string().optional(),
    documentId: z.string().optional(),
    username: z.string().optional(),
    reason: z.string().nullable(),
  })
  .refine((data) => {
    if (!data.documentId && !data.userId && !data.username) {
      return false;
    }
  });
export type BlockUser = z.infer<typeof BlockUser>;
