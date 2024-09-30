"use client";
import { Typography, Stack, TextField, Button, Link } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect } from "react";

export default function SignInPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // ถ้ามี session อยู่แล้ว ให้นำผู้ใช้ไปยังหน้าแรก
    if (session) {
      router.push("/data"); // เปลี่ยนเส้นทางไปยัง /data แทน / เมื่อมี session
    }
  }, [session, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res: any = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      if (!res?.error) {
        // redirect ไปยังหน้า data หลังจาก login สำเร็จ
        router.push("/data");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/signin"); // เปลี่ยนหน้าไปยังหน้าเข้าสู่ระบบ
  };

  return (
    <>
      <Typography variant="h1">Welcome to login</Typography>
      <Link href="/signup">register</Link>
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
            label="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <TextField
            type="password"
            name="password"
            label="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <Stack direction="row" spacing={1}>
            <Button type="submit">login</Button>
            {session && (
              <Button onClick={handleSignOut}>logout</Button>
            )}
          </Stack>
        </Stack>
      </form>
    </>
  );
}
