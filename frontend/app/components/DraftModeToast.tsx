"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DraftModeToast() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    toast.success("Draft mode enabled", {
      description: "You are viewing the site in draft mode.",
      duration: 5000,
    });
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg">
        <p className="text-sm font-medium">Draft Mode</p>
        <p className="text-xs opacity-90">
          You are viewing unpublished content
        </p>
      </div>
    </div>
  );
}
