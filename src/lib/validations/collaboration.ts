import { z } from 'zod';

export const collaborationSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(120),
  description: z.string().max(2000).optional().nullable(),
  goal_id: z.string().uuid().optional().nullable(),
  target_date: z.string().optional().nullable(),
  members: z.array(z.string().uuid()).min(1, 'Select at least one collaborator'),
});

export const taskSchema = z.object({
  collaboration_id: z.string().uuid(),
  title: z.string().min(3, 'Task title is required').max(120),
  description: z.string().max(1000).optional().nullable(),
  assignee_id: z.string().uuid().optional().nullable(),
  status: z.enum(['todo', 'in_progress', 'review', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  due_date: z.string().optional().nullable(),
});

export const milestoneSchema = z.object({
  collaboration_id: z.string().uuid(),
  title: z.string().min(3, 'Milestone title is required').max(120),
  description: z.string().max(1000).optional().nullable(),
  due_date: z.string().optional().nullable(),
  status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
});

export const progressUpdateSchema = z.object({
  collaboration_id: z.string().uuid(),
  content: z.string().min(5, 'Update must be at least 5 characters').max(1000),
});

export type CollaborationInput = z.infer<typeof collaborationSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type MilestoneInput = z.infer<typeof milestoneSchema>;
export type ProgressUpdateInput = z.infer<typeof progressUpdateSchema>;
