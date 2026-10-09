import { Goal, GoalMissingPiece, Offer, Profile } from '@/types/database';

export interface MatchResult<T = Profile | Offer> {
  item: T;
  type: 'profile' | 'offer';
  score: number; // 0 - 100
  explanation: string;
  missingPieceSolved?: string;
  recommendedAction: string;
  isAdjacent?: boolean; // For "Explore Beyond Your Usual Circle"
}

// Category adjacency map for "Beyond Your Usual Circle"
const ADJACENT_CATEGORIES: Record<string, { adjacentNeeds: string[]; reason: string }> = {
  Engineering: {
    adjacentNeeds: ['User Research', 'Community Building', 'Product Marketing', 'Accessibility'],
    reason: 'Technical builders often accelerate faster by validating with user researchers and community leaders.',
  },
  Design: {
    adjacentNeeds: ['Frontend Architecture', 'Design Systems', 'Data Analytics'],
    reason: 'Designers achieve higher impact by partnering with frontend component engineers.',
  },
  Marketing: {
    adjacentNeeds: ['Full-stack Prototyping', 'Analytics Infrastructure', 'Automation Engineering'],
    reason: 'Marketers scale customer acquisition faster with technical automation partners.',
  },
};

/**
 * Computes match score and plain-English explanation between a Goal and a Profile.
 */
export function matchProfileToGoal(goal: Goal, profile: Profile, missingPieces: GoalMissingPiece[] = []): MatchResult<Profile> | null {
  // Prevent matching user with themselves
  if (goal.user_id === profile.id) return null;
  if (!profile.is_discoverable) return null;

  let score = 20; // Base score for active discoverable profile
  const reasons: string[] = [];
  let resolvedPieceName: string | undefined;

  const goalMissingSkills = (goal.missing_skills || []).map((s) => s.toLowerCase());
  const pieceSkills = missingPieces
    .filter((p) => p.status === 'suggested' || p.status === 'accepted')
    .map((p) => p.missing_skill_or_resource.toLowerCase());

  const profileSkills = (profile.skills || []).map((s) => s.toLowerCase());
  const profileCanHelp = (profile.can_help_with || []).map((s) => s.toLowerCase());

  // 1. Check overlap with missing skills or missing pieces
  const matchedSkills: string[] = [];
  for (const skill of profileSkills) {
    if (goalMissingSkills.includes(skill)) {
      matchedSkills.push(skill);
      score += 25;
    }
  }

  // Check against goal_missing_pieces
  for (const piece of missingPieces) {
    const pTitle = piece.missing_skill_or_resource.toLowerCase();
    const matches = profileSkills.some((s) => pTitle.includes(s) || s.includes(pTitle)) ||
      (piece.related_tags || []).some((tag) => profileSkills.includes(tag.toLowerCase()));

    if (matches) {
      score += 30;
      resolvedPieceName = piece.missing_skill_or_resource;
      reasons.push(`Can help resolve your missing piece: "${piece.missing_skill_or_resource}"`);
      break;
    }
  }

  if (matchedSkills.length > 0 && !resolvedPieceName) {
    reasons.push(`Has complementary skills you are missing: ${matchedSkills.slice(0, 2).join(', ')}`);
  }

  // 2. Check collaboration style compatibility
  const hasStyleMatch = profile.collaboration_styles.includes(goal.collaboration_style);
  if (hasStyleMatch) {
    score += 15;
    reasons.push(`Prefers your requested collaboration style (${goal.collaboration_style.replace('_', ' ')})`);
  }

  // 3. Remote / Location compatibility
  if (profile.is_remote_only || (goal.location_preference && profile.location?.toLowerCase().includes(goal.location_preference.toLowerCase()))) {
    score += 10;
  }

  // Check if this profile qualifies as an adjacent "Beyond Your Usual Circle" connection
  let isAdjacent = false;
  if (score < 45) {
    // Check adjacency
    for (const [, val] of Object.entries(ADJACENT_CATEGORIES)) {
      const hasAdjacentSkill = profileSkills.some((s) =>
        val.adjacentNeeds.some((need) => need.toLowerCase().includes(s) || s.includes(need.toLowerCase()))
      );
      if (hasAdjacentSkill) {
        score = 55;
        isAdjacent = true;
        reasons.push(`Adjacent perspective: ${val.reason}`);
        break;
      }
    }
  }

  if (score < 40 && !isAdjacent) {
    return null; // Not relevant enough
  }

  const normalizedScore = Math.min(100, Math.max(30, score));
  const primaryExplanation = reasons.length > 0
    ? reasons[0]
    : `Active member with relevant domain experience in ${profile.skills.slice(0, 2).join(', ')}.`;

  return {
    item: profile,
    type: 'profile',
    score: normalizedScore,
    explanation: primaryExplanation,
    missingPieceSolved: resolvedPieceName,
    recommendedAction: `Send a connection request to discuss ${resolvedPieceName ? `help with ${resolvedPieceName}` : 'collaborating on this goal'}.`,
    isAdjacent,
  };
}

