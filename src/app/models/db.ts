import mongoose, { mongo } from 'mongoose';

const DbSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  note: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Db = mongoose.models.Db || mongoose.model("Db", DbSchema);
export default Db
