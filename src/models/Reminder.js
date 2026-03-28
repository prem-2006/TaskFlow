import mongoose from 'mongoose';

const ReminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    type: {
      type: String,
      enum: ['email', 'push'],
      default: 'email',
    },
    triggerAt: {
      type: Date,
      required: true,
      index: true,
    },
    sent: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for the cron query: find unsent reminders ready to fire
ReminderSchema.index({ sent: 1, triggerAt: 1 });

export default mongoose.models.Reminder || mongoose.model('Reminder', ReminderSchema);
