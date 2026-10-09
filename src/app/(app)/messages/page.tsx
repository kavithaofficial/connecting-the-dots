'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { store } from '@/lib/data-provider';
import { Conversation, Message, Profile } from '@/types/database';
import { MessageSquare, Send, User, Sparkles } from 'lucide-react';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvoId, setSelectedConvoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputContent, setInputContent] = useState('');
  const currentUserId = store.currentUserId;

  const loadConversations = () => {
    const convos = store.getConversations();
    setConversations(convos);
    if (!selectedConvoId && convos.length > 0) {
      setSelectedConvoId(convos[0].id);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConvoId) {
      setMessages(store.getMessages(selectedConvoId));
    }
  }, [selectedConvoId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConvoId || !inputContent.trim()) return;

    store.sendMessage(selectedConvoId, inputContent);
    setInputContent('');
    setMessages(store.getMessages(selectedConvoId));
    loadConversations();
  };

  const selectedConvo = conversations.find((c) => c.id === selectedConvoId);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-navy-950 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-gold-600" />
          Direct Messages
        </h1>
        <p className="text-xs text-slate-500">
          Private, end-to-end messaging between accepted collaborators.
        </p>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row shadow-sm min-h-0">
        {/* Left side: Conversation List */}
        <div className="w-full md:w-80 border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
              Conversations ({conversations.length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No active conversations yet. Accept or send a connection request to start chatting.
              </div>
            ) : (
              conversations.map((c) => {
                const isSelected = c.id === selectedConvoId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedConvoId(c.id)}
                    className={`w-full text-left p-4 transition-colors flex items-start gap-3 ${
                      isSelected ? 'bg-navy-50/70 border-l-4 border-navy-900' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-navy-900 text-gold-400 font-bold text-xs flex items-center justify-center shrink-0">
                      DM
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-navy-950 truncate">{c.title || 'Direct Chat'}</span>
                        <span className="text-[10px] text-slate-400">Active</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {c.last_message?.content || 'No messages yet'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right side: Active Conversation Chat */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50/30">
          {selectedConvo ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-navy-950">{selectedConvo.title}</h3>
                  <span className="text-[11px] text-slate-400">Private mutual conversation</span>
                </div>
                <Badge variant="success" size="sm">Connected</Badge>
              </div>

              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    Send a message to start collaborating!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender_id === currentUserId;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                            isMe
                              ? 'bg-navy-900 text-white rounded-br-none'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                          }`}
                        >
                          {!isMe && (
                            <span className="block text-[10px] font-bold text-gold-600 mb-0.5">
                              {msg.sender?.display_name || 'Collaborator'}
                            </span>
                          )}
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  required
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  placeholder="Type a message to your collaborator..."
                  className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-900"
                />
                <Button variant="primary" size="sm" type="submit" rightIcon={<Send className="w-3.5 h-3.5 ml-1" />}>
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              Select a conversation to view messages.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
