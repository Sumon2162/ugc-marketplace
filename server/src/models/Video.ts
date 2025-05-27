import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
  creator: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  tags: string[];
  category: string;
  views: number;
  likes: mongoose.Types.ObjectId[];
  isPublic: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>({
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, maxlength: 500 },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  duration: { type: Number, required: true },
  tags: [{ type: String, maxlength: 50 }],
  category: { type: String, required: true, enum: ['Fashion', 'Beauty', 'Fitness', 'Tech', 'Food', 'Travel', 'Lifestyle', 'Gaming', 'Music', 'Art'] },
  views: { type: Number, default: 0 },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isPublic: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Indexes
VideoSchema.index({ creator: 1, createdAt: -1 });
VideoSchema.index({ category: 1, isPublic: 1, isApproved: 1 });
VideoSchema.index({ tags: 1 });

export default mongoose.model<IVideo>('Video', VideoSchema);