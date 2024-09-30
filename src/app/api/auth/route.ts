import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import Db from '../../models/db';
import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  const session = await getSession({ req });

  // ตรวจสอบว่าผู้ใช้เข้าสู่ระบบหรือยัง
  if (!session || !session.user || !session.user.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { method } = req;

  switch (method) {
    case 'GET': {
      try {
        // ใช้ email ในการค้นหาผู้ใช้แทน id
        const transactions = await Db.find({ userId: session.user.email });
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        
        res.status(200).json({ transactions, totalIncome, totalExpense });
      } catch (error) {
        res.status(400).json({ message: 'Failed to fetch transactions' });
      }
      break;
    }

    case 'POST': {
      try {
        const { amount, date, type, note } = req.body;

        if (!amount || !date || !type) {
          return res.status(400).json({ message: 'Missing required fields' });
        }

        const newTransaction = new Db({
          amount,
          date: new Date(date),
          type,
          note,
          userId: session.user.email, // ใช้ email แทน id
        });

        await newTransaction.save();

        res.status(201).json({ message: 'Transaction created successfully', transaction: newTransaction });
      } catch (error) {
        res.status(400).json({ message: 'Failed to create transaction' });
      }
      break;
    }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
