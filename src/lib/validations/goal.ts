import { z } from 'zod';

export const goalSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(120, 'Title cannot exceed 120 characters'),
  category: z.enum(['build_idea', 'task_help', 'first_users', 'custom'], {
    errorMap: () => ({ message: 'Please select a valid goal category' }),
  }),
  description: z.string().min(20, 'Please describe your goal in at least 20 characters').max(2000, 'Description too long'),
  desired_outcome: z.string().min(10, 'Specify what success looks like').max(500, 'Desired outcome too long'),
  current_progress: z.string().max(1000).optional().nullable(),
  available_skills: z.array(z.string()).default([]),
  missing_skills: z.array(z.string()).default([]),
  help_needed_type: z.string().max(200).optional().nullable(),
  collaboration_style: z.enum([
    'paid',
    'skill_exchange',
    'joint_project',
    'mentorship',
    'feedback',
    'customer_discovery',
    'community'
  ], {
    errorMap: () => ({ message: 'Please select a collaboration style' }),
  }),
  budget: z.number().min(0, 'Budget cannot be negative').optional().nullable(),
  currency: z.string().length(3).default('USD'),
  timeline: z.string().max(100).optional().nullable(),
  location_preference: z.string().max(100).optional().nullable(),
  visibility: z.enum(['public', 'private', 'connections_only']).default('public'),
  status: z.enum(['draft', 'active', 'paused', 'completed', 'archived']).default('active'),
});

export const missingPieceActionSchema = z.object({
  pieceId: z.string().uuid(),
  action: z.enum(['accept', 'dismiss', 'resolve']),
});

export const customMissingPieceSchema = z.object({
  goalId: z.string().uuid(),
  missing_skill_or_resource: z.string().min(2, 'Skill or resource name required').max(100),
  reason: z.string().min(5, 'Explain why this is needed').max(300),
  suggested_next_action: z.string().min(5, 'Action required').max(300),
  related_tags: z.array(z.string()).default([]),
});

export type GoalInput = z.infer<typeof goalSchema>;
export type MissingPieceActionInput = z.infer<typeof missingPieceActionSchema>;
export type CustomMissingPieceInput = z.infer<typeof customMissingPieceSchema>;
