"use client";

import { useCallback, useEffect, useState } from "react";

const SESSION_KEY = "crooked_session_id";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function useSessionId(): string {
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  return sessionId;
}

export { getOrCreateSessionId };
