-- ==============================================================================
-- CONNECTING THE DOTS: DEVELOPMENT SEED DATA
-- Note: Replace UUIDs with actual auth.users IDs in a live Supabase project
-- ==============================================================================

-- Seed Profiles (using fixed deterministic UUIDs for testability)
INSERT INTO public.profiles (id, display_name, headline, bio, skills, areas_of_interest, can_help_with, seeking_help_with, collaboration_styles, location, is_remote_only, is_discoverable, role)
VALUES 
(
    '11111111-1111-4111-a111-111111111111',
    'Elena Rostova',
    'Full-stack Engineer & AI Researcher | Looking for UI/UX & Growth Partners',
    'Building developer tools and intelligent workflows. Passionate about open source and turning complex ideas into clean products.',
    ARRAY['Next.js', 'TypeScript', 'Python', 'PostgreSQL', 'Machine Learning', 'API Design'],
    ARRAY['SaaS', 'EdTech', 'AI tooling', 'Developer Platforms'],
    ARRAY['Full-stack architecture', 'Backend API design', 'Database optimization', 'AI prototyping'],
    ARRAY['UI/UX Design', 'Product Marketing', 'Beta tester feedback', 'User interviews'],
    ARRAY['joint_project', 'skill_exchange', 'mentorship'],
    'San Francisco, CA',
    TRUE,
    TRUE,
    'user'
),
(
    '22222222-2222-4222-a222-222222222222',
    'Marcus Vance',
    'Product Designer & Design Systems Lead',
    'Over 8 years helping early-stage founders turn rough concepts into intuitive, accessible user experiences. Specialized in Figma, design systems, and rapid user testing.',
    ARRAY['UI/UX Design', 'Figma', 'Design Systems', 'User Research', 'Prototyping', 'Accessibility'],
    ARRAY['B2B SaaS', 'HealthTech', 'Creator Economy', 'Mobile Apps'],
    ARRAY['Wireframing', 'High-fidelity Figma prototypes', 'Design systems', 'Usability testing'],
    ARRAY['Technical feasibility reviews', 'Frontend implementation', 'Customer acquisition'],
    ARRAY['paid', 'skill_exchange', 'mentorship'],
    'Austin, TX',
    TRUE,
    TRUE,
    'user'
),
(
    '33333333-3333-4333-a333-333333333333',
    'Priya Sharma',
    'Growth Marketer & Community Strategist',
    'Helped 15+ startups acquire their first 1,000 customers through organic community building, content loops, and targeted outreach.',
    ARRAY['Growth Marketing', 'Community Building', 'Content Strategy', 'SEO', 'Customer Discovery', 'Cold Outreach'],
    ARRAY['Marketplaces', 'B2C Apps', 'Developer Communities', 'Bootstrapping'],
    ARRAY['Go-to-market strategy', 'Early adopter acquisition', 'Community launch events', 'Messaging validation'],
    ARRAY['Technical co-founders', 'Automation engineering', 'Analytics infrastructure'],
    ARRAY['paid', 'joint_project', 'customer_discovery'],
    'London, UK',
    TRUE,
    TRUE,
    'user'
),
(
    '44444444-4444-4444-a444-444444444444',
    'David Chen',
    'Seasoned Startup Advisor & Engineering Mentor',
    'Former VP of Engineering at ScaleCo. Now mentoring ambitious founders on scaling architectures, hiring early teams, and avoiding early-stage pitfalls.',
    ARRAY['Technical Leadership', 'System Architecture', 'Mentorship', 'Cloud Infrastructure', 'Fundraising Prep'],
    ARRAY['Cloud Infrastructure', 'Enterprise Software', 'AI Platforms'],
    ARRAY['Architecture teardowns', 'Engineering leadership guidance', 'Pitch deck technical feedback'],
    ARRAY['Fresh ideas to mentor', 'Emerging talent connections'],
    ARRAY['mentorship', 'feedback'],
    'Seattle, WA',
    TRUE,
    TRUE,
    'admin'
)
ON CONFLICT (id) DO UPDATE 
SET display_name = EXCLUDED.display_name,
    headline = EXCLUDED.headline,
    skills = EXCLUDED.skills;

