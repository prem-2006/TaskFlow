import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // null for OAuth users
    },
    image: {
      type: String,
      default: '',
    },
    googleAccessToken: {
      type: String,
    },
    googleRefreshToken: {
      type: String,
    },
    emailVerified: {
      type: Date,
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
      reminderEmail: {
        type: Boolean,
        default: true,
      },
      reminderPush: {
        type: Boolean,
        default: true,
      },
    },
    completionStreak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastCompletedDate: { type: Date },
    },
    pushSubscription: {
      // Web Push subscription object
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

// Prevent model recompilation in dev
export default mongoose.models.User || mongoose.model('User', UserSchema);
