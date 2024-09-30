"use client";
// pages/transactions.tsx
import { useEffect, useState } from 'react';

interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: string; // "income" or "expense"
  note: string;
}

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data.transactions);
    };

    fetchTransactions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTransaction = { amount, date, type, note };

    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTransaction),
    });

    if (response.ok) {
      const savedTransaction = await response.json();
      setTransactions((prev) => [...prev, savedTransaction.transaction]);
      setAmount('');
      setDate('');
      setType('income');
      setNote('');
    }
  };

  return (
    <div>
      <h1>Transactions</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter amount"
            />
          </label>
        </div>
        <div>
          <label>
            Date:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Type:
            <select value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Note:
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter note"
            />
          </label>
        </div>
        <button type="submit">Add Transaction</button>
      </form>

      <h2>Transaction List</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.date}: {transaction.amount} - {transaction.type} ({transaction.note})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsPage;
