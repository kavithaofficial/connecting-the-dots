import { describe, it, expect } from 'vitest';
import { generateMissingPieceSuggestions } from '../src/lib/engine/missing-pieces';

describe('Missing-Piece Discovery Engine', () => {
  it('should suggest UI/UX design and distribution for technical developer goals', () => {
    const suggestions = generateMissingPieceSuggestions({
      title: 'Build a high-performance Next.js web application',
      category: 'build_idea',
      description: 'Developing a SaaS platform with Next.js, TypeScript, and Python.',
      desired_outcome: 'Acquire 100 paid users',
      available_skills: ['Next.js', 'TypeScript', 'Python'],
      missing_skills: [],
      collaboration_style: 'skill_exchange',
    });

    expect(suggestions.length).toBeGreaterThan(0);
    // Should suggest UI/UX Design because technical skills are present but design is missing
    const hasDesignSuggestion = suggestions.some((s) =>
      s.missing_skill_or_resource.toLowerCase().includes('design')
    );
    expect(hasDesignSuggestion).toBe(true);

    // Each suggestion must have explanation and next action
    for (const item of suggestions) {
      expect(item.reason).toBeTruthy();
      expect(item.suggested_next_action).toBeTruthy();
      expect(item.confidence_score).toBeGreaterThan(0.5);
    }
  });

  it('should not suggest skills the user already possesses', () => {
    const suggestions = generateMissingPieceSuggestions({
      title: 'Product design sprint for SaaS',
      category: 'build_idea',
      description: 'We have full Figma mockups and completed UI design.',
      desired_outcome: 'Ship prototype',
      available_skills: ['UI/UX Design', 'Figma', 'Design Systems'],
      missing_skills: ['Frontend Implementation'],
      collaboration_style: 'joint_project',
    });

    // Should not suggest UI/UX design because user already has Figma and UI/UX design
    const suggestsFigma = suggestions.some((s) => s.missing_skill_or_resource === 'UI/UX Design');
    expect(suggestsFigma).toBe(false);
  });

  it('should generate customer discovery suggestions for first_users goal category', () => {
    const suggestions = generateMissingPieceSuggestions({
      title: 'Acquire first 50 early adopters',
      category: 'first_users',
      description: 'Need early feedback on analytics dashboard',
      desired_outcome: '50 user interviews',
      available_skills: ['Next.js'],
      collaboration_style: 'customer_discovery',
    });

    const hasInterviewSuggestion = suggestions.some(
      (s) => s.missing_skill_or_resource.toLowerCase().includes('customer') ||
             s.missing_skill_or_resource.toLowerCase().includes('interview') ||
             s.missing_skill_or_resource.toLowerCase().includes('outreach')
    );
    expect(hasInterviewSuggestion).toBe(true);
  });
});
