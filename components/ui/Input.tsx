import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full px-3 py-2 rounded-xl border shadow-sm text-sm",
        props.className
      )}
    />
  );
}
