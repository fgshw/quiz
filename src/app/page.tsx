"use client"; // เพิ่มบรรทัดนี้

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation"; // เปลี่ยนจาก 'next/router' เป็น 'next/navigation'
import styles from "./page.module.css";

// ประกาศประเภท Transaction
type Transaction = {
  _id: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  note: string;
};

export default function Home() {
  const { data: session } = useSession(); // ตรวจสอบ session
  const router = useRouter(); // สร้างตัวแปร router
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    type: "income",
    note: "",
  });
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  // Fetch data เมื่อ user เข้าสู่ระบบ
  useEffect(() => {
    if (session) {
      fetchTransactions();
    }
  }, [session]);

  const fetchTransactions = async () => {
    if (!session) return; // ตรวจสอบ session
    try {
      const response = await fetch("/api/auth", { // ตรวจสอบ URL ของ API
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setTransactions(data.transactions);

      // คำนวณรายรับและรายจ่ายรวม
      const income = data.transactions
        .filter((t: Transaction) => t.type === "income")
        .reduce((acc: number, curr: Transaction) => acc + Number(curr.amount), 0);
      const expense = data.transactions
        .filter((t: Transaction) => t.type === "expense")
        .reduce((acc: number, curr: Transaction) => acc + Number(curr.amount), 0);

      setTotalIncome(income);
      setTotalExpense(expense);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    try {
      const response = await fetch("/api/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newTransaction = await response.json();
        setTransactions([...transactions, newTransaction]);

        // Reset form
        setFormData({
          amount: "",
          date: "",
          type: "income",
          note: "",
        });

        // Recalculate total income and expense
        if (formData.type === "income") {
          setTotalIncome(totalIncome + newTransaction.amount);
        } else {
          setTotalExpense(totalExpense + newTransaction.amount);
        }
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  return (
    <div className={styles.page}>
      <h1>บันทึกรายรับรายจ่าย</h1>
      {session ? (
        <>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="amount">จำนวน/เงิน:</label>
              <input
                type="number"
                id="amount"
                placeholder="จำนวนเงิน"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="date">วันที่:</label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="type">ประเภท:</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="income">รายรับ</option>
                <option value="expense">รายจ่าย</option>
              </select>
            </div>

            <div>
              <label htmlFor="note">โน้ตสำหรับบันทึกรายละเอียด:</label>
              <input
                type="text"
                id="note"
                placeholder="โน้ต"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </div>

            <button type="submit">บันทึก</button>
          </form>

          <h2>รายการ</h2>
          <ul>
            {transactions.map((t) => (
              <li key={t._id}>
                {new Date(t.date).toLocaleDateString("th-TH")}:{" "}
                {t.type === "income" ? "รายรับ" : "รายจ่าย"} {t.amount} - {t.note}
              </li>
            ))}
          </ul>

          <h3>รวมรายรับ: {totalIncome}</h3>
          <h3>รวมรายจ่าย: {totalExpense}</h3>

          <button onClick={() => signOut()}>ออกจากระบบ</button>
        </>
      ) : (
        <div>
          <p>กรุณาเข้าสู่ระบบ</p>
          <button onClick={() => router.push("/signin")}>เข้าสู่ระบบ</button> {/* เปลี่ยนจาก signIn เป็น router.push */}       
        </div>
      )}
    </div>
  );
}
