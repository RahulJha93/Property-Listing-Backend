import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  favorites: mongoose.Types.ObjectId[];
  recommendationsReceived: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
  recommendationsReceived: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
});

export default mongoose.model<IUser>('User', UserSchema);
