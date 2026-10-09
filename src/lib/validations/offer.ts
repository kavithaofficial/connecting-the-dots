import { z } from 'zod';

export const offerSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(120),
  description: z.string().min(20, 'Please provide an informative description (at least 20 chars)').max(2000),
  category: z.string().min(2, 'Category is required').max(50),
  skills: z.array(z.string()).min(1, 'Please list at least one skill'),
  offer_type: z.enum([
    'paid_service',
    'free_help',
    'mentorship',
    'skill_exchange',
    'project_collaboration',
    'business_support',
    'feedback_review'
  ]),
  delivery_format: z.enum(['remote', 'in_person', 'hybrid']).default('remote'),
  pricing_model: z.enum(['fixed', 'hourly', 'negotiable', 'free', 'not_specified']),
  price: z.number().min(0, 'Price must be positive').optional().nullable(),
  currency: z.string().length(3).default('USD'),
  portfolio_url: z.string().url('Must be a valid URL').optional().or(z.literal('')).nullable(),
  status: z.enum(['active', 'paused', 'archived']).default('active'),
});

export type OfferInput = z.infer<typeof offerSchema>;
