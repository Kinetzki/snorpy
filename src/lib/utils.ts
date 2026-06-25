import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const getStatusStyle = (status: number): string => {
    if (status >= 200 && status < 300) {
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20";
    }
    if (status >= 300 && status < 400) {
        return "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20";
    }
    if (status >= 400 && status < 500) {
        return "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20";
    }
    if (status >= 500) {
        return "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20";
    }
    return "bg-zinc-500/10 text-zinc-400 border-zinc-500/30"; // Fallback for 1xx or invalid codes
};

export const defaultStyle = "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";

export const methodStyles: Record<string, string> = {
    GET: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20",
    POST: "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20",
    PUT: "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20",
    DELETE: "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20",
    PATCH: "bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20",
    OPTIONS:
        "bg-zinc-500/10 text-zinc-400 border-zinc-500/30 hover:bg-zinc-500/20",
};