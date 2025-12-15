"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PasswordInput } from "@/components/password-input";
import { cn } from "@/lib/utils";
import { SignIn as ClerkSignInForm } from "@clerk/nextjs";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { IconStar } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { InteractiveGridPattern } from "./interactive-grid";
import { login } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth";

export default function SignInViewPage({ stars }: { stars: number }) {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToken } = useAuthStore();

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await login({
        username: account,
        password: password
      });

      if (response.code === 0 && response.data?.token) {
        // 保存 token 到 store
        setToken(response.data.token);

        // 获取重定向地址，如果没有则跳转到 overview
        const redirectUrl = searchParams.get("redirect_url") || "/overview";
        router.push(redirectUrl);
      } else {
        setError(response.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/examples/authentication"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute top-4 right-4 hidden md:top-8 md:right-8"
        )}
      >
        Login
      </Link>
      <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Logo
        </div>
        <InteractiveGridPattern
          className={cn(
            "mask-[radial-gradient(400px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[0%] h-full skew-y-12"
          )}
        />
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This starter template has saved me countless hours of work
              and helped me deliver projects to my clients faster than ever
              before.&rdquo;
            </p>
            <footer className="text-sm">Random Dude</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex h-full items-center justify-center p-4 lg:p-8">
        <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6">
          {/* github link  */}
          <Link
            className={cn("group inline-flex hover:text-yellow-200")}
            target="_blank"
            href={"https://github.com/lyyyd/flux-admin"}
          >
            <div className="flex items-center">
              <GitHubLogoIcon className="size-4" />
              <span className="ml-1 inline">Star on GitHub</span>{" "}
            </div>
            <div className="ml-2 flex items-center gap-1 text-sm md:flex">
              <IconStar
                className="size-4 text-gray-500 transition-all duration-300 group-hover:text-yellow-300"
                fill="currentColor"
              />
              <span className="font-display font-medium">{stars}</span>
            </div>
          </Link>

          {/* 登录方式选择 */}
          <Tabs defaultValue="credentials" className="w-99">
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="credentials">Email & Password</TabsTrigger>
              <TabsTrigger value="clerk">Clerk Sign In</TabsTrigger>
            </TabsList>

            {/* 账号密码登录 */}
            <TabsContent value="credentials" className="mt-0">
              <Card
                className="border-none"
                style={{
                  boxShadow: `
                    0px 5px 15px 0px rgba(0, 0, 0, 0.08),
                    0px 15px 35px -5px rgba(0, 0, 0, 0.2),
                    0px 0px 0px 1px rgba(0, 0, 0, 0.07)
                  `
                }}
              >
                <CardHeader className="flex flex-col items-stretch gap-1 pb-6">
                  <CardTitle
                    className="m-0 font-bold tracking-tight"
                    style={{
                      fontSize: "17px",
                      fontWeight: 700,
                      lineHeight: "24px",
                      color: "rgb(33, 33, 38)"
                    }}
                  >
                    Sign in to My Application
                  </CardTitle>
                  <p
                    className="m-0"
                    style={{
                      fontSize: "13px",
                      fontWeight: 400,
                      lineHeight: "18px",
                      color: "rgba(33, 33, 38, 0.65)",
                      letterSpacing: "normal"
                    }}
                  >
                    Welcome back! Please sign in to continue
                  </p>
                </CardHeader>
                <CardContent className="space-y-5">
                  <form onSubmit={handleCredentialLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="account"
                        style={{
                          fontSize: "13px",
                          fontWeight: 500,
                          lineHeight: "18px",
                          color: "rgb(33, 33, 38)"
                        }}
                      >
                        Account
                      </Label>
                      <Input
                        id="account"
                        type="text"
                        placeholder="Enter account"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        required
                        disabled={isLoading}
                        style={{
                          fontSize: "13px",
                          fontWeight: 400,
                          lineHeight: "18px",
                          height: "30px",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          color: "rgb(19, 19, 22)"
                        }}
                        autoComplete="username"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="password"
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            lineHeight: "18px",
                            color: "rgb(33, 33, 38)"
                          }}
                        >
                          Password
                        </Label>
                        <Link
                          href="/forgot-password"
                          className="hover:underline"
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "rgb(47, 48, 55)"
                          }}
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <PasswordInput
                        id="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        style={{
                          fontSize: "13px",
                          fontWeight: 400,
                          lineHeight: "18px",
                          height: "30px",
                          padding: "6px 40px 6px 12px",
                          borderRadius: "6px",
                          color: "rgb(19, 19, 22)"
                        }}
                        autoComplete="current-password"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) =>
                          setRememberMe(checked as boolean)
                        }
                        disabled={isLoading}
                        className="data-[state=checked]:bg-primary"
                      />
                      <Label
                        htmlFor="remember"
                        className="text-foreground cursor-pointer text-sm font-normal select-none"
                      >
                        Keep me signed in
                      </Label>
                    </div>
                    {error && (
                      <div className="text-sm text-red-600" role="alert">
                        {error}
                      </div>
                    )}
                    <Button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 border border-solid font-medium transition-all duration-100"
                      disabled={isLoading}
                      style={{
                        margin: 0,
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: 500,
                        lineHeight: "18px",
                        letterSpacing: "normal",
                        outline: 0,
                        userSelect: "none",
                        cursor: "pointer",
                        position: "relative",
                        isolation: "isolate",
                        backgroundColor: "#2F3037",
                        color: "white",
                        borderColor: "#2F3037"
                      }}
                    >
                      <span>{isLoading ? "Signing in..." : "Continue"}</span>
                      {!isLoading && (
                        <svg
                          width="6"
                          height="6"
                          viewBox="0 0 10 10"
                          fill="none"
                        >
                          <path
                            fill="currentColor"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="m7.25 5-3.5-2.25v4.5L7.25 5Z"
                          />
                        </svg>
                      )}
                    </Button>
                  </form>
                  <div
                    className="pt-2 text-center"
                    style={{
                      fontSize: "13px",
                      color: "rgba(33, 33, 38, 0.65)"
                    }}
                  >
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/auth/sign-up"
                      className="hover:underline"
                      style={{
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "rgba(33, 33, 38, 0.65)"
                      }}
                    >
                      Sign up
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Clerk 登录 */}
            <TabsContent value="clerk" className="mt-0">
              <ClerkSignInForm
                initialValues={{
                  emailAddress: "your_mail+clerk_test@example.com"
                }}
              />
            </TabsContent>
          </Tabs>

          <p className="text-muted-foreground px-8 text-center text-xs">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="hover:text-primary font-medium underline underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="hover:text-primary font-medium underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
