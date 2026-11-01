export type ProjectStatus = 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'Backlog' | 'To Do' | 'In Progress' | 'In Review' | 'Done';
export type Department = 'Engineering' | 'Design' | 'Product' | 'DevOps' | 'Security' | 'Data & AI' | 'Operations';
export type NotificationType = 'task_assigned' | 'deadline_approaching' | 'project_completed' | 'performance_alert' | 'team_activity' | 'system';
export type EventCategory = 'project_deadline' | 'task_deadline' | 'meeting' | 'review' | 'milestone';

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: Department;
  email: string;
  avatar: string;
  status: 'Active' | 'On Leave' | 'Busy';
  productivityScore: number; // 0-100
  phone?: string;
  location: string;
  joinedDate: string;
  completedTasksCount: number;
}

export interface Project {
  id: string;
  key: string;
  title: string;
  description: string;
  department: Department;
  status: ProjectStatus;
  priority: PriorityLevel;
  progress: number; // 0-100%
  budget: number;
  spent: number;
  startDate: string;
  dueDate: string;
  leadId: string;
  memberIds: string[];
  tags: string[];
  healthScore: number; // 0-100
  riskLevel: 'Low' | 'Moderate' | 'High';
}

export interface TaskComment {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assigneeId: string;
  priority: PriorityLevel;
  status: TaskStatus;
  dueDate: string;
  createdDate: string;
  estimatedHours: number;
  spentHours: number;
  tags: string[];
  commentsCount: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  category: EventCategory;
  relatedEntityId?: string;
  location?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface ActivityItem {
  id: string;
  type: 'project_created' | 'task_updated' | 'milestone_reached' | 'alert_triggered' | 'member_added';
  title: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    avatar: string;
  };
  badge?: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: string;
}

export interface UserProfile {
  name: string;
  title: string;
  email: string;
  avatar: string;
  organization: string;
  role: string;
}

export interface OrganizationSettings {
  name: string;
  tier: 'Enterprise Scale' | 'Pro' | 'Growth';
  membersCount: number;
  monthlySpendLimit: number;
  fiscalYearStart: string;
  defaultCurrency: string;
}

export interface AppPreferences {
  theme: 'dark' | 'light';
  density: 'comfortable' | 'compact';
  language: string;
  emailAlerts: boolean;
  slackIntegrations: boolean;
  autoAiInsights: boolean;
  highContrast: boolean;
}
