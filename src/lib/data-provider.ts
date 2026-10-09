import {
  Goal,
  GoalMissingPiece,
  Offer,
  Profile,
  ConnectionRequest,
  Connection,
  Conversation,
  Message,
  Collaboration,
  Task,
  Milestone,
  ProgressUpdate,
  Notification,
  Report,
} from '@/types/database';
import { generateMissingPieceSuggestions } from './engine/missing-pieces';

// Initial Mock Seed Data
const MOCK_PROFILES: Profile[] = [
  {
    id: '11111111-1111-4111-a111-111111111111',
    display_name: 'Elena Rostova',
    headline: 'Full-stack Engineer & AI Builder | Seeking UI/UX Partner',
    bio: 'Building intelligent developer tools. Passionate about turning complex logic into accessible products.',
    avatar_url: null,
    skills: ['Next.js', 'TypeScript', 'Python', 'PostgreSQL', 'Machine Learning', 'API Design'],
    areas_of_interest: ['SaaS', 'EdTech', 'AI tooling', 'Developer Platforms'],
    can_help_with: ['Full-stack architecture', 'Backend API design', 'Database optimization', 'AI prototyping'],
    seeking_help_with: ['UI/UX Design', 'Product Marketing', 'Beta tester feedback', 'User interviews'],
    collaboration_styles: ['joint_project', 'skill_exchange', 'mentorship'],
    location: 'San Francisco, CA',
    is_remote_only: true,
    is_discoverable: true,
    portfolio_url: 'https://github.com/elena-rostova',
    role: 'user',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-4222-a222-222222222222',
    display_name: 'Marcus Vance',
    headline: 'Product Designer & Design Systems Specialist',
    bio: '8+ years helping early-stage founders craft intuitive, accessible user interfaces in Figma.',
    avatar_url: null,
    skills: ['UI/UX Design', 'Figma', 'Design Systems', 'User Research', 'Prototyping', 'Accessibility'],
    areas_of_interest: ['B2B SaaS', 'HealthTech', 'Creator Economy', 'Mobile Apps'],
    can_help_with: ['Wireframing', 'High-fidelity Figma prototypes', 'Design systems', 'Usability testing'],
    seeking_help_with: ['Technical feasibility reviews', 'Frontend implementation', 'Customer acquisition'],
    collaboration_styles: ['paid', 'skill_exchange', 'mentorship'],
    location: 'Austin, TX',
    is_remote_only: true,
    is_discoverable: true,
    portfolio_url: 'https://marcusvance.design',
    role: 'user',
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-4333-a333-333333333333',
    display_name: 'Priya Sharma',
    headline: 'Growth Marketer & Community Strategist',
    bio: 'Helped 15+ startups acquire their first 1,000 customers through organic community building and outbound loops.',
    avatar_url: null,
    skills: ['Growth Marketing', 'Community Building', 'Content Strategy', 'SEO', 'Customer Discovery', 'Cold Outreach'],
    areas_of_interest: ['Marketplaces', 'B2C Apps', 'Developer Communities', 'Bootstrapping'],
    can_help_with: ['Go-to-market strategy', 'Early adopter acquisition', 'Community launch events', 'Messaging validation'],
    seeking_help_with: ['Technical co-founders', 'Automation engineering', 'Analytics infrastructure'],
    collaboration_styles: ['paid', 'joint_project', 'customer_discovery'],
    location: 'London, UK',
    is_remote_only: true,
    is_discoverable: true,
    portfolio_url: 'https://priyasharma.growth',
    role: 'user',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '44444444-4444-4444-a444-444444444444',
    display_name: 'David Chen',
    headline: 'Startup Advisor & Engineering Mentor',
    bio: 'Former VP of Engineering at ScaleCo. Mentoring ambitious founders on architecture and team building.',
    avatar_url: null,
    skills: ['Technical Leadership', 'System Architecture', 'Mentorship', 'Cloud Infrastructure', 'Fundraising Prep'],
    areas_of_interest: ['Cloud Infrastructure', 'Enterprise Software', 'AI Platforms'],
    can_help_with: ['Architecture teardowns', 'Engineering leadership guidance', 'Pitch deck technical feedback'],
    seeking_help_with: ['Fresh ideas to mentor', 'Emerging talent connections'],
    collaboration_styles: ['mentorship', 'feedback'],
    location: 'Seattle, WA',
    is_remote_only: true,
    is_discoverable: true,
    portfolio_url: 'https://davidchen.tech',
    role: 'admin',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const MOCK_GOALS: Goal[] = [
  {
    id: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
    user_id: '11111111-1111-4111-a111-111111111111',
    title: 'Launch AI-Powered Code Review Companion MVP',
    category: 'build_idea',
    description: 'Developing an intelligent pull request analysis tool that spots security vulnerabilities and logic edge cases before merging. The core engine is built in Python/Next.js.',
    desired_outcome: 'Ship a working beta to 50 active engineering teams and validate product-market fit.',
    current_progress: 'Core algorithm and AST parser completed; Next.js frontend scaffolded.',
    available_skills: ['Next.js', 'TypeScript', 'Python', 'Machine Learning'],
    missing_skills: ['UI/UX Design', 'User Research', 'Beta Testing', 'Product Marketing'],
    help_needed_type: 'Design partner to create intuitive review mockups and developer flow.',
    collaboration_style: 'skill_exchange',
    budget: 0,
    currency: 'USD',
    timeline: '6 weeks',
    location_preference: 'Remote',
    visibility: 'public',
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb',
    user_id: '22222222-2222-4222-a222-222222222222',
    title: 'Build Interactive Design System Documentation Portal',
    category: 'task_help',
    description: 'Creating an open-source documentation template for multi-brand design systems. Need a React engineer to turn the Figma tokens into production components.',
    desired_outcome: 'A published component library on npm with an interactive Next.js documentation showcase site.',
    current_progress: 'Figma component library and design token architecture finalized.',
    available_skills: ['UI/UX Design', 'Figma', 'Design Systems'],
    missing_skills: ['React', 'TypeScript', 'Storybook', 'Tailwind CSS'],
    help_needed_type: 'Frontend React developer to build component docs.',
    collaboration_style: 'joint_project',
    budget: 0,
    currency: 'USD',
    timeline: '1 month',
    location_preference: 'Remote',
    visibility: 'public',
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cccccccc-cccc-4ccc-cccc-cccccccccccc',
    user_id: '33333333-3333-4333-a333-333333333333',
    title: 'Acquire First 100 Paying Customers for Community Analytics Tool',
    category: 'first_users',
    description: 'We built an analytical dashboard for Discord and Slack communities. Need hands-on user interviews and validation with real community managers.',
    desired_outcome: '100 active community managers trialing the tool with measurable retention.',
    current_progress: 'Platform live in closed alpha with 12 friendly testers.',
    available_skills: ['Growth Marketing', 'Community Building', 'Content Strategy'],
    missing_skills: ['Customer Discovery', 'Product Analytics', 'Copywriting'],
    help_needed_type: 'Feedback from experienced product managers.',
    collaboration_style: 'customer_discovery',
    budget: 500,
    currency: 'USD',
    timeline: '3 months',
    location_preference: 'Remote',
    visibility: 'public',
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const MOCK_MISSING_PIECES: GoalMissingPiece[] = [
  {
    id: 'mp-001',
    goal_id: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
    missing_skill_or_resource: 'UI/UX Design & Prototyping',
    reason: 'Developer tools require intuitive interaction patterns to prevent cognitive overload during PR reviews.',
    suggested_next_action: 'Connect with a product designer who has experience building developer or productivity tools.',
    related_tags: ['Figma', 'UI/UX Design', 'Design Systems'],
    confidence_score: 0.95,
    status: 'accepted',
    is_custom: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mp-002',
    goal_id: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
    missing_skill_or_resource: 'Beta Tester Community',
    reason: 'Early feedback from real engineering leads is critical to tune signal-to-noise ratio in AI code reviews.',
    suggested_next_action: 'Partner with a technical community builder or recruit 5 beta teams on Discover.',
    related_tags: ['Community Building', 'Customer Discovery', 'Beta Testing'],
    confidence_score: 0.90,
    status: 'suggested',
    is_custom: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mp-003',
    goal_id: 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb',
    missing_skill_or_resource: 'Frontend Component Implementation',
    reason: 'Figma designs need to be translated into accessible, tokenized React components.',
    suggested_next_action: 'Collaborate with a frontend developer passionate about component architecture.',
    related_tags: ['React', 'TypeScript', 'Tailwind CSS'],
    confidence_score: 0.98,
    status: 'accepted',
    is_custom: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const MOCK_OFFERS: Offer[] = [
  {
    id: 'dddddddd-dddd-4ddd-dddd-dddddddddddd',
    user_id: '22222222-2222-4222-a222-222222222222',
    title: 'MVP Product Design & Figma Prototyping',
    description: 'I help technical founders turn backend logic into polished, ready-to-code design systems and interactive prototypes.',
    category: 'Design',
    skills: ['UI/UX Design', 'Figma', 'Design Systems', 'User Research'],
    offer_type: 'paid_service',
    delivery_format: 'remote',
    pricing_model: 'fixed',
    price: 750,
    currency: 'USD',
    portfolio_url: 'https://marcusvance.design',
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'eeeeeeee-eeee-4eee-eeee-eeeeeeeeeeee',
    user_id: '33333333-3333-4333-a333-333333333333',
    title: 'Zero-to-One Growth Strategy & Early Adopter Playbook',
    description: 'Hands-on guidance to find your first 50-500 customers without paid ads. Includes messaging audit and targeted outbound sequence design.',
    category: 'Marketing',
    skills: ['Growth Marketing', 'Customer Discovery', 'Cold Outreach', 'Community Building'],
    offer_type: 'mentorship',
    delivery_format: 'remote',
    pricing_model: 'hourly',
    price: 80,
    currency: 'USD',
    portfolio_url: 'https://priyasharma.growth',
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'ffffffff-ffff-4fff-ffff-ffffffffffff',
    user_id: '11111111-1111-4111-a111-111111111111',
    title: 'Full-Stack Architecture & API Code Review',
    description: 'Offering free architectural audits for fellow startup builders. I review database schema, Next.js setups, and API security.',
    category: 'Engineering',
    skills: ['Next.js', 'TypeScript', 'PostgreSQL', 'API Design'],
    offer_type: 'free_help',
    delivery_format: 'remote',
    pricing_model: 'free',
    price: 0,
    currency: 'USD',
    portfolio_url: 'https://github.com/elena-rostova',
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const MOCK_CONNECTION_REQUESTS: ConnectionRequest[] = [
  {
    id: '77777777-7777-4777-a777-777777777777',
    sender_id: '11111111-1111-4111-a111-111111111111',
    recipient_id: '22222222-2222-4222-a222-222222222222',
    goal_id: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
    offer_id: 'dddddddd-dddd-4ddd-dddd-dddddddddddd',
    message: 'Hi Marcus, I saw your design systems work. I am building an AI PR reviewer and need help crafting a clean review interface. Would love to collaborate!',
    status: 'accepted',
    responded_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '77777777-7777-4777-a777-888888888888',
    sender_id: '33333333-3333-4333-a333-333333333333',
    recipient_id: '11111111-1111-4111-a111-111111111111',
    goal_id: 'cccccccc-cccc-4ccc-cccc-cccccccccccc',
    offer_id: null,
    message: 'Hey Elena! We have a community tool and are looking for engineering feedback on our API endpoints.',
    status: 'pending',
    responded_at: null,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const MOCK_CONNECTIONS: Connection[] = [
  {
    id: '88888888-8888-4888-a888-888888888888',
    user1_id: '11111111-1111-4111-a111-111111111111',
    user2_id: '22222222-2222-4222-a222-222222222222',
    request_id: '77777777-7777-4777-a777-777777777777',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '99999999-9999-4999-a999-999999999999',
    title: 'Elena & Marcus: Code Review UI',
    goal_id: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg-01',
    conversation_id: '99999999-9999-4999-a999-999999999999',
    sender_id: '11111111-1111-4111-a111-111111111111',
    content: 'Excited to connect Marcus! I have the repository ready with the initial Next.js shell.',
    created_at: new Date(Date.now() - 86400000 * 2 + 1000).toISOString(),
  },
  {
    id: 'msg-02',
    conversation_id: '99999999-9999-4999-a999-999999999999',
    sender_id: '22222222-2222-4222-a222-222222222222',
    content: 'Awesome! I am putting together initial wireframes for the PR comment diff view. Will share the Figma link today.',
    created_at: new Date(Date.now() - 86400000 * 2 + 50000).toISOString(),
  },
];

const MOCK_COLLABORATIONS: Collaboration[] = [
  {
    id: 'c011ab00-0000-4000-a000-000000000001',
    title: 'Code Review Companion Design & Frontend Sprint',
    description: 'Joint collaboration between Elena and Marcus to finalize UI mockups and implement the primary review panel.',
    goal_id: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
    created_by: '11111111-1111-4111-a111-111111111111',
    status: 'active',
    progress_summary: 'Wireframes drafted; component tokens exported from Figma.',
    start_date: new Date().toISOString().split('T')[0],
    target_date: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const MOCK_TASKS: Task[] = [
  {
    id: 'task-01',
    collaboration_id: 'c011ab00-0000-4000-a000-000000000001',
    title: 'Audit Existing PR Flow & Draft User Journey Map',
    description: 'Identify friction points when developers inspect AI-generated code suggestions.',
    assignee_id: '22222222-2222-4222-a222-222222222222',
    created_by: '11111111-1111-4111-a111-111111111111',
    status: 'done',
    priority: 'high',
    due_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-02',
    collaboration_id: 'c011ab00-0000-4000-a000-000000000001',
    title: 'Create Figma Component Tokens for Diff Viewer',
    description: 'Define colors, typography, and spacing for diff syntax highlighting.',
    assignee_id: '22222222-2222-4222-a222-222222222222',
    created_by: '22222222-2222-4222-a222-222222222222',
    status: 'in_progress',
    priority: 'high',
    due_date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-03',
    collaboration_id: 'c011ab00-0000-4000-a000-000000000001',
    title: 'Integrate Tailwind Components into Next.js App',
    description: 'Hook up the diff viewer components with the live backend parser.',
    assignee_id: '11111111-1111-4111-a111-111111111111',
    created_by: '11111111-1111-4111-a111-111111111111',
    status: 'todo',
    priority: 'medium',
    due_date: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const MOCK_MILESTONES: Milestone[] = [
  {
    id: 'ms-01',
    collaboration_id: 'c011ab00-0000-4000-a000-000000000001',
    title: 'Milestone 1: Design Specification & Prototype Signoff',
    description: 'Figma prototype approved by both engineering and user testing group.',
    due_date: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
    status: 'in_progress',
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'ms-02',
    collaboration_id: 'c011ab00-0000-4000-a000-000000000001',
    title: 'Milestone 2: Functional Frontend Integration',
    description: 'All UI screens connected to Supabase and API endpoints.',
    due_date: new Date(Date.now() + 86400000 * 25).toISOString().split('T')[0],
    status: 'pending',
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const MOCK_PROGRESS_UPDATES: ProgressUpdate[] = [
  {
    id: 'pu-01',
    collaboration_id: 'c011ab00-0000-4000-a000-000000000001',
    author_id: '22222222-2222-4222-a222-222222222222',
    content: 'Completed the user journey audit for the PR flow. Users found traditional code review comments cluttered, so we are designing an inline drawer modal.',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-01',
    user_id: '11111111-1111-4111-a111-111111111111',
    actor_id: '33333333-3333-4333-a333-333333333333',
    type: 'connection_request_received',
    title: 'New Connection Request',
    message: 'Priya Sharma requested a connection regarding your goal: Acquire First 100 Paying Customers',
    resource_type: 'connection_request',
    resource_id: '77777777-7777-4777-a777-888888888888',
    is_read: false,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'notif-02',
    user_id: '11111111-1111-4111-a111-111111111111',
    actor_id: '22222222-2222-4222-a222-222222222222',
    type: 'task_completed',
    title: 'Task Completed',
    message: 'Marcus completed the task: "Audit Existing PR Flow & Draft User Journey Map"',
    resource_type: 'collaboration',
    resource_id: 'c011ab00-0000-4000-a000-000000000001',
    is_read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

const MOCK_REPORTS: Report[] = [
  {
    id: 'rep-01',
    reporter_id: '11111111-1111-4111-a111-111111111111',
    target_type: 'profile',
    target_id: '44444444-4444-4444-a444-444444444444',
    reason: 'Suspicious profile verification check',
    details: 'Testing the administrative moderation workflow for community safety.',
    status: 'pending',
    admin_notes: null,
    reviewed_by: null,
    reviewed_at: null,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

// In-Memory Data Store with full CRUD
class DataStore {
  private profiles = [...MOCK_PROFILES];
  private goals = [...MOCK_GOALS];
  private missingPieces = [...MOCK_MISSING_PIECES];
  private offers = [...MOCK_OFFERS];
  private connectionRequests = [...MOCK_CONNECTION_REQUESTS];
  private connections = [...MOCK_CONNECTIONS];
  private conversations = [...MOCK_CONVERSATIONS];
  private messages = [...MOCK_MESSAGES];
  private collaborations = [...MOCK_COLLABORATIONS];
  private tasks = [...MOCK_TASKS];
  private milestones = [...MOCK_MILESTONES];
  private progressUpdates = [...MOCK_PROGRESS_UPDATES];
  private notifications = [...MOCK_NOTIFICATIONS];
  private reports = [...MOCK_REPORTS];

  // Current session user (defaults to Elena Rostova in dev demo)
  public currentUserId = '11111111-1111-4111-a111-111111111111';

  getCurrentUser(): Profile {
    return this.profiles.find((p) => p.id === this.currentUserId) || this.profiles[0];
  }

  // --- Profiles ---
  getProfiles(): Profile[] {
    return this.profiles;
  }

  getProfileById(id: string): Profile | undefined {
    return this.profiles.find((p) => p.id === id);
  }

  updateProfile(id: string, updates: Partial<Profile>): Profile {
    const idx = this.profiles.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.profiles[idx] = { ...this.profiles[idx], ...updates, updated_at: new Date().toISOString() };
      return this.profiles[idx];
    }
    throw new Error('Profile not found');
  }

  // --- Goals ---
  getGoals(userId?: string): Goal[] {
    let result = this.goals;
    if (userId) {
      result = result.filter((g) => g.user_id === userId);
    }
    return result.map((g) => ({
      ...g,
      profiles: this.getProfileById(g.user_id),
      missing_pieces: this.getMissingPieces(g.id),
    }));
  }

  getGoalById(id: string): Goal | undefined {
    const goal = this.goals.find((g) => g.id === id);
    if (!goal) return undefined;
    return {
      ...goal,
      profiles: this.getProfileById(goal.user_id),
      missing_pieces: this.getMissingPieces(goal.id),
    };
  }

  createGoal(data: Omit<Goal, 'id' | 'created_at' | 'updated_at' | 'user_id'> & { user_id?: string }): Goal {
    const newId = `goal-${Date.now()}`;
    const newGoal: Goal = {
      ...data,
      id: newId,
      user_id: data.user_id || this.currentUserId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.goals.unshift(newGoal);

    // Trigger Missing-Piece Discovery Engine automatically
    const suggestions = generateMissingPieceSuggestions({
      title: newGoal.title,
      category: newGoal.category,
      description: newGoal.description,
      desired_outcome: newGoal.desired_outcome,
      available_skills: newGoal.available_skills,
      missing_skills: newGoal.missing_skills,
      collaboration_style: newGoal.collaboration_style,
    });

    for (const s of suggestions) {
      this.missingPieces.push({
        id: `mp-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        goal_id: newId,
        missing_skill_or_resource: s.missing_skill_or_resource,
        reason: s.reason,
        suggested_next_action: s.suggested_next_action,
        related_tags: s.related_tags,
        confidence_score: s.confidence_score,
        status: 'suggested',
        is_custom: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    return this.getGoalById(newId)!;
  }

  updateGoal(id: string, updates: Partial<Goal>): Goal {
    const idx = this.goals.findIndex((g) => g.id === id);
    if (idx !== -1) {
      this.goals[idx] = { ...this.goals[idx], ...updates, updated_at: new Date().toISOString() };
      return this.getGoalById(id)!;
    }
    throw new Error('Goal not found');
  }

  // --- Missing Pieces ---
  getMissingPieces(goalId: string): GoalMissingPiece[] {
    return this.missingPieces.filter((p) => p.goal_id === goalId);
  }

  updateMissingPiece(pieceId: string, action: 'accept' | 'dismiss' | 'resolve'): GoalMissingPiece {
    const piece = this.missingPieces.find((p) => p.id === pieceId);
    if (!piece) throw new Error('Missing piece not found');

    if (action === 'accept') piece.status = 'accepted';
    else if (action === 'dismiss') piece.status = 'dismissed';
    else if (action === 'resolve') piece.status = 'resolved';

    piece.updated_at = new Date().toISOString();
    return piece;
  }

  addCustomMissingPiece(goalId: string, item: { missing_skill_or_resource: string; reason: string; suggested_next_action: string; related_tags: string[] }): GoalMissingPiece {
    const newPiece: GoalMissingPiece = {
      id: `mp-custom-${Date.now()}`,
      goal_id: goalId,
      missing_skill_or_resource: item.missing_skill_or_resource,
      reason: item.reason,
      suggested_next_action: item.suggested_next_action,
      related_tags: item.related_tags,
      confidence_score: 1.0,
      status: 'accepted',
      is_custom: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.missingPieces.unshift(newPiece);
    return newPiece;
  }

  // --- Offers ---
  getOffers(): Offer[] {
    return this.offers.map((o) => ({
      ...o,
      profiles: this.getProfileById(o.user_id),
    }));
  }

  getOfferById(id: string): Offer | undefined {
    const offer = this.offers.find((o) => o.id === id);
    if (!offer) return undefined;
    return {
      ...offer,
      profiles: this.getProfileById(offer.user_id),
    };
  }

  createOffer(data: Omit<Offer, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Offer {
    const newId = `offer-${Date.now()}`;
    const newOffer: Offer = {
      ...data,
      id: newId,
      user_id: this.currentUserId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.offers.unshift(newOffer);
    return this.getOfferById(newId)!;
  }

  // --- Connection Requests ---
  getConnectionRequests(): ConnectionRequest[] {
    return this.connectionRequests.map((r) => ({
      ...r,
      sender: this.getProfileById(r.sender_id),
      recipient: this.getProfileById(r.recipient_id),
      goal: r.goal_id ? this.getGoalById(r.goal_id) : undefined,
      offer: r.offer_id ? this.getOfferById(r.offer_id) : undefined,
    }));
  }

  createConnectionRequest(data: { recipient_id: string; goal_id?: string | null; offer_id?: string | null; message: string }): ConnectionRequest {
    if (data.recipient_id === this.currentUserId) {
      throw new Error('Cannot send connection request to yourself.');
    }

    // Check duplicate pending request
    const existing = this.connectionRequests.find(
      (r) => r.sender_id === this.currentUserId && r.recipient_id === data.recipient_id && r.status === 'pending'
    );
    if (existing) {
      throw new Error('A pending connection request already exists with this user.');
    }

    const newId = `req-${Date.now()}`;
    const req: ConnectionRequest = {
      id: newId,
      sender_id: this.currentUserId,
      recipient_id: data.recipient_id,
      goal_id: data.goal_id || null,
      offer_id: data.offer_id || null,
      message: data.message,
      status: 'pending',
      responded_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.connectionRequests.unshift(req);

    // Notify recipient
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: data.recipient_id,
      actor_id: this.currentUserId,
      type: 'connection_request_received',
      title: 'New Connection Request',
      message: `${this.getCurrentUser().display_name} sent you a connection request.`,
      resource_type: 'connection_request',
      resource_id: newId,
      is_read: false,
      created_at: new Date().toISOString(),
    });

    return req;
  }

  respondConnectionRequest(requestId: string, action: 'accept' | 'decline' | 'cancel'): ConnectionRequest {
    const req = this.connectionRequests.find((r) => r.id === requestId);
    if (!req) throw new Error('Connection request not found');

    if (action === 'cancel') {
      if (req.sender_id !== this.currentUserId) throw new Error('Only the sender can cancel this request');
      req.status = 'cancelled';
    } else if (action === 'decline') {
      if (req.recipient_id !== this.currentUserId) throw new Error('Only recipient can decline');
      req.status = 'declined';
      req.responded_at = new Date().toISOString();
    } else if (action === 'accept') {
      if (req.recipient_id !== this.currentUserId) throw new Error('Only recipient can accept');
      req.status = 'accepted';
      req.responded_at = new Date().toISOString();

      // Create connection
      this.connections.push({
        id: `conn-${Date.now()}`,
        user1_id: req.sender_id,
        user2_id: req.recipient_id,
        request_id: req.id,
        created_at: new Date().toISOString(),
      });

      // Create Conversation
      const convoId = `convo-${Date.now()}`;
      this.conversations.unshift({
        id: convoId,
        title: `Direct: ${this.getProfileById(req.sender_id)?.display_name} & ${this.getCurrentUser().display_name}`,
        goal_id: req.goal_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Notify sender
      this.notifications.unshift({
        id: `notif-${Date.now()}`,
        user_id: req.sender_id,
        actor_id: this.currentUserId,
        type: 'connection_accepted',
        title: 'Connection Accepted',
        message: `${this.getCurrentUser().display_name} accepted your connection request. You can now chat and collaborate!`,
        resource_type: 'conversation',
        resource_id: convoId,
        is_read: false,
        created_at: new Date().toISOString(),
      });
    }

    req.updated_at = new Date().toISOString();
    return req;
  }

  // --- Conversations & Messages ---
  getConversations(): Conversation[] {
    return this.conversations.map((c) => {
      const msgs = this.messages.filter((m) => m.conversation_id === c.id);
      return {
        ...c,
        last_message: msgs[msgs.length - 1],
      };
    });
  }

  getConversationById(id: string): Conversation | undefined {
    return this.conversations.find((c) => c.id === id);
  }

  getMessages(conversationId: string): Message[] {
    return this.messages
      .filter((m) => m.conversation_id === conversationId)
      .map((m) => ({
        ...m,
        sender: this.getProfileById(m.sender_id),
      }));
  }

  sendMessage(conversationId: string, content: string): Message {
    if (!content.trim()) throw new Error('Message cannot be empty');
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: this.currentUserId,
      content: content.trim(),
      created_at: new Date().toISOString(),
    };
    this.messages.push(newMsg);
    return {
      ...newMsg,
      sender: this.getCurrentUser(),
    };
  }

  // --- Collaborations, Tasks & Milestones ---
  getCollaborations(): Collaboration[] {
    return this.collaborations.map((c) => ({
      ...c,
      goal: c.goal_id ? this.getGoalById(c.goal_id) : undefined,
    }));
  }

  getCollaborationById(id: string): Collaboration | undefined {
    const collab = this.collaborations.find((c) => c.id === id);
    if (!collab) return undefined;
    return {
      ...collab,
      goal: collab.goal_id ? this.getGoalById(collab.goal_id) : undefined,
    };
  }

  createCollaboration(data: { title: string; description?: string | null; goal_id?: string | null; target_date?: string | null }): Collaboration {
    const newCollab: Collaboration = {
      id: `collab-${Date.now()}`,
      title: data.title,
      description: data.description || null,
      goal_id: data.goal_id || null,
      created_by: this.currentUserId,
      status: 'active',
      progress_summary: 'Collaboration established. Ready for task planning.',
      start_date: new Date().toISOString().split('T')[0],
      target_date: data.target_date || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.collaborations.unshift(newCollab);
    return newCollab;
  }

  getTasks(collabId: string): Task[] {
    return this.tasks
      .filter((t) => t.collaboration_id === collabId)
      .map((t) => ({
        ...t,
        assignee: t.assignee_id ? this.getProfileById(t.assignee_id) : undefined,
      }));
  }

  createTask(data: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'created_by'>): Task {
    const newTask: Task = {
      ...data,
      id: `task-${Date.now()}`,
      created_by: this.currentUserId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  updateTaskStatus(taskId: string, status: Task['status']): Task {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    task.status = status;
    task.updated_at = new Date().toISOString();
    return task;
  }

  getMilestones(collabId: string): Milestone[] {
    return this.milestones.filter((m) => m.collaboration_id === collabId);
  }

  createMilestone(data: Omit<Milestone, 'id' | 'created_at' | 'updated_at' | 'completed_at'>): Milestone {
    const newMs: Milestone = {
      ...data,
      id: `ms-${Date.now()}`,
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.milestones.push(newMs);
    return newMs;
  }

  getProgressUpdates(collabId: string): ProgressUpdate[] {
    return this.progressUpdates
      .filter((p) => p.collaboration_id === collabId)
      .map((p) => ({
        ...p,
        author: this.getProfileById(p.author_id),
      }));
  }

  createProgressUpdate(collabId: string, content: string): ProgressUpdate {
    const update: ProgressUpdate = {
      id: `pu-${Date.now()}`,
      collaboration_id: collabId,
      author_id: this.currentUserId,
      content,
      created_at: new Date().toISOString(),
    };
    this.progressUpdates.unshift(update);
    return {
      ...update,
      author: this.getCurrentUser(),
    };
  }

  // --- Notifications ---
  getNotifications(): Notification[] {
    return this.notifications
      .filter((n) => n.user_id === this.currentUserId)
      .map((n) => ({
        ...n,
        actor: n.actor_id ? this.getProfileById(n.actor_id) : undefined,
      }));
  }

  markNotificationRead(id: string): void {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) notif.is_read = true;
  }

  // --- Moderation Reports ---
  getReports(): Report[] {
    return this.reports.map((r) => ({
      ...r,
      reporter: this.getProfileById(r.reporter_id),
    }));
  }

  createReport(data: { target_type: Report['target_type']; target_id: string; reason: string; details?: string | null }): Report {
    const rep: Report = {
      id: `rep-${Date.now()}`,
      reporter_id: this.currentUserId,
      target_type: data.target_type,
      target_id: data.target_id,
      reason: data.reason,
      details: data.details || null,
      status: 'pending',
      admin_notes: null,
      reviewed_by: null,
      reviewed_at: null,
      created_at: new Date().toISOString(),
    };
    this.reports.unshift(rep);
    return rep;
  }

  updateReportStatus(id: string, status: Report['status'], adminNotes?: string): Report {
    const rep = this.reports.find((r) => r.id === id);
    if (!rep) throw new Error('Report not found');
    rep.status = status;
    if (adminNotes) rep.admin_notes = adminNotes;
    rep.reviewed_by = this.currentUserId;
    rep.reviewed_at = new Date().toISOString();
    return rep;
  }
}

// Global singleton instance for local state
export const store = new DataStore();
