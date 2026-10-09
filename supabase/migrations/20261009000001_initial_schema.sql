-- ==============================================================================
-- CONNECTING THE DOTS: INITIAL DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    headline TEXT,
    bio TEXT,
    avatar_url TEXT,
    skills TEXT[] DEFAULT '{}',
    areas_of_interest TEXT[] DEFAULT '{}',
    can_help_with TEXT[] DEFAULT '{}',
    seeking_help_with TEXT[] DEFAULT '{}',
    collaboration_styles TEXT[] DEFAULT '{}',
    location TEXT,
    is_remote_only BOOLEAN DEFAULT TRUE,
    is_discoverable BOOLEAN DEFAULT TRUE,
    portfolio_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexing for profile discovery
CREATE INDEX IF NOT EXISTS idx_profiles_skills ON public.profiles USING GIN (skills);
CREATE INDEX IF NOT EXISTS idx_profiles_discoverable ON public.profiles (is_discoverable);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);

-- 2. GOALS TABLE
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('build_idea', 'task_help', 'first_users', 'custom')),
    description TEXT NOT NULL,
    desired_outcome TEXT NOT NULL,
    current_progress TEXT,
    available_skills TEXT[] DEFAULT '{}',
    missing_skills TEXT[] DEFAULT '{}',
    help_needed_type TEXT,
    collaboration_style TEXT NOT NULL CHECK (collaboration_style IN ('paid', 'skill_exchange', 'joint_project', 'mentorship', 'feedback', 'customer_discovery', 'community')),
    budget NUMERIC CHECK (budget >= 0),
    currency VARCHAR(3) DEFAULT 'USD',
    timeline TEXT,
    location_preference TEXT,
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'connections_only')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals (user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON public.goals (status);
CREATE INDEX IF NOT EXISTS idx_goals_category ON public.goals (category);
CREATE INDEX IF NOT EXISTS idx_goals_missing_skills ON public.goals USING GIN (missing_skills);

-- 3. GOAL MISSING PIECES (Deterministic discovery engine suggestions & user-defined items)
CREATE TABLE IF NOT EXISTS public.goal_missing_pieces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
    missing_skill_or_resource TEXT NOT NULL,
    reason TEXT NOT NULL,
    suggested_next_action TEXT NOT NULL,
    related_tags TEXT[] DEFAULT '{}',
    confidence_score NUMERIC DEFAULT 0.85,
    status TEXT NOT NULL DEFAULT 'suggested' CHECK (status IN ('suggested', 'accepted', 'resolved', 'dismissed')),
    is_custom BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_goal_missing_pieces_goal_id ON public.goal_missing_pieces (goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_missing_pieces_status ON public.goal_missing_pieces (status);

-- 4. OFFERS AND SERVICES
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    skills TEXT[] DEFAULT '{}',
    offer_type TEXT NOT NULL CHECK (offer_type IN ('paid_service', 'free_help', 'mentorship', 'skill_exchange', 'project_collaboration', 'business_support', 'feedback_review')),
    delivery_format TEXT NOT NULL DEFAULT 'remote' CHECK (delivery_format IN ('remote', 'in_person', 'hybrid')),
    pricing_model TEXT NOT NULL CHECK (pricing_model IN ('fixed', 'hourly', 'negotiable', 'free', 'not_specified')),
    price NUMERIC CHECK (price >= 0),
    currency VARCHAR(3) DEFAULT 'USD',
    portfolio_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_offers_user_id ON public.offers (user_id);
CREATE INDEX IF NOT EXISTS idx_offers_skills ON public.offers USING GIN (skills);
CREATE INDEX IF NOT EXISTS idx_offers_type ON public.offers (offer_type);
CREATE INDEX IF NOT EXISTS idx_offers_status ON public.offers (status);

-- 5. CONNECTION REQUESTS
CREATE TABLE IF NOT EXISTS public.connection_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
    offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_no_self_request CHECK (sender_id <> recipient_id)
);

CREATE INDEX IF NOT EXISTS idx_requests_sender ON public.connection_requests (sender_id);
CREATE INDEX IF NOT EXISTS idx_requests_recipient ON public.connection_requests (recipient_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.connection_requests (status);

-- Prevent duplicate active pending requests between same sender and recipient for a given goal/general
CREATE UNIQUE INDEX IF NOT EXISTS uq_pending_connection_request 
ON public.connection_requests (sender_id, recipient_id, COALESCE(goal_id, '00000000-0000-0000-0000-000000000000'::uuid))
WHERE status = 'pending';

-- 6. CONNECTIONS (Mutual accepted relationships)
CREATE TABLE IF NOT EXISTS public.connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    request_id UUID REFERENCES public.connection_requests(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_no_self_connection CHECK (user1_id <> user2_id),
    CONSTRAINT uq_connection_pair UNIQUE (user1_id, user2_id)
);

CREATE INDEX IF NOT EXISTS idx_connections_user1 ON public.connections (user1_id);
CREATE INDEX IF NOT EXISTS idx_connections_user2 ON public.connections (user2_id);

-- 7. CONVERSATIONS & MEMBERS
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.conversation_members (
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    last_read_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_convo_members_user ON public.conversation_members (user_id);

-- 8. MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages (conversation_id, created_at ASC);

-- 9. COLLABORATIONS & MEMBERS
CREATE TABLE IF NOT EXISTS public.collaborations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('proposed', 'active', 'paused', 'completed', 'cancelled')),
    progress_summary TEXT,
    start_date DATE,
    target_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.collaboration_members (
    collaboration_id UUID NOT NULL REFERENCES public.collaborations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('lead', 'member')),
    PRIMARY KEY (collaboration_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_collab_members_user ON public.collaboration_members (user_id);

-- 10. TASKS & MILESTONES
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collaboration_id UUID NOT NULL REFERENCES public.collaborations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_tasks_collab ON public.tasks (collaboration_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON public.tasks (assignee_id);

CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collaboration_id UUID NOT NULL REFERENCES public.collaborations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_milestones_collab ON public.milestones (collaboration_id);

-- 11. PROGRESS UPDATES
CREATE TABLE IF NOT EXISTS public.progress_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collaboration_id UUID NOT NULL REFERENCES public.collaborations(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_progress_updates_collab ON public.progress_updates (collaboration_id);

-- 12. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    resource_type TEXT,
    resource_id UUID,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications (user_id, is_read, created_at DESC);

-- 13. REPORTS & MODERATION
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL CHECK (target_type IN ('profile', 'goal', 'offer', 'message')),
    target_id UUID NOT NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'action_taken', 'dismissed')),
    admin_notes TEXT,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports (status);

-- ==============================================================================
-- DATABASE TRIGGERS & PROCEDURES
-- ==============================================================================

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_goals_updated_at BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_goal_missing_pieces_updated_at BEFORE UPDATE ON public.goal_missing_pieces FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_offers_updated_at BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_connection_requests_updated_at BEFORE UPDATE ON public.connection_requests FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_collaborations_updated_at BEFORE UPDATE ON public.collaborations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_milestones_updated_at BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to prevent non-admins from changing their own role
CREATE OR REPLACE FUNCTION public.prevent_unauthorized_role_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role <> OLD.role THEN
        -- Only allow role change if performed by a verified admin
        IF NOT EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        ) THEN
            RAISE EXCEPTION 'Unauthorized: Only administrators can modify roles.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_prevent_role_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_unauthorized_role_change();

-- Trigger to handle auth.users signup -> profiles creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        display_name,
        headline,
        bio,
        avatar_url,
        role
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'headline', 'New Community Member'),
        '',
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        'user'
    ) ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Secure function to accept a connection request in a single transaction
