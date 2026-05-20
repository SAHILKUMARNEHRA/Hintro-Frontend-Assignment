import { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "../context/UserContext.jsx";

const PROD_BASE_URL = "https://mock-backend-hintro.vercel.app";
const BASE_URL = import.meta.env.DEV ? "" : PROD_BASE_URL;

export function useApi(path) {
  const { userId } = useUser();
  const abortRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(async () => {
    if (!path) return;
    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        method: "GET",
        headers: { "x-user-id": userId },
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed (${res.status})`);
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      if (err?.name === "AbortError") return;
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [path, userId]);

  useEffect(() => {
    run();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [run]);

  return { data, loading, error, refetch: run };
}
