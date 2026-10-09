import { z } from 'zod';

export const connectionRequestSchema = z.object({
  recipient_id: z.string().uuid('Invalid recipient ID'),
  goal_id: z.string().uuid().optional().nullable(),
  offer_id: z.string().uuid().optional().nullable(),
  message: z.string().min(10, 'Please write a personalized message explaining your intent (min 10 characters)').max(1000),
});

export const respondConnectionRequestSchema = z.object({
  requestId: z.string().uuid(),
  action: z.enum(['accept', 'decline', 'cancel']),
});

export type ConnectionRequestInput = z.infer<typeof connectionRequestSchema>;
export type RespondConnectionRequestInput = z.infer<typeof respondConnectionRequestSchema>;
