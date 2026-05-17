"use client";

import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useMemo,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type SelectContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
}

interface SelectTriggerProps {
  className?: string;
  children: ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

interface SelectContentProps {
  children: ReactNode;
}

interface SelectItemProps {
  value: string;
  children: ReactNode;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within Select.");
  }
  return context;
}

export function Select({
  value,
  onValueChange,
  children,
}: Readonly<SelectProps>) {
  const context = useMemo(() => ({ value, onValueChange }), [value, onValueChange]);
  return <SelectContext.Provider value={context}>{children}</SelectContext.Provider>;
}

export function SelectTrigger({ className, children }: Readonly<SelectTriggerProps>) {
  const { value, onValueChange } = useSelectContext();
  const content = Children.toArray(children);
  const triggerChild = content.find((child) => isValidElement(child) && child.type === SelectValue) as
    | ReactElement<{ placeholder?: string }>
    | undefined;
  const optionsChild = content.find((child) => isValidElement(child) && child.type === SelectContent) as
    | ReactElement<{ children?: ReactNode }>
    | undefined;

  const items = Children.toArray(optionsChild?.props.children).filter((child) => isValidElement(child)) as Array<
    ReactElement<{ value: string; children: ReactNode }>
  >;

  return (
    <select
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      className={cn(
        "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200",
        className
      )}
    >
      {triggerChild?.props.placeholder ? <option value="">{triggerChild.props.placeholder}</option> : null}
      {items.map((item) => (
        <option key={item.props.value} value={item.props.value}>
          {item.props.children}
        </option>
      ))}
    </select>
  );
}

export function SelectValue({ placeholder }: Readonly<SelectValueProps>) {
  return <>{placeholder}</>;
}

export function SelectContent({ children }: Readonly<SelectContentProps>) {
  return <>{children}</>;
}

export function SelectItem({ value, children }: Readonly<SelectItemProps>) {
  return <option value={value}>{children}</option>;
}
