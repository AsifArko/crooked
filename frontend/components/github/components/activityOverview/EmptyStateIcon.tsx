import React from "react";

interface EmptyStateIconProps {
  className?: string;
}

export const EmptyStateIcon: React.FC<EmptyStateIconProps> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a2 2 0 00-2 2v1H4a2 2 0 01-2-2V6zm5 0a1 1 0 011-1h2a1 1 0 011 1v1H7V6z"
      clipRule="evenodd"
    />
  </svg>
);
