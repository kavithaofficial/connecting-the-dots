import { z } from 'zod';

export const onboardingSchema = z.object({
  display_name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  headline: z.string().min(5, 'Headline helps others know what you do').max(120),
  bio: z.string().max(1000).optional().or(z.literal('')),
  skills: z.array(z.string()).min(1, 'Please select or add at least one skill'),
  areas_of_interest: z.array(z.string()).default([]),
  can_help_with: z.array(z.string()).default([]),
  seeking_help_with: z.array(z.string()).default([]),
  collaboration_styles: z.array(z.enum([
    'paid',
    'skill_exchange',
    'joint_project',
    'mentorship',
    'feedback',
    'customer_discovery',
    'community'
  ])).min(1, 'Please select at least one collaboration preference'),
  location: z.string().max(80).optional().or(z.literal('')),
  is_remote_only: z.boolean().default(true),
  portfolio_url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const reportSchema = z.object({
  target_type: z.enum(['profile', 'goal', 'offer', 'message']),
  target_id: z.string().uuid(),
  reason: z.string().min(5, 'Please select or describe a reason').max(100),
  details: z.string().max(1000).optional().or(z.literal('')),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
