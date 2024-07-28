import { useEffect, useState } from "react";

export default function Joining() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowWarning(true), 5000);
  });

  return (
    <div className="flex flex-col items-center">
      <p className="text-lg font-semibold">Joining a game...</p>
      <span className="loading loading-ring loading-lg text-accent" />
      {showWarning && (
        <p className="text-lg font-semibold">
          This may take a few more seconds...
        </p>
      )}
    </div>
  );
}
