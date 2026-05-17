"use client";

import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
};

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: ReactNode;
}

interface TabsListProps {
  className?: string;
  children: ReactNode;
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: ReactNode;
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: ReactNode;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within Tabs.");
  }
  return context;
}

export function Tabs({
  defaultValue,
  className,
  children,
}: Readonly<TabsProps>) {
  const [value, setValue] = useState(defaultValue);
  const context = useMemo(() => ({ value, setValue }), [value]);

  return (
    <TabsContext.Provider value={context}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }: Readonly<TabsListProps>) {
  return <div className={cn("inline-flex gap-2", className)}>{children}</div>;
}

export function TabsTrigger({
  value,
  className,
  children,
}: Readonly<TabsTriggerProps>) {
  const { value: active, setValue } = useTabsContext();

  return (
    <button
      type="button"
      onClick={() => setValue(value)}
      className={cn(
        "h-10 rounded-xl px-4 text-sm font-medium transition",
        active === value ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-900",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  className,
  children,
}: Readonly<TabsContentProps>) {
  const { value: active } = useTabsContext();

  if (active !== value) {
    return null;
  }

  return <div className={className}>{children}</div>;
}
