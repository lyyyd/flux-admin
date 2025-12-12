import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { code: -1, message: "Username and password are required" },
        { status: 400 }
      );
    }

    // 调用后端登录接口
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const response = await fetch(`${backendUrl}/oauth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    // 检查登录是否成功
    if (data.code === 0 && data.data) {
      const token = data.data;

      // 设置 cookie，有效期 7 天
      const cookieStore = await cookies();
      cookieStore.set("X-AUTH-TOKEN", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 天（秒）
        path: "/"
      });

      return NextResponse.json({
        code: 0,
        message: data.message || "Login successful",
        data: {
          token
        }
      });
    } else {
      return NextResponse.json(
        { code: data.code || -1, message: data.message || "Login failed" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { code: -1, message: "Internal server error" },
      { status: 500 }
    );
  }
}
