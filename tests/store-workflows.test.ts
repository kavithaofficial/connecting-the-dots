import { describe, it, expect } from 'vitest';
import { store } from '../src/lib/data-provider';

describe('End-to-End Business Workflows & Data Store', () => {
  it('automatically triggers missing-piece discovery when a goal is created', () => {
    const goal = store.createGoal({
      title: 'Automated Security Scanner MVP',
      category: 'build_idea',
      description: 'Building an automated static analysis security scanner for Python repositories.',
      desired_outcome: 'Ship prototype to 20 dev teams',
      available_skills: ['Python', 'PostgreSQL'],
      missing_skills: ['UI/UX Design', 'Product Marketing'],
      help_needed_type: 'Designer for review panel',
      collaboration_style: 'skill_exchange',
      budget: 0,
      currency: 'USD',
      timeline: '2 months',
      location_preference: 'Remote',
      visibility: 'public',
      status: 'active',
      current_progress: null,
    });

    expect(goal.id).toBeTruthy();
    const pieces = store.getMissingPieces(goal.id);
    expect(pieces.length).toBeGreaterThan(0);
    expect(pieces[0].suggested_next_action).toBeTruthy();
  });

  it('prevents sending a connection request to oneself', () => {
    expect(() => {
      store.createConnectionRequest({
        recipient_id: store.currentUserId,
        message: 'Trying to connect with myself',
      });
    }).toThrow('Cannot send connection request to yourself.');
  });

  it('safely transitions connection requests upon acceptance and creates a conversation', () => {
    // Other user sends request to current user
    const otherUser = store.getProfiles().find((p) => p.id !== store.currentUserId)!;

    // Temporarily switch current user to test acceptance
    const originalUser = store.currentUserId;
    store.currentUserId = otherUser.id;
    const req = store.createConnectionRequest({
      recipient_id: originalUser,
      message: 'Would love to collaborate on your security scanner.',
    });

    // Switch back to recipient
    store.currentUserId = originalUser;
    const accepted = store.respondConnectionRequest(req.id, 'accept');

    expect(accepted.status).toBe('accepted');
    expect(accepted.responded_at).toBeTruthy();

    // Verify conversation was created
    const convos = store.getConversations();
    expect(convos.length).toBeGreaterThan(0);
  });

  it('allows adding and completing collaboration tasks', () => {
    const collab = store.getCollaborations()[0];
    const task = store.createTask({
      collaboration_id: collab.id,
      title: 'Design API Schema specification',
      description: 'Detail request/response contracts',
      assignee_id: store.currentUserId,
      status: 'todo',
      priority: 'high',
      due_date: '2026-11-01',
    });

    expect(task.status).toBe('todo');
    const updated = store.updateTaskStatus(task.id, 'done');
    expect(updated.status).toBe('done');
  });
});
