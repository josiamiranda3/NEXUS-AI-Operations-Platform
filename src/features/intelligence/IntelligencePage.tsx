import React, { useState, useRef, useEffect } from 'react';
import { useNexus } from '../../context/NexusContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Sparkles,
  Send,
  Copy,
  Check,
  Trash2,
  PlusCircle,
  Cpu,
  Bot,
  User,
  Zap,
  TrendingUp,
  AlertTriangle,
  FolderGit2,
  FileSpreadsheet,
} from 'lucide-react';

export const IntelligencePage: React.FC = () => {
  const {
    aiMessages,
    sendAIMessage,
    clearAIChat,
    isAiLoading,
    projects,
    tasks,
    employees,
    showToast,
  } = useNexus();

  const [inputPrompt, setInputPrompt] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, isAiLoading]);

  const suggestedPrompts = [
    {
      title: 'Analyze operational performance',
      icon: TrendingUp,
      prompt: 'Analyze our operational performance across projects, team productivity, and current sprint velocity.',
    },
    {
      title: 'Identify projects at risk',
      icon: AlertTriangle,
      prompt: 'Identify all active projects at risk, determine the root drivers, and provide immediate remediation strategies.',
    },
    {
      title: 'Find productivity bottlenecks',
      icon: Zap,
      prompt: 'Find operational and productivity bottlenecks in our task pipeline and departmental resource allocation.',
    },
    {
      title: 'Generate an executive briefing',
      icon: FileSpreadsheet,
      prompt: 'Generate a comprehensive executive operations briefing summarizing current headcount, burn-rate, and upcoming milestones.',
    },
    {
      title: 'Analyze task completion rates',
      icon: FolderGit2,
      prompt: 'Analyze task completion rates, mean time to resolution, and sprint lane distribution across engineering teams.',
    },
    {
      title: 'Recommend operational improvements',
      icon: Sparkles,
      prompt: 'Recommend actionable operational improvements to optimize cloud spend, team throughput, and sprint governance.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isAiLoading) return;

    const query = inputPrompt;
    setInputPrompt('');
    await sendAIMessage(query);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Response copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Quick live context metrics
  const activeProjectsCount = projects.filter((p) => p.status === 'In Progress').length;
  const highRiskCount = projects.filter((p) => p.riskLevel === 'High').length;
  const completedTasksCount = tasks.filter((t) => t.status === 'Done').length;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
              AI Intelligence Center
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              gemini-3.8-flash
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time LLM operations co-pilot grounded on your organization's projects and sprint data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="xs"
            onClick={clearAIChat}
            icon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Clear Chat
          </Button>
          <Button
            variant="primary"
            size="xs"
            onClick={() => {
              clearAIChat();
              sendAIMessage('Analyze our operational performance across projects and sprint velocity.');
            }}
            icon={<PlusCircle className="w-3.5 h-3.5" />}
          >
            New Session
          </Button>
        </div>
      </div>

      {/* Live Context Telemetry Chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 shrink-0 text-[11px] text-slate-300">
        <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
          Live Context:
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-[#151c2c] border border-[#293449] flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          {activeProjectsCount} Active Projects
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-[#151c2c] border border-[#293449] flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-rose-400" />
          {highRiskCount} High Risk Projects
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-[#151c2c] border border-[#293449] flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          {completedTasksCount} / {tasks.length} Tasks Closed
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-[#151c2c] border border-[#293449] flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          {employees.length} Team Members
        </span>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-[#293449] bg-[#101522]/60 p-4 sm:p-6 space-y-4">
        {aiMessages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 sm:gap-4 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white ${
                  isUser
                    ? 'bg-purple-600 ring-2 ring-purple-500/30'
                    : 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 ring-2 ring-cyan-500/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`relative group max-w-3xl rounded-2xl p-4 sm:p-5 text-sm ${
                  isUser
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-[#151c2c] border border-[#293449] text-slate-100 rounded-tl-none shadow-md'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#293449]/60 text-xs">
                    <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      NEXUS Intelligence Core
                    </span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="p-1 rounded text-slate-400 hover:text-slate-100 transition-colors flex items-center gap-1 text-[11px]"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Render content with formatted breaks and markdown styling */}
                <div className="leading-relaxed whitespace-pre-wrap font-sans text-xs sm:text-sm space-y-2">
                  {msg.content}
                </div>

                <div
                  className={`text-[10px] mt-2 ${
                    isUser ? 'text-purple-200 text-right' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp} {msg.source && `• via ${msg.source}`}
                </div>
              </div>
            </div>
          );
        })}

        {isAiLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-2xl rounded-tl-none p-4 bg-[#151c2c] border border-[#293449] text-sm text-slate-300 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Analyzing organization operational metrics & synthesizing insights...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 shrink-0">
        {suggestedPrompts.map((sp) => {
          const Icon = sp.icon;
          return (
            <button
              key={sp.title}
              onClick={() => sendAIMessage(sp.prompt)}
              className="px-3 py-1.5 rounded-xl border border-[#293449] bg-[#151c2c] hover:bg-[#1c2638] hover:border-purple-500/50 text-xs text-slate-300 flex items-center gap-2 shrink-0 transition-all cursor-pointer whitespace-nowrap"
            >
              <Icon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>{sp.title}</span>
            </button>
          );
        })}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative shrink-0">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ask anything about projects, team velocity, bottlenecks, budget burn, or operational forecast..."
          disabled={isAiLoading}
          className="w-full pl-4 pr-24 py-3.5 rounded-2xl border border-[#293449] bg-[#151c2c] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 shadow-xl"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={!inputPrompt.trim() || isAiLoading}
            isLoading={isAiLoading}
            icon={<Send className="w-4 h-4" />}
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};
