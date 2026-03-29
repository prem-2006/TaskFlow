import mongoose from 'mongoose';

const SubtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
});

const TaskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    subtasks: [SubtaskSchema],
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    estimatedMinutes: {
      type: Number,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    // Google Calendar event ID for synced tasks
    googleCalendarEventId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Compound indexes for common query patterns
TaskSchema.index({ userId: 1, status: 1, dueDate: 1 });
TaskSchema.index({ userId: 1, projectId: 1 });
TaskSchema.index({ userId: 1, tags: 1 });
TaskSchema.index({ userId: 1, dueDate: 1 });

// Text index for search
TaskSchema.index({ title: 'text', description: 'text' });

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
