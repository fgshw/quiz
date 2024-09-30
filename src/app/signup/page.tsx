"use client";
import { Button, Stack, TextField, Typography } from "@mui/material";
import React, { FormEvent } from "react";
import { useRouter } from "next/navigation"; // นำเข้า useRouter

export default function page() {
  const router = useRouter(); // สร้างตัวแปร router
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        alert("User created successfully!");
        router.push("/signin"); // เปลี่ยนหน้าไปยังหน้า signin
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Typography variant="h1">This is signup page</Typography>
      <form onSubmit={handleSubmit}>
        <Stack
          width={400}
          justifyContent="center"
          alignItems="center"
          margin="auto auto"
          spacing={1}
        >
          <TextField
            name="email"
            label="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <TextField
            name="password"
            label="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
            <button onClick={() => router.push("/signin")}>subnit</button> {/* เปลี่ยนจาก signIn เป็น router.push */}
            <button onClick={() => router.push("/")}>logout</button> {/* เปลี่ยนจาก signIn เป็น router.push */}
        </Stack>
      </form>
    </>
  );
}
