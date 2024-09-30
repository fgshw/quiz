import mongoose from "mongoose";

//เอามาจาก MongoDB ของตัวเอง
const uri =
"mongodb+srv://naphatseehawong:FeBMrk38xMOEtAHk@cluster0.knj8m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  ;

let cachedDb: mongoose.Connection | null = null;

export async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  const opts = { dbName: "Quiz-db"};
  const conn = await mongoose.connect(uri, opts);
  cachedDb = conn.connection;
  return cachedDb;
} 