-- Seed Goals
INSERT INTO public.goals (
    id, user_id, title, category, description, desired_outcome, 
    available_skills, missing_skills, collaboration_style, budget, timeline, visibility, status
) VALUES 
(
    'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-4111-a111-111111111111',
    'Launch AI-Powered Code Review Companion MVP',
    'build_idea',
    'Developing an intelligent pull request analysis tool that spots security vulnerabilities and logic edge cases before merging. The core engine is built in Python/Next.js.',
    'Ship a working beta to 50 active engineering teams and validate product-market fit.',
    ARRAY['Next.js', 'TypeScript', 'Python', 'Machine Learning'],
    ARRAY['UI/UX Design', 'User Research', 'Beta Testing', 'Product Marketing'],
    'skill_exchange',
    0,
    '6 weeks',
    'public',
    'active'
),
(
    'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-4222-a222-222222222222',
    'Build Interactive Design System Documentation Portal',
    'task_help',
    'Creating an open-source documentation template for multi-brand design systems. Need a React engineer to turn the Figma tokens into production components.',
    'A published component library on npm with an interactive Next.js documentation showcase site.',
    ARRAY['UI/UX Design', 'Figma', 'Design Systems'],
    ARRAY['React', 'TypeScript', 'Storybook', 'Tailwind CSS'],
    'joint_project',
    0,
    '1 month',
    'public',
    'active'
),
(
    'cccccccc-cccc-4ccc-cccc-cccccccccccc',
    '33333333-3333-4333-a333-333333333333',
    'Acquire First 100 Paying Customers for Community Analytics Tool',
    'first_users',
    'We built an analytical dashboard for Discord and Slack communities. Need hands-on user interviews and validation with real community managers.',
    '100 active community managers trialing the tool with measurable retention.',
    ARRAY['Growth Marketing', 'Community Building', 'Content Strategy'],
    ARRAY['Customer Discovery', 'Product Analytics', 'Copywriting'],
    'customer_discovery',
    500,
    '3 months',
    'public',
    'active'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Missing Pieces
INSERT INTO public.goal_missing_pieces (
    goal_id, missing_skill_or_resource, reason, suggested_next_action, related_tags, confidence_score, status
) VALUES 
(
    'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
    'UI/UX Design',
    'Developer tools require intuitive interaction patterns to prevent cognitive overload during PR reviews.',
    'Connect with a product designer who has experience building developer or productivity tools.',
    ARRAY['Figma', 'UI/UX Design', 'Design Systems'],
    0.95,
    'accepted'
),
(
    'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
    'Beta Tester Community',
    'Early feedback from real engineering leads is critical to tune signal-to-noise ratio in AI code reviews.',
    'Partner with a technical community builder or launch in developer-focused circles.',
    ARRAY['Community Building', 'Customer Discovery', 'Beta Testing'],
    0.90,
    'suggested'
),
(
    'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb',
    'Frontend Implementation (React/Tailwind)',
    'Figma designs need to be translated into accessible, tokenized React components.',
    'Collaborate with a frontend developer passionate about component architecture.',
    ARRAY['React', 'TypeScript', 'Tailwind CSS'],
    0.98,
    'accepted'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Offers
INSERT INTO public.offers (
    id, user_id, title, description, category, skills, offer_type, delivery_format, pricing_model, price, status
) VALUES 
(
    'dddddddd-dddd-4ddd-dddd-dddddddddddd',
    '22222222-2222-4222-a222-222222222222',
    'High-Conversion MVP Product Design & Figma Prototyping',
    'I help technical founders turn backend logic and wireframes into polished, ready-to-code design systems and interactive prototypes.',
    'Design',
    ARRAY['UI/UX Design', 'Figma', 'Design Systems', 'User Research'],
    'paid_service',
    'remote',
    'fixed',
    750,
    'active'
),
(
    'eeeeeeee-eeee-4eee-eeee-eeeeeeeeeeee',
    '33333333-3333-4333-a333-333333333333',
    'Zero-to-One Growth Strategy & Early Adopter Playbook',
    'Hands-on guidance to find your first 50-500 customers without paid ads. Includes messaging audit and targeted outbound sequence design.',
    'Marketing',
    ARRAY['Growth Marketing', 'Customer Discovery', 'Cold Outreach', 'Community Building'],
    'mentorship',
    'remote',
    'hourly',
    80,
    'active'
),
(
    'ffffffff-ffff-4fff-ffff-ffffffffffff',
    '11111111-1111-4111-a111-111111111111',
    'Full-Stack Architecture & API Code Review',
    'Offering free architectural audits for fellow startup builders. I review database schema, Next.js setups, and API security.',
    'Engineering',
    ARRAY['Next.js', 'TypeScript', 'PostgreSQL', 'API Design'],
    'free_help',
    'remote',
    'free',
    0,
    'active'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Connection Request
INSERT INTO public.connection_requests (
    id, sender_id, recipient_id, goal_id, offer_id, message, status
) VALUES (
    '77777777-7777-4777-a777-777777777777',
    '11111111-1111-4111-a111-111111111111',
    '22222222-2222-4222-a222-222222222222',
    'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
    'dddddddd-dddd-4ddd-dddd-dddddddddddd',
    'Hi Marcus, I saw your design systems work. I am building an AI PR reviewer and need help crafting a clean review interface. Would love to collaborate!',
    'accepted'
) ON CONFLICT (id) DO NOTHING;

-- Seed Connection
INSERT INTO public.connections (id, user1_id, user2_id, request_id)
VALUES (
    '88888888-8888-4888-a888-888888888888',
    '11111111-1111-4111-a111-111111111111',
    '22222222-2222-4222-a222-222222222222',
    '77777777-7777-4777-a777-777777777777'
) ON CONFLICT (id) DO NOTHING;

-- Seed Conversation
INSERT INTO public.conversations (id, title, goal_id)
VALUES (
    '99999999-9999-4999-a999-999999999999',
    'Elena & Marcus: Code Review UI',
    'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.conversation_members (conversation_id, user_id)
VALUES 
    ('99999999-9999-4999-a999-999999999999', '11111111-1111-4111-a111-111111111111'),
    ('99999999-9999-4999-a999-999999999999', '22222222-2222-4222-a222-222222222222')
ON CONFLICT DO NOTHING;

-- Seed Messages
INSERT INTO public.messages (conversation_id, sender_id, content)
VALUES 
    ('99999999-9999-4999-a999-999999999999', '11111111-1111-4111-a111-111111111111', 'Excited to connect Marcus! I have the repository ready.'),
    ('99999999-9999-4999-a999-999999999999', '22222222-2222-4222-a222-222222222222', 'Awesome! I can start putting together initial wireframes for the PR comment diff view.')
ON CONFLICT DO NOTHING;

-- Seed Collaboration Workspace
INSERT INTO public.collaborations (
    id, title, description, goal_id, created_by, status, progress_summary, start_date, target_date
) VALUES (
    'c011ab00-0000-4000-a000-000000000001',
    'Code Review Companion Design & Frontend Sprint',
    'Joint collaboration between Elena and Marcus to finalize UI mockups and implement the primary review panel.',
    'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-4111-a111-111111111111',
    'active',
    'Wireframes drafted; component tokens exported from Figma.',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.collaboration_members (collaboration_id, user_id, role)
VALUES 
    ('c011ab00-0000-4000-a000-000000000001', '11111111-1111-4111-a111-111111111111', 'lead'),
    ('c011ab00-0000-4000-a000-000000000001', '22222222-2222-4222-a222-222222222222', 'member')
ON CONFLICT DO NOTHING;

-- Seed Tasks
INSERT INTO public.tasks (collaboration_id, title, description, assignee_id, created_by, status, priority, due_date)
VALUES 
(
    'c011ab00-0000-4000-a000-000000000001',
    'Audit Existing PR Flow & Draft User Journey Map',
    'Identify friction points when developers inspect AI-generated code suggestions.',
    '22222222-2222-4222-a222-222222222222',
    '11111111-1111-4111-a111-111111111111',
    'done',
    'high',
    CURRENT_DATE + INTERVAL '3 days'
),
(
    'c011ab00-0000-4000-a000-000000000001',
    'Create Figma Component Tokens for Diff Viewer',
    'Define colors, typography, and spacing for diff syntax highlighting.',
    '22222222-2222-4222-a222-222222222222',
    '22222222-2222-4222-a222-222222222222',
    'in_progress',
    'high',
    CURRENT_DATE + INTERVAL '7 days'
),
(
    'c011ab00-0000-4000-a000-000000000001',
    'Integrate Tailwind Components into Next.js App',
    'Hook up the diff viewer components with the live backend parser.',
    '11111111-1111-4111-a111-111111111111',
    '11111111-1111-4111-a111-111111111111',
    'todo',
    'medium',
    CURRENT_DATE + INTERVAL '14 days'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Milestones
INSERT INTO public.milestones (collaboration_id, title, description, due_date, status)
VALUES 
(
    'c011ab00-0000-4000-a000-000000000001',
    'Milestone 1: Design Specification & Prototype Signoff',
    'Figma prototype approved by both engineering and user testing group.',
    CURRENT_DATE + INTERVAL '10 days',
    'in_progress'
),
(
    'c011ab00-0000-4000-a000-000000000001',
    'Milestone 2: Functional Frontend Integration',
    'All UI screens connected to Supabase and API endpoints.',
    CURRENT_DATE + INTERVAL '25 days',
    'pending'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Notifications
INSERT INTO public.notifications (user_id, actor_id, type, title, message, resource_type, resource_id)
VALUES (
    '11111111-1111-4111-a111-111111111111',
    '22222222-2222-4222-a222-222222222222',
    'task_update',
    'Task Completed',
    'Marcus completed the task: "Audit Existing PR Flow & Draft User Journey Map"',
    'collaboration',
    'c011ab00-0000-4000-a000-000000000001'
) ON CONFLICT (id) DO NOTHING;
