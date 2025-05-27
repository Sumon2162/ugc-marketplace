import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  creator: mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  projectDetails?: {
    title: string;
    description: string;
    budget: number;
    deadline: Date;
    requirements: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema = new Schema<IMatch>({
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' },
  projectDetails: {
    title: String,
    description: String,
    budget: Number,
    deadline: Date,
    requirements: [String]
  }
}, {
  timestamps: true
});

// Unique constraint
MatchSchema.index({ creator: 1, client: 1 }, { unique: true });

export default mongoose.model<IMatch>('Match', MatchSchema);