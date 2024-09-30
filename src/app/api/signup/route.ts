import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb";
import User from "../../models/user";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      // เชื่อมต่อกับฐานข้อมูล
      await connectToDatabase();

      // ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือไม่
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // แฮชรหัสผ่าน
      const hashedPassword = await bcrypt.hash(password, 10);

      // สร้างผู้ใช้ใหม่
      const newUser = new User({
        email,
        password: hashedPassword,
      });

      await newUser.save();

      return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
