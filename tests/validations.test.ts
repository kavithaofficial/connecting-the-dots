import { describe, it, expect } from 'vitest';
import { goalSchema } from '../src/lib/validations/goal';
import { offerSchema } from '../src/lib/validations/offer';
import { signUpSchema } from '../src/lib/validations/auth';

describe('Zod Form Validation Schemas', () => {
  it('validates correct goal inputs', () => {
    const validData = {
      title: 'Build automated CI tester',
      category: 'build_idea',
      description: 'Developing a continuous integration testing tool with GitHub webhooks.',
      desired_outcome: '10 beta test teams',
      collaboration_style: 'skill_exchange',
      available_skills: ['TypeScript'],
      missing_skills: ['UI Design'],
      budget: 0,
      currency: 'USD',
      visibility: 'public',
      status: 'active',
    };

    const result = goalSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects goals with titles that are too short', () => {
    const invalidData = {
      title: 'Abc',
      category: 'build_idea',
      description: 'Short',
      desired_outcome: 'Outcome',
      collaboration_style: 'skill_exchange',
    };

    const result = goalSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('validates password security requirements on signup', () => {
    // Missing number
    const noNumber = signUpSchema.safeParse({
      fullName: 'Alice Test',
      email: 'alice@example.com',
      password: 'PasswordOnly',
    });
    expect(noNumber.success).toBe(false);

    // Valid
    const valid = signUpSchema.safeParse({
      fullName: 'Alice Test',
      email: 'alice@example.com',
      password: 'StrongPassword123',
    });
    expect(valid.success).toBe(true);
  });
});
