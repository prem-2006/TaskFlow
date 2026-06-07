export const mockUsers = [
  { _id: 'mock-user-123', name: 'Demo User', email: 'demo@taskflow.dev', image: '', role: 'admin' },
  { _id: 'mock-user-2', name: 'Sarah Chen', email: 'sarah@taskflow.dev', image: 'https://i.pravatar.cc/150?u=sarah', role: 'member' },
  { _id: 'mock-user-3', name: 'Marcus Johnson', email: 'marcus@taskflow.dev', image: 'https://i.pravatar.cc/150?u=marcus', role: 'member' },
  { _id: 'mock-user-4', name: 'Elena Rodriguez', email: 'elena@taskflow.dev', image: 'https://i.pravatar.cc/150?u=elena', role: 'viewer' }
];

export const mockWorkspaces = [
  {
    _id: 'ws-1',
    name: 'Engineering Team',
    ownerId: 'mock-user-123',
    members: mockUsers
  },
  {
    _id: 'ws-2',
    name: 'Personal Workspace',
    ownerId: 'mock-user-123',
    members: [mockUsers[0]]
  }
];

export const mockTasks = [
  {
    _id: 'task-1',
    title: 'Review Frontend Architecture',
    description: 'Go over the new feature PRD with the team and finalize the React component structure.',
    status: 'todo',
    priority: 'high',
    dueDate: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
    tags: ['Work', 'Planning'],
    projectId: null,
    workspaceId: 'ws-1',
    assigneeIds: ['mock-user-123', 'mock-user-2'],
    assignees: [mockUsers[0], mockUsers[1]],
    subtasks: [
      { _id: 'sub-1', title: 'Read PRD', completed: true },
      { _id: 'sub-2', title: 'Prepare questions', completed: false }
    ],
    creatorId: 'mock-user-3'
  },
  {
    _id: 'task-2',
    title: 'API Rate Limiting Implementation',
    description: 'Add Redis-based rate limiting to the public facing APIs to prevent abuse.',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    tags: ['Backend', 'Security'],
    projectId: 'mock-proj-1',
    workspaceId: 'ws-1',
    assigneeIds: ['mock-user-3'],
    assignees: [mockUsers[2]],
    subtasks: [],
    creatorId: 'mock-user-123'
  },
  {
    _id: 'task-3',
    title: 'Update Q3 Marketing Site',
    description: 'Deploy the new landing page for the Q3 campaign.',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    tags: ['Marketing', 'Web'],
    projectId: 'mock-proj-1',
    workspaceId: 'ws-1',
    assigneeIds: ['mock-user-4'],
    assignees: [mockUsers[3]],
    subtasks: [],
    creatorId: 'mock-user-2'
  },
  {
    _id: 'task-4',
    title: 'Buy Groceries',
    description: 'Milk, Eggs, Bread',
    status: 'todo',
    priority: 'low',
    dueDate: new Date().toISOString(),
    tags: ['Personal'],
    projectId: null,
    workspaceId: 'ws-2',
    assigneeIds: ['mock-user-123'],
    assignees: [mockUsers[0]],
    subtasks: [],
    creatorId: 'mock-user-123'
  }
];

export const mockProjects = [
  {
    _id: 'mock-proj-1',
    name: 'Q3 Product Launch',
    description: 'All tasks related to the upcoming product launch',
    color: '#3b82f6',
    status: 'active',
    taskCount: 5,
    completedTaskCount: 2,
    workspaceId: 'ws-1',
    userId: 'mock-user-123'
  }
];

export const mockDashboardData = {
  todayTasks: mockTasks.filter(t => new Date(t.dueDate).toDateString() === new Date().toDateString() && t.workspaceId === 'ws-1'),
  upcomingTasks: mockTasks.filter(t => new Date(t.dueDate) > new Date() && t.workspaceId === 'ws-1'),
  stats: {
    completedToday: 2,
    totalActive: 12,
    totalCompleted: 45,
    overdue: 1
  },
  streak: {
    current: 4,
    longest: 12
  }
};
