'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { store } from '@/lib/data-provider';
import { Collaboration, Task, Milestone, ProgressUpdate } from '@/types/database';
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  Plus,
  ArrowLeft,
  Calendar,
  MessageSquare,
  AlertCircle,
  Flag,
} from 'lucide-react';

export default function CollaborationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const collabId = params?.id as string;

  const [collab, setCollab] = useState<Collaboration | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);

  // Task creation state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium');

  // Milestone creation state
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');

  // Update creation state
  const [newUpdateContent, setNewUpdateContent] = useState('');

  const loadData = () => {
    if (!collabId) return;
    const c = store.getCollaborationById(collabId);
    if (!c) {
      router.push('/collaborations');
      return;
    }
    setCollab(c);
    setTasks(store.getTasks(collabId));
    setMilestones(store.getMilestones(collabId));
    setUpdates(store.getProgressUpdates(collabId));
  };

  useEffect(() => {
    loadData();
  }, [collabId, router]);

  if (!collab) return <div className="p-8 text-center text-slate-500">Loading collaboration workspace...</div>;

  const handleTaskToggle = (taskId: string, currentStatus: Task['status']) => {
    const nextStatus = currentStatus === 'done' ? 'todo' : 'done';
    store.updateTaskStatus(taskId, nextStatus);
    loadData();
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    store.createTask({
      collaboration_id: collabId,
      title: newTaskTitle.trim(),
      description: null,
      assignee_id: store.currentUserId,
      status: 'todo',
      priority: newTaskPriority,
      due_date: null,
    });

    setNewTaskTitle('');
    setShowTaskModal(false);
    loadData();
  };

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;

    store.createMilestone({
      collaboration_id: collabId,
      title: newMilestoneTitle.trim(),
      description: null,
      due_date: null,
      status: 'pending',
    });

    setNewMilestoneTitle('');
    setShowMilestoneModal(false);
    loadData();
  };

  const handlePostUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdateContent.trim()) return;

    store.createProgressUpdate(collabId, newUpdateContent.trim());
    setNewUpdateContent('');
    loadData();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Back button & Title */}
      <div className="flex items-center justify-between">
        <Link href="/collaborations" className="text-xs text-slate-500 hover:text-navy-950 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Workspaces
        </Link>
        <Badge variant="success" size="md">{collab.status}</Badge>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardBody className="p-6 sm:p-8 space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
            {collab.title}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {collab.description || 'Shared collaboration workspace for milestone tracking and project execution.'}
          </p>
          {collab.goal && (
            <div className="pt-2">
              <span className="text-xs text-slate-500">
                Connected Goal: <strong className="text-navy-900">{collab.goal.title}</strong>
              </span>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Main Grid: Tasks & Milestones on Left, Progress Updates on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Tasks & Milestones */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tasks Board */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-navy-950">Tasks & Deliverables</h2>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowTaskModal(!showTaskModal)} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add Task
              </Button>
            </CardHeader>
            <CardBody className="p-5 space-y-4">
              {showTaskModal && (
                <form onSubmit={handleCreateTask} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-navy-950 uppercase">New Task</h4>
                  <input
                    type="text"
                    required
                    placeholder="Task title (e.g. Wireframe diff viewer modal)"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                  <div className="flex items-center justify-between">
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as any)}
                      className="px-2.5 py-1 text-xs rounded border border-slate-300 bg-white"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent</option>
                    </select>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" type="button" onClick={() => setShowTaskModal(false)}>Cancel</Button>
                      <Button variant="primary" size="sm" type="submit">Create</Button>
                    </div>
                  </div>
                </form>
              )}

              {tasks.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No tasks added yet. Create a task to start tracking execution.</p>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleTaskToggle(task.id, task.status)}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        task.status === 'done'
                          ? 'bg-slate-50/70 border-slate-200'
                          : 'bg-white border-slate-200 hover:border-navy-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                          task.status === 'done' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-300'
                        }`}>
                          {task.status === 'done' && '✓'}
                        </div>
                        <span className={`text-xs font-medium ${task.status === 'done' ? 'line-through text-slate-400' : 'text-navy-950'}`}>
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant={task.priority === 'high' ? 'danger' : 'slate'} size="sm">
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Milestones */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-gold-600" />
                <h2 className="text-base font-bold text-navy-950">Key Milestones</h2>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowMilestoneModal(!showMilestoneModal)} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add Milestone
              </Button>
            </CardHeader>
            <CardBody className="p-5 space-y-4">
              {showMilestoneModal && (
                <form onSubmit={handleCreateMilestone} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Milestone title (e.g. Beta signoff with 10 engineers)"
                    value={newMilestoneTitle}
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" type="button" onClick={() => setShowMilestoneModal(false)}>Cancel</Button>
                    <Button variant="primary" size="sm" type="submit">Add Milestone</Button>
                  </div>
                </form>
              )}

              {milestones.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No milestones defined yet.</p>
              ) : (
                <div className="space-y-3">
                  {milestones.map((ms) => (
                    <div key={ms.id} className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-navy-950">{ms.title}</h4>
                        <span className="text-[11px] text-slate-400">Target: {ms.due_date || 'Flexible'}</span>
                      </div>
                      <Badge variant={ms.status === 'completed' ? 'success' : 'gold'} size="sm">
                        {ms.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Progress Updates Feed */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-base font-bold text-navy-950">Collaboration Progress Updates</h2>
            </CardHeader>
            <CardBody className="p-5 space-y-4">
              <form onSubmit={handlePostUpdate} className="space-y-2">
                <textarea
                  rows={3}
                  required
                  placeholder="Share a progress update or blocking question with participants..."
                  value={newUpdateContent}
                  onChange={(e) => setNewUpdateContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-900"
                />
                <div className="flex justify-end">
                  <Button variant="primary" size="sm" type="submit">
                    Post Update
                  </Button>
                </div>
              </form>

              <div className="border-t border-slate-100 pt-3 space-y-3">
                {updates.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No updates posted yet.</p>
                ) : (
                  updates.map((u) => (
                    <div key={u.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <strong className="text-navy-950">{u.author?.display_name || 'Member'}</strong>
                        <span className="text-slate-400">
                          {new Date(u.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{u.content}</p>
                    </div>
                  ))
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
