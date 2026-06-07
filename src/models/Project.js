import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: false,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    color: {
      type: String,
      default: '#4F46E5',
    },
    icon: {
      type: String,
      default: 'folder',
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ProjectSchema.index({ userId: 1, archived: 1 });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
