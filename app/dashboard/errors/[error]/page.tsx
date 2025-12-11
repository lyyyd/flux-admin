"use client";

import { UnauthorizedError } from "@/features/errors/unauthorized-error";
import { ForbiddenError } from "@/features/errors/forbidden-error";
import { NotFoundError } from "@/features/errors/not-found-error";
import { GeneralError } from "@/features/errors/general-error";
import { MaintenanceError } from "@/features/errors/maintenance-error";

const errorMap: Record<string, React.ComponentType> = {
  unauthorized: UnauthorizedError,
  forbidden: ForbiddenError,
  "not-found": NotFoundError,
  "internal-server-error": GeneralError,
  "maintenance-error": MaintenanceError
};

export default function DynamicErrorPage({
  params
}: {
  params: { error: string };
}) {
  const ErrorComponent = errorMap[params.error] || NotFoundError;

  return <ErrorComponent />;
}
