import { GoalCategory, CollaborationStyle } from '@/types/database';

export interface MissingPieceSuggestion {
  missing_skill_or_resource: string;
  reason: string;
  suggested_next_action: string;
  related_tags: string[];
  confidence_score: number;
}

interface GoalContext {
  title: string;
  category: GoalCategory;
  description: string;
  desired_outcome: string;
  available_skills: string[];
  missing_skills?: string[];
  collaboration_style?: CollaborationStyle;
}

// Category-based rule templates
const CATEGORY_TEMPLATES: Record<GoalCategory, MissingPieceSuggestion[]> = {
  build_idea: [
    {
      missing_skill_or_resource: 'UI/UX Design & Prototyping',
      reason: 'Products with validated interactive prototypes ship 3x faster and minimize rework during development.',
      suggested_next_action: 'Connect with a product designer to create clickable Figma wireframes before writing production UI.',
      related_tags: ['UI/UX Design', 'Figma', 'Prototyping', 'Design Systems'],
      confidence_score: 0.95,
    },
    {
      missing_skill_or_resource: 'Early Beta User Testing',
      reason: 'Getting real feedback from 5-10 target users before public launch prevents building unwanted features.',
      suggested_next_action: 'Find an early adopter community lead or recruit 5 beta testers on the Discover page.',
      related_tags: ['User Research', 'Beta Testing', 'Customer Discovery'],
      confidence_score: 0.90,
    },
    {
      missing_skill_or_resource: 'Go-to-Market & Launch Strategy',
      reason: 'Building the product is only half the battle; distribution channels must be established early.',
      suggested_next_action: 'Partner with a growth marketer to define your launch narrative and distribution loops.',
      related_tags: ['Growth Marketing', 'Content Strategy', 'Launch Strategy'],
      confidence_score: 0.85,
    },
  ],
  task_help: [
    {
      missing_skill_or_resource: 'Technical Code & Architecture Review',
      reason: 'An experienced pair of eyes helps catch security vulnerabilities, scaling bottlenecks, and edge cases.',
      suggested_next_action: 'Request a code review or architectural audit from a domain mentor.',
      related_tags: ['System Architecture', 'Code Review', 'Security Audit'],
      confidence_score: 0.92,
    },
    {
      missing_skill_or_resource: 'Implementation Specialist',
      reason: 'Delegating specific blocking tasks keeps your overall project momentum alive.',
      suggested_next_action: 'Search Offers & Services for an engineer or specialist who provides direct task help.',
      related_tags: ['Task Execution', 'Specialized Engineering'],
      confidence_score: 0.88,
    },
  ],
  first_users: [
    {
      missing_skill_or_resource: 'Customer Discovery & User Interviews',
      reason: 'Structured interviews uncover the exact pain points and language potential buyers resonate with.',
      suggested_next_action: 'Conduct 30-minute structured discovery sessions with prospective users.',
      related_tags: ['Customer Discovery', 'User Interviews', 'Product Validation'],
      confidence_score: 0.96,
    },
    {
      missing_skill_or_resource: 'Targeted Outreach & Seeding',
      reason: 'Direct 1-on-1 outreach to your ICP (Ideal Customer Profile) yields the highest early conversion rates.',
      suggested_next_action: 'Collaborate with an outbound marketing specialist to craft non-spammy outreach sequences.',
      related_tags: ['Cold Outreach', 'Community Seeding', 'Growth Marketing'],
      confidence_score: 0.89,
    },
    {
      missing_skill_or_resource: 'Product Onboarding Audit',
      reason: 'Drop-off during the first 60 seconds of user trial is the most common reason early signups fail to convert.',
      suggested_next_action: 'Test your sign-up and initial workflow with an external UX tester.',
      related_tags: ['Onboarding UX', 'Conversion Optimization'],
      confidence_score: 0.82,
    },
  ],
  custom: [
    {
      missing_skill_or_resource: 'Milestone Definition & Accountability Partner',
      reason: 'Custom initiatives benefit heavily from structured deadlines and an external collaborator.',
      suggested_next_action: 'Set up an active collaboration workspace with measurable milestones.',
      related_tags: ['Project Management', 'Accountability'],
      confidence_score: 0.80,
    },
  ],
};

