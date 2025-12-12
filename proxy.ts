import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/overview(.*)",
  "/billing(.*)",
  "/errors(.*)",
  "/examples(.*)",
  "/examples-dashboard(.*)",
  "/apps(.*)",
  "/chats(.*)",
  "/help-center(.*)",
  "/tasks(.*)",
  "/users(.*)",
  "/settings(.*)",
  "/exclusive(.*)",
  "/kanban(.*)",
  "/product(.*)",
  "/profile(.*)",
  "/workspaces(.*)"
]);

const isPublicRoute = createRouteMatcher([
  "/auth/sign-in(.*)",
  "/auth/sign-up(.*)",
  "/forgot-password(.*)",
  "/"
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId } = await auth();
  const path = req.nextUrl.pathname;

  // 检查自定义登录的 token
  const customToken = req.cookies.get("X-AUTH-TOKEN")?.value;

  // 如果是受保护的路由
  if (isProtectedRoute(req)) {
    // 检查是否有 Clerk 登录或自定义登录
    if (!userId && !customToken) {
      // 两者都没有，重定向到登录页
      const signInUrl = new URL("/auth/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", path);
      return NextResponse.redirect(signInUrl);
    }
  }

  // 如果已登录用户访问登录页，重定向到 overview
  if (isPublicRoute(req) && (userId || customToken)) {
    if (path.includes("/auth/sign-in") || path.includes("/auth/sign-up")) {
      return NextResponse.redirect(new URL("/overview", req.url));
    }
  }

  return NextResponse.next();
});
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)"
  ]
};
