import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  match: mongoose.Types.ObjectId;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  match: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
  content: { type: String, required: true, maxlength: 1000 },
  type: { type: String, enum: ['text', 'image', 'file', 'system'], default: 'text' },
  isRead: { type: Boolean, default: false },
  readAt: Date
}, {
  timestamps: true
});

// Indexes
MessageSchema.index({ match: 1, createdAt: 1 });
MessageSchema.index({ recipient: 1, isRead: 1 });

export default mongoose.model<IMessage>('Message', MessageSchema);