import React from "react";
interface EmptyStateProps {
  text: string;
}
function EmptyState({ text }: EmptyStateProps) {
  return (
    <div className="h-60 flex items-center justify-center">
      <p className="text-center text-gray-500">{text}</p>
    </div>
  );
}

export default EmptyState;
