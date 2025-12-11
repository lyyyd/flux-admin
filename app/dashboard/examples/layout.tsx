import type { ReactNode } from "react";

export default function ExamplesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col p-4 md:px-6 md:py-4">{children}</div>
  );
}
