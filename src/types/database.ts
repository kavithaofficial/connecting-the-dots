export type GoalCategory = 'build_idea' | 'task_help' | 'first_users' | 'custom';
export type CollaborationStyle = 'paid' | 'skill_exchange' | 'joint_project' | 'mentorship' | 'feedback' | 'customer_discovery' | 'community';
export type GoalVisibility = 'public' | 'private' | 'connections_only';
export type GoalStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';

export type MissingPieceStatus = 'suggested' | 'accepted' | 'resolved' | 'dismissed';

export type OfferType = 'paid_service' | 'free_help' | 'mentorship' | 'skill_exchange' | 'project_collaboration' | 'business_support' | 'feedback_review';
export type DeliveryFormat = 'remote' | 'in_person' | 'hybrid';
export type PricingModel = 'fixed' | 'hourly' | 'negotiable' | 'free' | 'not_specified';
export type OfferStatus = 'active' | 'paused' | 'archived';

export type ConnectionRequestStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';
export type CollaborationStatus = 'proposed' | 'active' | 'paused' | 'completed' | 'cancelled';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type MilestoneStatus = 'pending' | 'in_progress' | 'completed';
export type ReportStatus = 'pending' | 'reviewed' | 'action_taken' | 'dismissed';

export interface Profile {
  id: string;
  display_name: string;
  headline: string | null;
  bio: string | null;
  avatar_url: string | null;
  skills: string[];
  areas_of_interest: string[];
  can_help_with: string[];
  seeking_help_with: string[];
  collaboration_styles: CollaborationStyle[];
  location: string | null;
  is_remote_only: boolean;
  is_discoverable: boolean;
  portfolio_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  category: GoalCategory;
  description: string;
  desired_outcome: string;
  current_progress: string | null;
  available_skills: string[];
  missing_skills: string[];
  help_needed_type: string | null;
  collaboration_style: CollaborationStyle;
  budget: number | null;
  currency: string;
  timeline: string | null;
  location_preference: string | null;
  visibility: GoalVisibility;
  status: GoalStatus;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  missing_pieces?: GoalMissingPiece[];
}

export interface GoalMissingPiece {
  id: string;
  goal_id: string;
  missing_skill_or_resource: string;
  reason: string;
  suggested_next_action: string;
  related_tags: string[];
  confidence_score: number;
  status: MissingPieceStatus;
  is_custom: boolean;
  created_at: string;
  updated_at: string;
}

export interface Offer {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  offer_type: OfferType;
  delivery_format: DeliveryFormat;
  pricing_model: PricingModel;
  price: number | null;
  currency: string;
  portfolio_url: string | null;
  status: OfferStatus;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface ConnectionRequest {
  id: string;
  sender_id: string;
  recipient_id: string;
  goal_id: string | null;
  offer_id: string | null;
  message: string;
  status: ConnectionRequestStatus;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
  sender?: Profile;
  recipient?: Profile;
  goal?: Goal;
  offer?: Offer;
}

export interface Connection {
  id: string;
  user1_id: string;
  user2_id: string;
  request_id: string | null;
  created_at: string;
  partner?: Profile;
}

export interface Conversation {
  id: string;
  title: string | null;
  goal_id: string | null;
  created_at: string;
  updated_at: string;
  members?: Profile[];
  last_message?: Message;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: Profile;
}

export interface Collaboration {
  id: string;
  title: string;
  description: string | null;
  goal_id: string | null;
  created_by: string;
  status: CollaborationStatus;
  progress_summary: string | null;
  start_date: string | null;
  target_date: string | null;
  created_at: string;
  updated_at: string;
  members?: (Profile & { role: 'lead' | 'member' })[];
  goal?: Goal;
}

export interface Task {
  id: string;
  collaboration_id: string;
  title: string;
  description: string | null;
  assignee_id: string | null;
  created_by: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  assignee?: Profile;
}

export interface Milestone {
  id: string;
  collaboration_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: MilestoneStatus;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProgressUpdate {
  id: string;
  collaboration_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  actor_id: string | null;
  type: string;
  title: string;
  message: string;
  resource_type: string | null;
  resource_id: string | null;
  is_read: boolean;
  created_at: string;
  actor?: Profile;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_type: 'profile' | 'goal' | 'offer' | 'message';
  target_id: string;
  reason: string;
  details: string | null;
  status: ReportStatus;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  reporter?: Profile;
}
