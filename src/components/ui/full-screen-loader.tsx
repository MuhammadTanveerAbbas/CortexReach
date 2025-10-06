
"use client";

import { Loader } from "lucide-react";

export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
      <div className="flex flex-col items-center">
        <Loader className="h-12 w-12 animate-spin text-primary" />
      </div>
    </div>
  );
}
