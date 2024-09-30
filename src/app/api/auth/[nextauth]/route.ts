import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '../../../models/user';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../../lib/mongodbuser';

export default NextAuth({
  session: {
    strategy: 'jwt', // ใช้ strategy แทน jwt: true
  },
  providers: [
    CredentialsProvider({
      // เพิ่ม property credentials
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password", placeholder: "Password" }
      },
      async authorize(credentials) {
        // เชื่อมต่อกับฐานข้อมูล
        await connectToDatabase().catch((err) => {
          console.error('Failed to connect to database:', err);
          throw new Error('Failed to connect to database');
        });

        // ค้นหาผู้ใช้จากชื่อผู้ใช้
        const user = await User.findOne({ username: credentials?.username });
        if (!user) {
          console.error('User not found');
          return null;
        }
        if (!credentials) {
          throw new Error('Credentials not provided');
        }
        
        // ตรวจสอบรหัสผ่าน
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (isValidPassword) {
          // คืนข้อมูลผู้ใช้เมื่อเข้าสู่ระบบสำเร็จ
          return { id: user._id, username: user.username };
        }

        // คืนค่า null เมื่อข้อมูลไม่ถูกต้อง
        console.error('Invalid credentials');
        return null;
      },
    }),
  ],
});
