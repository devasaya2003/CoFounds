import { useState, useEffect } from "react";
import { StatusMessage } from "../../components/types";

export function useStatusMessage() {
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

  // Auto-clear status messages after 5 seconds
  useEffect(() => {
    if (!statusMessage) return;

    const timer = setTimeout(() => {
      setStatusMessage(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [statusMessage]);

  return {
    statusMessage,
    setStatusMessage
  };
}