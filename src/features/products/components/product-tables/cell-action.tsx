"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Product } from "@/constants/data";
import { IconEdit, IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DisplayMode = "auto" | "icon" | "icon-text";

interface CellActionProps {
  data: Product;
  displayMode?: DisplayMode;
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
  displayMode = "auto"
}) => {
  const [loading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {};

  const actions = [
    {
      icon: IconEdit,
      label: "Update",
      onClick: () => router.push(`/product/${data.id}`)
    },
    {
      icon: IconTrash,
      label: "Delete",
      onClick: () => setOpen(true)
    }
  ];

  // Icon only mode - always show icon buttons with tooltip
  if (displayMode === "icon") {
    return (
      <>
        <AlertModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={onConfirm}
          loading={loading}
        />
        <div className="flex gap-1">
          <TooltipProvider>
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <Tooltip key={action.label}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={action.onClick}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="sr-only">{action.label}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{action.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </>
    );
  }

  // Icon + text mode - always show icon + text buttons
  if (displayMode === "icon-text") {
    return (
      <>
        <AlertModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={onConfirm}
          loading={loading}
        />
        <div className="flex gap-1">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={action.onClick}
              >
                <Icon className="mr-1.5 h-4 w-4" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </>
    );
  }

  // Auto mode - responsive based on container width
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      {/* Wide: Full buttons (≥200px) */}
      <div className="hidden gap-1 @[200px]:flex">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={action.onClick}
            >
              <Icon className="mr-1.5 h-4 w-4" />
              {action.label}
            </Button>
          );
        })}
      </div>

      {/* Medium: Icon-only buttons (120px-200px) */}
      <div className="hidden gap-1 @[120px]:flex @[200px]:hidden">
        <TooltipProvider>
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Tooltip key={action.label}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={action.onClick}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{action.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{action.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>

      {/* Narrow: Dropdown menu (<120px) */}
      <div className="flex @[120px]:hidden">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 px-2">
              <IconDotsVertical className="h-4 w-4" />
              <Button variant="link" size="icon" className="ml-1">
                更多
              </Button>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <DropdownMenuItem key={action.label} onClick={action.onClick}>
                  <Icon className="mr-2 h-4 w-4" />
                  {action.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
