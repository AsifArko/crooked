import React from "react";
import { UserAvatar } from "./UserAvatar";
import { OrganizationInfo } from "./OrganizationInfo";

interface Organization {
  login: string;
  avatarUrl: string;
}

interface UserHeaderProps {
  username: string;
  organizations?: Organization[];
  className?: string;
  avatarSize?: "sm" | "md" | "lg";
}

export const UserHeader: React.FC<UserHeaderProps> = ({
  username,
  organizations,
  className,
  avatarSize = "sm",
}) => {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {organizations && organizations.length > 0 ? (
        <OrganizationInfo organizations={organizations} />
      ) : (
        <>
          <UserAvatar
            src={undefined}
            alt={username}
            fallbackText={username}
            size={avatarSize}
            fallbackBgColor="bg-blue-500"
          />
          <span className="text-[11px] font-normal text-muted-foreground">
            @{username}
          </span>
        </>
      )}
    </div>
  );
};
