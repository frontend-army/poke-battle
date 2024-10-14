import { useEffect, useState } from "react";
import redPc from "../assets/red-pc.png";

export default function Loading({
  text,
  delay,
  timeout,
}: {
  text: string;
  delay?: number;
  timeout?: number;
}) {
  const [showLoading, setShowLoading] = useState(!delay);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (delay) {
      let timer = setTimeout(() => setShowLoading(true), delay);
      return function cleanUp() {
        clearTimeout(timer);
      };
    }
  }, [delay]);

  useEffect(() => {
    if (timeout) {
      let timer = setTimeout(() => setShowWarning(true), timeout);
      return function cleanUp() {
        clearTimeout(timer);
      };
    }
  }, [timeout]);

  if (!showLoading) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="loading loading-ring loading-lg text-accent" />
      <p className="text-lg font-semibold">{text}</p>
      {showWarning && (
        <>
          <p className="transition-all text-lg font-semibold">
            This may take a few more seconds
          </p>
          <img className="transition-all" src={redPc.src} alt="" width="80" />
        </>
      )}
    </div>
  );
}
