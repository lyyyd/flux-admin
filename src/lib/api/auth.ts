interface LoginParams {
  username: string;
  password: string;
}

interface LoginResponse {
  code: number;
  message: string;
  data?: {
    token: string;
  };
}

export async function login(params: LoginParams): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  return response.json();
}