CREATE OR REPLACE FUNCTION public.accept_connection(p_request_id UUID)
RETURNS UUID AS $$
DECLARE
    v_req RECORD;
    v_u1 UUID;
    v_u2 UUID;
    v_conn_id UUID;
    v_convo_id UUID;
BEGIN
    -- Select and lock request
    SELECT * INTO v_req FROM public.connection_requests
    WHERE id = p_request_id AND status = 'pending'
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Connection request not found or not in pending status';
    END IF;

    -- Verify current user is recipient
    IF v_req.recipient_id <> auth.uid() THEN
        RAISE EXCEPTION 'Only the recipient can accept a connection request';
    END IF;

    -- Update request status
    UPDATE public.connection_requests
    SET status = 'accepted', responded_at = now()
    WHERE id = p_request_id;

    -- Normalize user ordering for connections table
    IF v_req.sender_id < v_req.recipient_id THEN
        v_u1 := v_req.sender_id;
        v_u2 := v_req.recipient_id;
    ELSE
        v_u1 := v_req.recipient_id;
        v_u2 := v_req.sender_id;
    END IF;

    -- Insert connection record
    INSERT INTO public.connections (user1_id, user2_id, request_id)
    VALUES (v_u1, v_u2, p_request_id)
    ON CONFLICT (user1_id, user2_id) DO NOTHING
    RETURNING id INTO v_conn_id;

    -- Create or link conversation
    INSERT INTO public.conversations (title, goal_id)
    VALUES ('Direct Message', v_req.goal_id)
    RETURNING id INTO v_convo_id;

    -- Add members
    INSERT INTO public.conversation_members (conversation_id, user_id)
    VALUES 
        (v_convo_id, v_req.sender_id),
        (v_convo_id, v_req.recipient_id)
    ON CONFLICT DO NOTHING;

    -- Create acceptance notification for sender
    INSERT INTO public.notifications (
        user_id,
        actor_id,
        type,
        title,
        message,
        resource_type,
        resource_id
    ) VALUES (
        v_req.sender_id,
        v_req.recipient_id,
        'connection_accepted',
        'Connection Request Accepted',
        'Your connection request has been accepted. You can now collaborate and message.',
        'conversation',
        v_convo_id
    );

    RETURN v_convo_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_missing_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
