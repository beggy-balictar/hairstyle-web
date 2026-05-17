"use client";

import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type DialogContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

interface DialogTriggerProps {
  asChild?: boolean;
  children: ReactNode;
}

interface DialogContentProps {
  className?: string;
  children: ReactNode;
}

interface DialogHeaderProps {
  className?: string;
  children: ReactNode;
}

interface DialogTitleProps {
  className?: string;
  children: ReactNode;
}

interface DialogDescriptionProps {
  className?: string;
  children: ReactNode;
}

interface DialogFooterProps {
  className?: string;
  children: ReactNode;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within Dialog.");
  }
  return context;
}

export function Dialog({
  open,
  onOpenChange,
  children,
}: Readonly<DialogProps>) {
  return <DialogContext.Provider value={{ open, onOpenChange }}>{children}</DialogContext.Provider>;
}

export function DialogTrigger({
  asChild,
  children,
}: Readonly<DialogTriggerProps>) {
  const { onOpenChange } = useDialogContext();

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ onClick?: () => void }>;
    return cloneElement(child, {
      onClick: () => {
        child.props.onClick?.();
        onOpenChange(true);
      },
    });
  }

  return (
    <button type="button" onClick={() => onOpenChange(true)}>
      {children}
    </button>
  );
}

export function DialogContent({
  className,
  children,
}: Readonly<DialogContentProps>) {
  const { open, onOpenChange } = useDialogContext();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="absolute inset-0" onClick={() => onOpenChange(false)} />
      <div className={cn("relative z-10 w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl", className)}>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className, children }: Readonly<DialogHeaderProps>) {
  return <div className={cn("space-y-2", className)}>{children}</div>;
}

export function DialogTitle({ className, children }: Readonly<DialogTitleProps>) {
  return <h3 className={cn("text-xl font-semibold text-slate-950", className)}>{children}</h3>;
}

export function DialogDescription({ className, children }: Readonly<DialogDescriptionProps>) {
  return <p className={cn("text-sm leading-6 text-slate-500", className)}>{children}</p>;
}

export function DialogFooter({ className, children }: Readonly<DialogFooterProps>) {
  return <div className={cn("mt-5 flex justify-end", className)}>{children}</div>;
}
