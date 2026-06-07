'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Plus, Calendar, CheckSquare } from 'lucide-react';
import Button from '@/components/ui/Button';
import { createTask } from '@/hooks/useTasks';
import { formatDate } from '@/utils/dates';
import toast from 'react-hot-toast';

function AiMessage({ message, onAction }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-fade-in`}>
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
        ${isUser ? 'bg-slate-100 dark:bg-slate-800 text-[var(--text-primary)]' : 'gradient-bg text-white shadow-glow'}
      `}>
        {isUser ? <span className="text-xs font-medium">You</span> : <Sparkles className="w-4 h-4" />}
      </div>
      
      <div className={`
        flex flex-col max-w-[80%]
        ${isUser ? 'items-end' : 'items-start'}
      `}>
        <div className={`
          px-4 py-2.5 rounded-2xl text-sm
          ${isUser 
            ? 'bg-slate-100 dark:bg-slate-800 text-[var(--text-primary)] rounded-tr-sm' 
            : 'bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] rounded-tl-sm shadow-sm'}
        `}>
          {message.content}
        </div>
        
        {message.parsedTask && (
          <div className="mt-2 w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 shadow-sm">
            <h4 className="font-semibold text-sm mb-1">{message.parsedTask.title}</h4>
            {message.parsedTask.description && (
              <p className="text-xs text-[var(--text-secondary)] mb-2 line-clamp-2">{message.parsedTask.description}</p>
            )}
            
            <div className="flex flex-wrap gap-2 mb-3">
              {message.parsedTask.dueDate && (
                <span className="flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[var(--text-secondary)]">
                  <Calendar className="w-3 h-3" />
                  {formatDate(message.parsedTask.dueDate)}
                </span>
              )}
              {message.parsedTask.priority && (
                <span className="flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[var(--text-secondary)] capitalize">
                  {message.parsedTask.priority} priority
                </span>
              )}
            </div>

            {message.parsedTask.subtasks?.length > 0 && (
              <div className="mb-3 space-y-1">
                <p className="text-xs font-medium text-[var(--text-primary)] mb-1">Subtasks:</p>
                {message.parsedTask.subtasks.map((st, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                    <CheckSquare className="w-3 h-3 text-[var(--text-muted)]" />
                    <span className="truncate">{st.title}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Button size="sm" className="flex-1 text-xs py-1" onClick={() => onAction('create', message.parsedTask)}>
                <Plus className="w-3 h-3" /> Create Task
              </Button>
            </div>
          </div>
        )}

        {message.parsedTasks && (
          <div className="mt-2 w-full space-y-2">
            {message.parsedTasks.map((task, idx) => (
              <div key={idx} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
                <h4 className="font-semibold text-sm mb-1">{task.title}</h4>
                <p className="text-xs text-[var(--text-secondary)] mb-2 line-clamp-1">{task.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded capitalize text-[var(--text-secondary)]">
                    {task.tags?.[0] || 'Task'}
                  </span>
                  <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-bold">
                    {task.assigneeIds?.[0]?.replace('mock-user-', 'U') || 'U'}
                  </div>
                </div>
              </div>
            ))}
            <Button size="sm" className="w-full text-xs py-1 mt-2" onClick={() => onAction('create', message.parsedTasks)}>
              <Plus className="w-3 h-3 mr-1" /> Distribute All Tasks
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AiChatPanel({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your Office AI. I can help distribute tasks, summarize meetings, or draft individual assignments." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  async function handleSubmit(e, overrideInput = null) {
    if (e) e.preventDefault();
    const textToProcess = overrideInput || input;
    if (!textToProcess.trim() || isLoading) return;

    const userMessage = { role: 'user', content: textToProcess };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const isMeetingNotes = textToProcess.toLowerCase().includes('meeting') || textToProcess.toLowerCase().includes('transcript');
      const endpoint = isMeetingNotes ? '/api/ai/meeting-notes' : '/api/ai/parse-task';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userMessage.content }),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to process');

      if (isMeetingNotes && data.tasks) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "I've analyzed the meeting notes and generated these tasks for the team. Shall I add them?",
          parsedTasks: data.tasks
        }]);
      } else if (data.parsed && data.parsed.title) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "I've drafted a task based on what you said. How does this look?",
          parsedTask: data.parsed
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "I'm not quite sure how to process that. Could you be more specific?"
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I ran into an error processing that. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAction(action, taskData) {
    if (action === 'create') {
      try {
        if (Array.isArray(taskData)) {
          // If bulk tasks (from meeting notes)
          await Promise.all(taskData.map(t => createTask(t)));
          toast.success(`${taskData.length} team tasks created!`);
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `Great! I've distributed all ${taskData.length} tasks to the team.`
          }]);
        } else {
          // Single task
          const payload = {
            ...taskData,
            subtasks: taskData.subtasks?.map(st => ({ title: st.title, done: false })) || []
          };
          await createTask(payload);
          toast.success('Task created and assigned!');
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `Great! I've created the task "${taskData.title}".`
          }]);
        }
      } catch (error) {
        // error handled in hook
      }
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Slide-out panel */}
      <div className={`
        fixed top-0 right-0 h-screen w-full sm:w-[400px] z-50
        bg-[var(--surface)] border-l border-[var(--border)]
        shadow-2xl flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-bg shadow-glow flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-lg text-[var(--text-primary)]">AI Assistant</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <AiMessage key={i} message={msg} onAction={handleAction} />
          ))}
          
          {messages.length === 1 && !isLoading && (
            <div className="flex flex-wrap gap-2 mt-4 animate-fade-in">
              <button onClick={() => handleSubmit(null, "Summarize yesterday's meeting notes and create tasks")} className="text-xs bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 px-3 py-1.5 rounded-full border border-brand-200 dark:border-brand-500/20 hover:bg-brand-100 transition-colors">
                📝 Process Meeting Notes
              </button>
              <button onClick={() => handleSubmit(null, "Distribute tasks for the Q3 Launch Project")} className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-3 py-1.5 rounded-full border border-[var(--border)] hover:bg-slate-200 transition-colors">
                🎯 Distribute Project Work
              </button>
            </div>
          )}

          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full gradient-bg shadow-glow flex items-center justify-center text-white flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[var(--surface-elevated)] border border-[var(--border)]">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[var(--surface)] border-t border-[var(--border)]">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI to create a task..."
              className="w-full bg-[var(--surface-elevated)] border border-[var(--border)] rounded-full pl-4 pr-12 py-3 text-sm focus-ring outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 rounded-full text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
