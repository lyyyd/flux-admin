import React from "react";
import { cn } from "@/lib/utils";

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
}

export function Main({
  children,
  className,
  fixed = false,
  ...props
}: MainProps) {
  return (
    <main
      className={cn("flex flex-1 flex-col", fixed && "h-full", className)}
      {...props}
    >
      {children}
    </main>
  );
}

export default Main;