CREATE POLICY "Public profiles are visible to all users"
ON public.profiles FOR SELECT
USING (is_discoverable = TRUE OR id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- 2. GOALS POLICIES
CREATE POLICY "Users can read public goals or their own"
ON public.goals FOR SELECT
USING (
    visibility = 'public' 
    OR user_id = auth.uid()
    OR (
        visibility = 'connections_only' AND EXISTS (
            SELECT 1 FROM public.connections
            WHERE (user1_id = auth.uid() AND user2_id = goals.user_id)
               OR (user2_id = auth.uid() AND user1_id = goals.user_id)
        )
    )
);

CREATE POLICY "Users can create their own goals"
ON public.goals FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own goals"
ON public.goals FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own goals"
ON public.goals FOR DELETE
USING (user_id = auth.uid());

-- 3. GOAL MISSING PIECES POLICIES
CREATE POLICY "Users can view missing pieces of accessible goals"
ON public.goal_missing_pieces FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.goals
        WHERE goals.id = goal_missing_pieces.goal_id
          AND (goals.visibility = 'public' OR goals.user_id = auth.uid())
    )
);

CREATE POLICY "Goal owners can insert missing pieces"
ON public.goal_missing_pieces FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.goals
        WHERE goals.id = goal_missing_pieces.goal_id
          AND goals.user_id = auth.uid()
    )
);

CREATE POLICY "Goal owners can update missing pieces"
ON public.goal_missing_pieces FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.goals
        WHERE goals.id = goal_missing_pieces.goal_id
          AND goals.user_id = auth.uid()
    )
);

CREATE POLICY "Goal owners can delete missing pieces"
ON public.goal_missing_pieces FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.goals
        WHERE goals.id = goal_missing_pieces.goal_id
          AND goals.user_id = auth.uid()
    )
);

-- 4. OFFERS POLICIES
CREATE POLICY "Public can view active offers or owner can view all"
ON public.offers FOR SELECT
USING (status = 'active' OR user_id = auth.uid());

CREATE POLICY "Users can create their own offers"
ON public.offers FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own offers"
ON public.offers FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own offers"
ON public.offers FOR DELETE
USING (user_id = auth.uid());

-- 5. CONNECTION REQUESTS POLICIES
CREATE POLICY "Participants can view their connection requests"
ON public.connection_requests FOR SELECT
USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can create connection requests as sender"
ON public.connection_requests FOR INSERT
WITH CHECK (sender_id = auth.uid() AND sender_id <> recipient_id);

CREATE POLICY "Recipients can respond and senders can cancel"
ON public.connection_requests FOR UPDATE
USING (
    (recipient_id = auth.uid() AND status = 'pending')
    OR (sender_id = auth.uid() AND status = 'pending')
);

-- 6. CONNECTIONS POLICIES
CREATE POLICY "Connected users can view their connections"
ON public.connections FOR SELECT
USING (user1_id = auth.uid() OR user2_id = auth.uid());

-- 7. CONVERSATIONS & MEMBERS POLICIES
CREATE POLICY "Conversation members can view conversations"
ON public.conversations FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.conversation_members
        WHERE conversation_members.conversation_id = conversations.id
          AND conversation_members.user_id = auth.uid()
    )
);

CREATE POLICY "Conversation members can view member lists"
ON public.conversation_members FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.conversation_members cm2
        WHERE cm2.conversation_id = conversation_members.conversation_id
          AND cm2.user_id = auth.uid()
    )
);

