import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export default function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "px-3 py-2 rounded-xl border shadow-sm hover:shadow transition text-sm",
        className
      )}
      {...props}
    />
  );
}