// Skill-gap rules: analyze what skills are available and infer what complementary pieces are needed
export function generateMissingPieceSuggestions(context: GoalContext): MissingPieceSuggestion[] {
  const suggestions: MissingPieceSuggestion[] = [];
  const availableSkillsLower = context.available_skills.map((s) => s.toLowerCase());
  const descriptionLower = (context.description + ' ' + context.title + ' ' + context.desired_outcome).toLowerCase();

  // 1. Incorporate category-based foundations
  const categorySuggestions = CATEGORY_TEMPLATES[context.category] || CATEGORY_TEMPLATES.custom;
  for (const item of categorySuggestions) {
    // Check if user already explicitly has this skill
    const alreadyAvailable = availableSkillsLower.some((s) =>
      item.related_tags.some((tag) => tag.toLowerCase() === s)
    );
    if (!alreadyAvailable) {
      suggestions.push({ ...item });
    }
  }

  // 2. Technical developer skills present -> Suggest Design & Growth if missing
  const hasDevSkills = availableSkillsLower.some((s) =>
    ['next.js', 'react', 'python', 'typescript', 'javascript', 'backend', 'node.js', 'sql', 'postgresql'].includes(s)
  );
  const hasDesignSkills = availableSkillsLower.some((s) =>
    ['figma', 'ui/ux design', 'design', 'prototyping', 'product design'].includes(s)
  );
  const hasMarketingSkills = availableSkillsLower.some((s) =>
    ['growth marketing', 'marketing', 'seo', 'community', 'sales', 'cold outreach'].includes(s)
  );

  if (hasDevSkills && !hasDesignSkills) {
    const exists = suggestions.some((s) => s.missing_skill_or_resource.toLowerCase().includes('design'));
    if (!exists) {
      suggestions.unshift({
        missing_skill_or_resource: 'Product UI/UX & Design Systems',
        reason: 'You have strong technical engineering capabilities, but professional visual polish and UX flow will accelerate adoption.',
        suggested_next_action: 'Find a UI/UX designer to collaborate on wireframes and polished interface states.',
        related_tags: ['UI/UX Design', 'Figma', 'Design Systems'],
        confidence_score: 0.94,
      });
    }
  }

  if ((hasDevSkills || hasDesignSkills) && !hasMarketingSkills) {
    const exists = suggestions.some((s) => s.missing_skill_or_resource.toLowerCase().includes('market') || s.missing_skill_or_resource.toLowerCase().includes('user'));
    if (!exists) {
      suggestions.push({
        missing_skill_or_resource: 'Distribution & Community Seeding',
        reason: 'Products built without an audience struggle at launch. Establishing community relationships now builds day-one demand.',
        suggested_next_action: 'Connect with a community organizer or growth specialist in your niche.',
        related_tags: ['Community Building', 'Growth Marketing', 'Audience Growth'],
        confidence_score: 0.87,
      });
    }
  }

  // 3. Keyword-driven contextual rules
  if (descriptionLower.includes('mobile') || descriptionLower.includes('ios') || descriptionLower.includes('android')) {
    const hasMobile = availableSkillsLower.some((s) => ['flutter', 'react native', 'swift', 'kotlin'].includes(s));
    if (!hasMobile) {
      suggestions.push({
        missing_skill_or_resource: 'Cross-Platform Mobile Engineering',
        reason: 'Targeting mobile devices requires expertise in React Native, Flutter, or native iOS/Android deployment.',
        suggested_next_action: 'Connect with a mobile developer or evaluate cross-platform mobile frameworks.',
        related_tags: ['React Native', 'Flutter', 'Mobile Development'],
        confidence_score: 0.91,
      });
    }
  }

  if (descriptionLower.includes('ai') || descriptionLower.includes('machine learning') || descriptionLower.includes('llm')) {
    suggestions.push({
      missing_skill_or_resource: 'Model Evaluation & Prompt Safety',
      reason: 'AI applications require evaluation pipelines to benchmark hallucinations, latency, and edge cases.',
      suggested_next_action: 'Consult an AI engineer or researcher to review prompt engineering and evaluation metrics.',
      related_tags: ['Machine Learning', 'AI Prototyping', 'Evaluation'],
      confidence_score: 0.88,
    });
  }

  // 4. Filter out any skills the user already stated they possess
  const finalFiltered = suggestions.filter((suggestion) => {
    return !availableSkillsLower.some((s) =>
      suggestion.missing_skill_or_resource.toLowerCase() === s
    );
  });

  // Limit to top 4 highest confidence suggestions to prevent cognitive overload
  return finalFiltered
    .sort((a, b) => b.confidence_score - a.confidence_score)
    .slice(0, 4);
}