-- 8. MESSAGES POLICIES
CREATE POLICY "Conversation members can read messages"
ON public.messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.conversation_members
        WHERE conversation_members.conversation_id = messages.conversation_id
          AND conversation_members.user_id = auth.uid()
    )
);

CREATE POLICY "Conversation members can send messages"
ON public.messages FOR INSERT
WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
        SELECT 1 FROM public.conversation_members
        WHERE conversation_members.conversation_id = messages.conversation_id
          AND conversation_members.user_id = auth.uid()
    )
);

-- 9. COLLABORATIONS POLICIES
CREATE POLICY "Collaboration members can view collaborations"
ON public.collaborations FOR SELECT
USING (
    created_by = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.collaboration_members
        WHERE collaboration_members.collaboration_id = collaborations.id
          AND collaboration_members.user_id = auth.uid()
    )
);

CREATE POLICY "Authenticated users can create collaborations"
ON public.collaborations FOR INSERT
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Collaboration leads or creators can update collaborations"
ON public.collaborations FOR UPDATE
USING (
    created_by = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.collaboration_members
        WHERE collaboration_members.collaboration_id = collaborations.id
          AND collaboration_members.user_id = auth.uid()
          AND collaboration_members.role = 'lead'
    )
);

CREATE POLICY "Members can view collaboration participants"
ON public.collaboration_members FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.collaboration_members cm2
        WHERE cm2.collaboration_id = collaboration_members.collaboration_id
          AND cm2.user_id = auth.uid()
    )
    OR EXISTS (
        SELECT 1 FROM public.collaborations c
        WHERE c.id = collaboration_members.collaboration_id
          AND c.created_by = auth.uid()
    )
);

CREATE POLICY "Creator or lead can add members"
ON public.collaboration_members FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.collaborations c
        WHERE c.id = collaboration_members.collaboration_id
          AND c.created_by = auth.uid()
    )
);

-- 10. TASKS & MILESTONES POLICIES
CREATE POLICY "Collaboration members can view tasks"
ON public.tasks FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.collaboration_members
        WHERE collaboration_members.collaboration_id = tasks.collaboration_id
          AND collaboration_members.user_id = auth.uid()
    )
);

CREATE POLICY "Collaboration members can create tasks"
ON public.tasks FOR INSERT
WITH CHECK (
    created_by = auth.uid()
    AND EXISTS (
        SELECT 1 FROM public.collaboration_members
        WHERE collaboration_members.collaboration_id = tasks.collaboration_id
          AND collaboration_members.user_id = auth.uid()
    )
);

CREATE POLICY "Collaboration members can update tasks"
ON public.tasks FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.collaboration_members
        WHERE collaboration_members.collaboration_id = tasks.collaboration_id
          AND collaboration_members.user_id = auth.uid()
    )
);

CREATE POLICY "Collaboration members can view milestones"
ON public.milestones FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.collaboration_members
        WHERE collaboration_members.collaboration_id = milestones.collaboration_id
          AND collaboration_members.user_id = auth.uid()
    )
);

CREATE POLICY "Collaboration members can create milestones"
ON public.milestones FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.collaboration_members
        WHERE collaboration_members.collaboration_id = milestones.collaboration_id
          AND collaboration_members.user_id = auth.uid()
    )
);

CREATE POLICY "Collaboration members can update milestones"
ON public.milestones FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.collaboration_members
        WHERE collaboration_members.collaboration_id = milestones.collaboration_id
          AND collaboration_members.user_id = auth.uid()
    )
);

-- 11. PROGRESS UPDATES POLICIES
CREATE POLICY "Collaboration members can view progress updates"
ON public.progress_updates FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.collaboration_members
        WHERE collaboration_members.collaboration_id = progress_updates.collaboration_id
          AND collaboration_members.user_id = auth.uid()
    )
);

CREATE POLICY "Collaboration members can create progress updates"
ON public.progress_updates FOR INSERT
WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
        SELECT 1 FROM public.collaboration_members
        WHERE collaboration_members.collaboration_id = progress_updates.collaboration_id
          AND collaboration_members.user_id = auth.uid()
    )
);

-- 12. NOTIFICATIONS POLICIES
CREATE POLICY "Users can only view their own notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications (mark read)"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 13. REPORTS POLICIES
CREATE POLICY "Users can create reports"
ON public.reports FOR INSERT
WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Only admins can view reports"
ON public.reports FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

CREATE POLICY "Only admins can update reports"
ON public.reports FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);
