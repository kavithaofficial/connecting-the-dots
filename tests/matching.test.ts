import { describe, it, expect } from 'vitest';
import { matchProfileToGoal, matchOfferToGoal } from '../src/lib/engine/matching';
import { Goal, Profile, Offer, GoalMissingPiece } from '../src/types/database';

describe('Discovery and Matching Engine', () => {
  const mockGoal: Goal = {
    id: 'goal-1',
    user_id: 'user-a',
    title: 'Launch Developer SaaS',
    category: 'build_idea',
    description: 'Building an automated testing tool.',
    desired_outcome: 'Ship beta',
    available_skills: ['Next.js', 'Python'],
    missing_skills: ['UI/UX Design', 'Figma'],
    help_needed_type: null,
    collaboration_style: 'skill_exchange',
    budget: null,
    currency: 'USD',
    timeline: '4 weeks',
    location_preference: null,
    visibility: 'public',
    status: 'active',
    current_progress: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockDesigner: Profile = {
    id: 'user-b',
    display_name: 'Marcus Vance',
    headline: 'UI Designer',
    bio: 'Product design expert',
    avatar_url: null,
    skills: ['UI/UX Design', 'Figma', 'Design Systems'],
    areas_of_interest: ['SaaS'],
    can_help_with: ['Figma prototyping'],
    seeking_help_with: ['Backend code'],
    collaboration_styles: ['skill_exchange'],
    location: 'Austin, TX',
    is_remote_only: true,
    is_discoverable: true,
    portfolio_url: null,
    role: 'user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockPieces: GoalMissingPiece[] = [
    {
      id: 'mp-1',
      goal_id: 'goal-1',
      missing_skill_or_resource: 'UI/UX Design',
      reason: 'Need clean UX',
      suggested_next_action: 'Find designer',
      related_tags: ['Figma', 'UI/UX Design'],
      confidence_score: 0.95,
      status: 'accepted',
      is_custom: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  it('matches profile with complementary skills and provides explainability', () => {
    const match = matchProfileToGoal(mockGoal, mockDesigner, mockPieces);
    expect(match).not.toBeNull();
    expect(match!.score).toBeGreaterThanOrEqual(60);
    expect(match!.explanation).toContain('UI/UX Design');
    expect(match!.missingPieceSolved).toBe('UI/UX Design');
  });

  it('never matches a user to their own goal', () => {
    const selfGoal: Goal = { ...mockGoal, user_id: mockDesigner.id };
    const match = matchProfileToGoal(selfGoal, mockDesigner, mockPieces);
    expect(match).toBeNull();
  });

  it('evaluates budget and pricing compatibility for offers', () => {
    const paidGoal: Goal = {
      ...mockGoal,
      collaboration_style: 'paid',
      budget: 800,
    };

    const offer: Offer = {
      id: 'off-1',
      user_id: 'user-b',
      title: 'MVP UI/UX Design System',
      description: 'Comprehensive design system in Figma',
      category: 'Design',
      skills: ['UI/UX Design', 'Figma'],
      offer_type: 'paid_service',
      delivery_format: 'remote',
      pricing_model: 'fixed',
      price: 600,
      currency: 'USD',
      portfolio_url: null,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const match = matchOfferToGoal(paidGoal, offer, mockPieces);
    expect(match).not.toBeNull();
    expect(match!.score).toBeGreaterThan(65);
    expect(match!.explanation).toContain('UI/UX Design');
  });
});
