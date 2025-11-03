import mongoose, { Document, Schema } from 'mongoose';

export interface IDesigner extends Document {
  name: string;
  bio: string;
  profileImage: string;
  styles: string[];
  embedding: number[];
  createdAt: Date;
  updatedAt: Date;
}

const DesignerSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    bio: {
      type: String,
      required: true
    },
    profileImage: {
      type: String,
      required: true
    },
    styles: {
      type: [String],
      required: true
    },
    embedding: {
      type: [Number],
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

DesignerSchema.index({ embedding: '2dsphere' });

export default mongoose.model<IDesigner>('Designer', DesignerSchema);