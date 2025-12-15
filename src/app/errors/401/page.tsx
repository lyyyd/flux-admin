import { UnauthorizedError } from "@/features/errors/unauthorized-error";

export default function Page401() {
  return <UnauthorizedError />;
}
