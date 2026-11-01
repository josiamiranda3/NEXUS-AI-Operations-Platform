import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Employee,
  Project,
  Task,
  CalendarEvent,
  NotificationItem,
  ActivityItem,
  AIMessage,
  UserProfile,
  OrganizationSettings,
  AppPreferences,
  TaskStatus,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_ORG,
  INITIAL_PREFERENCES,
  INITIAL_EMPLOYEES,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_ACTIVITIES,
} from '../data/mockData';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: number;
}

interface NexusContextType {
  // Data
  user: UserProfile;
  org: OrganizationSettings;
  preferences: AppPreferences;
  employees: Employee[];
  projects: Project[];
  tasks: Task[];
  notifications: NotificationItem[];
  events: CalendarEvent[];
  activities: ActivityItem[];
  aiMessages: AIMessage[];
  isAiLoading: boolean;

  // Unread counts & computed indicators
  unreadNotificationsCount: number;

  // Search & Modals
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  quickActionOpen: boolean;
  setQuickActionOpen: (open: boolean) => void;

  // Toast
  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // CRUD Projects
  addProject: (project: Omit<Project, 'id' | 'key' | 'healthScore'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // CRUD Tasks
  addTask: (task: Omit<Task, 'id' | 'createdDate' | 'commentsCount'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (id: string, status: TaskStatus) => void;

  // CRUD Employees
  addEmployee: (employee: Omit<Employee, 'id' | 'completedTasksCount'>) => Employee;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // CRUD Calendar
  addEvent: (event: Omit<CalendarEvent, 'id'>) => CalendarEvent;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;

  // AI Chat
  sendAIMessage: (prompt: string) => Promise<string>;
  clearAIChat: () => void;

  // Settings
  updatePreferences: (updates: Partial<AppPreferences>) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  updateOrgSettings: (updates: Partial<OrganizationSettings>) => void;
  resetToDemoData: () => void;
}

const NexusContext = createContext<NexusContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'nexus_user_v2',
  ORG: 'nexus_org_v2',
  PREFERENCES: 'nexus_prefs_v2',
  EMPLOYEES: 'nexus_employees_v2',
  PROJECTS: 'nexus_projects_v2',
  TASKS: 'nexus_tasks_v2',
  NOTIFICATIONS: 'nexus_notifications_v2',
  EVENTS: 'nexus_events_v2',
  ACTIVITIES: 'nexus_activities_v2',
  AI_MESSAGES: 'nexus_ai_msgs_v2',
};

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to load ${key} from storage:`, e);
    return fallback;
  }
}

export const NexusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => loadStored(STORAGE_KEYS.USER, INITIAL_USER));
  const [org, setOrg] = useState<OrganizationSettings>(() => loadStored(STORAGE_KEYS.ORG, INITIAL_ORG));
  const [preferences, setPreferences] = useState<AppPreferences>(() =>
    loadStored(STORAGE_KEYS.PREFERENCES, INITIAL_PREFERENCES)
  );
  const [employees, setEmployees] = useState<Employee[]>(() =>
    loadStored(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES)
  );
  const [projects, setProjects] = useState<Project[]>(() =>
    loadStored(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS)
  );
  const [tasks, setTasks] = useState<Task[]>(() => loadStored(STORAGE_KEYS.TASKS, INITIAL_TASKS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );
  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    loadStored(STORAGE_KEYS.EVENTS, INITIAL_CALENDAR_EVENTS)
  );
  const [activities, setActivities] = useState<ActivityItem[]>(() =>
    loadStored(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES)
  );
  const [aiMessages, setAiMessages] = useState<AIMessage[]>(() =>
    loadStored(STORAGE_KEYS.AI_MESSAGES, [
      {
        id: 'msg-init',
        role: 'assistant',
        content: `**NEXUS Operations Intelligence Core initialized.**\n\nI am connected to the real-time operational state of **Nexus Technologies**. I have indexed 12 active initiatives, 32 sprint tasks, team capacity distribution, and financial run-rates.\n\nHow can I assist your operations leadership today? You can select a prompt below or type any operational inquiry.`,
        timestamp: 'Just now',
        source: 'nexus-intelligence-engine',
      },
    ])
  );
  const [isAiLoading, setIsAiLoading] = useState(false);

  // UI state
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Sync theme to document body
  useEffect(() => {
    const root = document.documentElement;
    if (preferences.theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [preferences.theme]);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.ORG, JSON.stringify(org));
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
      localStorage.setItem(STORAGE_KEYS.AI_MESSAGES, JSON.stringify(aiMessages));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [user, org, preferences, employees, projects, tasks, notifications, events, activities, aiMessages]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type, timestamp: Date.now() }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcut Ctrl+K / Cmd+K for global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Projects CRUD
  const addProject = (projectData: Omit<Project, 'id' | 'key' | 'healthScore'>): Project => {
    const words = projectData.title.trim().split(' ');
    const key = (words[0].substring(0, 3) || 'PRJ').toUpperCase();
    const newProj: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      key,
      healthScore: Math.floor(Math.random() * 20) + 80,
    };
    setProjects((prev) => [newProj, ...prev]);

    // Add activity
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'project_created',
        title: `Project Created: ${newProj.title}`,
        description: `${user.name} created project with $${newProj.budget.toLocaleString()} budget.`,
        timestamp: 'Just now',
        user: { name: user.name, avatar: user.avatar },
        badge: newProj.department,
      },
      ...prev,
    ]);

    showToast(`Project "${newProj.title}" created successfully!`, 'success');
    return newProj;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          return updated;
        }
        return p;
      })
    );
    showToast('Project updated successfully', 'success');
  };

  const deleteProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    // Also remove or unlink tasks
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
    showToast(`Project "${target?.title || id}" deleted`, 'info');
  };

  // Tasks CRUD
  const addTask = (taskData: Omit<Task, 'id' | 'createdDate' | 'commentsCount'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
      commentsCount: 0,
    };
    setTasks((prev) => [newTask, ...prev]);

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'task_updated',
        title: `Task Created: ${newTask.title}`,
        description: `Logged in backlog under priority ${newTask.priority}.`,
        timestamp: 'Just now',
        user: { name: user.name, avatar: user.avatar },
      },
      ...prev,
    ]);

    showToast(`Task "${newTask.title}" added to board`, 'success');
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return { ...t, ...updates };
        }
        return t;
      })
    );
    showToast('Task updated', 'success');
  };

  const deleteTask = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast(`Task "${target?.title || id}" deleted`, 'info');
  };

  const moveTaskStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return { ...t, status };
        }
        return t;
      })
    );
  };

  // Employees CRUD
  const addEmployee = (employeeData: Omit<Employee, 'id' | 'completedTasksCount'>): Employee => {
    const newEmp: Employee = {
      ...employeeData,
      id: `emp-${Date.now()}`,
      completedTasksCount: 0,
    };
    setEmployees((prev) => [newEmp, ...prev]);
    showToast(`Team member "${newEmp.name}" added to organization`, 'success');
    return newEmp;
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          return { ...e, ...updates };
        }
        return e;
      })
    );
    showToast('Team member profile updated', 'success');
  };

  const deleteEmployee = (id: string) => {
    const target = employees.find((e) => e.id === id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    showToast(`Team member "${target?.name || id}" removed`, 'info');
  };

  // Calendar CRUD
  const addEvent = (eventData: Omit<CalendarEvent, 'id'>): CalendarEvent => {
    const newEvt: CalendarEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
    };
    setEvents((prev) => [...prev, newEvt]);
    showToast(`Event "${newEvt.title}" scheduled`, 'success');
    return newEvt;
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev))
    );
    showToast('Event updated', 'success');
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
    showToast('Event deleted', 'info');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // AI Chat
  const sendAIMessage = async (prompt: string): Promise<string> => {
    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: 'Just now',
    };
    setAiMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const activeProjectsCount = projects.filter((p) => p.status === 'In Progress').length;
      const completedTasksCount = tasks.filter((t) => t.status === 'Done').length;
      const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
      const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);

      const contextPayload = {
        organization: org.name,
        activeProjects: activeProjectsCount,
        totalProjects: projects.length,
        totalBudget,
        totalSpent,
        totalTasks: tasks.length,
        completedTasks: completedTasksCount,
        headcount: employees.length,
        urgentProjects: projects.filter((p) => p.priority === 'Urgent').map((p) => p.title),
        highRiskProjects: projects.filter((p) => p.riskLevel === 'High').map((p) => p.title),
      };

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context: contextPayload }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = data.response || 'No operational analysis output generated.';

      const assistantMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: 'Just now',
        source: data.source || 'nexus-ai',
      };
      setAiMessages((prev) => [...prev, assistantMsg]);
      return reply;
    } catch (err: any) {
      console.warn('API error, using local resilience engine:', err);
      const fallbackReply = `### Operations Intelligence Advisory (Local Resilience Engine)\n\nAnalyzing query: **"${prompt}"**\n\n- **Project Fleet Status:** ${projects.length} managed initiatives (${projects.filter((p) => p.status === 'In Progress').length} in progress).\n- **Resource Health:** Total allocated budget is $${projects.reduce((acc, p) => acc + p.budget, 0).toLocaleString()} with spend efficiency at ${Math.round((projects.reduce((acc, p) => acc + p.spent, 0) / (projects.reduce((acc, p) => acc + p.budget, 0) || 1)) * 100)}%.\n- **Bottlenecks:** Focus on ${projects.filter((p) => p.riskLevel === 'High').map((p) => p.title).join(', ') || 'No critical high-risk blockers'}.\n\n*All system parameters remain nominal.*`;
      const assistantMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: fallbackReply,
        timestamp: 'Just now',
        source: 'nexus-local-engine',
      };
      setAiMessages((prev) => [...prev, assistantMsg]);
      return fallbackReply;
    } finally {
      setIsAiLoading(false);
    }
  };

  const clearAIChat = () => {
    setAiMessages([]);
    showToast('Conversation cleared', 'info');
  };

  // Settings
  const updatePreferences = (updates: Partial<AppPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
    showToast('Preferences saved', 'success');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    showToast('Profile updated', 'success');
  };

  const updateOrgSettings = (updates: Partial<OrganizationSettings>) => {
    setOrg((prev) => ({ ...prev, ...updates }));
    showToast('Organization settings updated', 'success');
  };

  const resetToDemoData = () => {
    setUser(INITIAL_USER);
    setOrg(INITIAL_ORG);
    setPreferences(INITIAL_PREFERENCES);
    setEmployees(INITIAL_EMPLOYEES);
    setProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setEvents(INITIAL_CALENDAR_EVENTS);
    setActivities(INITIAL_ACTIVITIES);
    setAiMessages([
      {
        id: 'msg-init-reset',
        role: 'assistant',
        content: `**NEXUS Operations Intelligence Core initialized.**\n\nDemonstration dataset reset to nominal state. 12 active initiatives, 32 tasks, and 9 executive team members restored.`,
        timestamp: 'Just now',
        source: 'nexus-intelligence-engine',
      },
    ]);
    showToast('Demonstration data successfully reset', 'info');
  };

  return (
    <NexusContext.Provider
      value={{
        user,
        org,
        preferences,
        employees,
        projects,
        tasks,
        notifications,
        events,
        activities,
        aiMessages,
        isAiLoading,
        unreadNotificationsCount,
        searchOpen,
        setSearchOpen,
        quickActionOpen,
        setQuickActionOpen,
        toasts,
        showToast,
        removeToast,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addEvent,
        updateEvent,
        deleteEvent,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        sendAIMessage,
        clearAIChat,
        updatePreferences,
        updateUserProfile,
        updateOrgSettings,
        resetToDemoData,
      }}
    >
      {children}
    </NexusContext.Provider>
  );
};

export const useNexus = () => {
  const context = useContext(NexusContext);
  if (!context) {
    throw new Error('useNexus must be used within a NexusProvider');
  }
  return context;
};
