import mongoose, { Schema, Types } from 'mongoose';

export interface ImageDocument {
  _id: Types.ObjectId;
  originalName: string;
  resolution: string;
  path: string;
  md5: string;
  ext: string;
  createdAt: Date;
}

const ImageSchema = new Schema<ImageDocument>({
  originalName: { type: String, required: true, index: true },
  resolution: { type: String, required: true, index: true },
  path: { type: String, required: true },
  md5: { type: String, required: true, index: true },
  ext: { type: String, required: true }
}, { timestamps: { createdAt: true, updatedAt: false } });

ImageSchema.index({ originalName: 1, resolution: 1 }, { unique: true });

export const ImageModel = mongoose.model<ImageDocument>('Image', ImageSchema);