/**
 * Computes match score between a Goal and an Offer.
 */
export function matchOfferToGoal(goal: Goal, offer: Offer, missingPieces: GoalMissingPiece[] = []): MatchResult<Offer> | null {
  if (goal.user_id === offer.user_id) return null;
  if (offer.status !== 'active') return null;

  let score = 25;
  const reasons: string[] = [];
  let resolvedPieceName: string | undefined;

  const offerSkills = (offer.skills || []).map((s) => s.toLowerCase());
  const goalMissingSkills = (goal.missing_skills || []).map((s) => s.toLowerCase());

  // 1. Missing piece alignment
  for (const piece of missingPieces) {
    const pTitle = piece.missing_skill_or_resource.toLowerCase();
    const matches = offerSkills.some((s) => pTitle.includes(s) || s.includes(pTitle)) ||
      (piece.related_tags || []).some((tag) => offerSkills.includes(tag.toLowerCase()));

    if (matches) {
      score += 35;
      resolvedPieceName = piece.missing_skill_or_resource;
      reasons.push(`Direct solution for your missing piece: "${piece.missing_skill_or_resource}"`);
      break;
    }
  }

  // 2. Missing skills overlap
  const matchedSkills = offerSkills.filter((s) => goalMissingSkills.includes(s));
  if (matchedSkills.length > 0 && !resolvedPieceName) {
    score += 25;
    reasons.push(`Provides skills you need: ${matchedSkills.slice(0, 2).join(', ')}`);
  }

  // 3. Pricing / Budget Compatibility
  if (goal.collaboration_style === 'paid') {
    if (offer.pricing_model !== 'free') {
      if (goal.budget && offer.price && offer.price <= goal.budget) {
        score += 20;
        reasons.push(`Within your estimated budget (${offer.currency} ${offer.price} <= ${goal.currency} ${goal.budget})`);
      } else if (goal.budget) {
        score += 10;
        reasons.push(`Offers paid service matching your goal intent`);
      }
    }
  } else if (offer.pricing_model === 'free' || offer.offer_type === 'free_help' || offer.offer_type === 'mentorship') {
    score += 20;
    reasons.push(`Matches your unpaid or mentorship collaboration preference`);
  }

  if (score < 40) return null;

  const normalizedScore = Math.min(100, Math.max(35, score));
  const primaryExplanation = reasons.length > 0
    ? reasons[0]
    : `Offer covers relevant capabilities (${offer.skills.slice(0, 2).join(', ')}).`;

  return {
    item: offer,
    type: 'offer',
    score: normalizedScore,
    explanation: primaryExplanation,
    missingPieceSolved: resolvedPieceName,
    recommendedAction: `View offer details or request a connection with the provider.`,
  };
}
