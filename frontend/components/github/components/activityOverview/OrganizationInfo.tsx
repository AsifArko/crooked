import React from "react";
import { UserAvatar } from "./UserAvatar";

interface Organization {
  login: string;
  avatarUrl: string;
}

interface OrganizationInfoProps {
  organizations: Organization[];
  maxDisplayed?: number;
  className?: string;
}

export const OrganizationInfo: React.FC<OrganizationInfoProps> = ({
  organizations,
  maxDisplayed = 2,
  className,
}) => {
  if (!organizations || organizations.length === 0) {
    return null;
  }

  const displayedOrgs = organizations.slice(0, maxDisplayed);
  const remainingCount = organizations.length - displayedOrgs.length;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {displayedOrgs.map((org, index) => (
        <React.Fragment key={org.login}>
          <UserAvatar
            src={org.avatarUrl}
            alt={org.login}
            fallbackText={org.login}
            size="sm"
            fallbackBgColor={index === 0 ? "bg-blue-500" : "bg-gray-800"}
          />
          <span className="text-[11px] font-normal text-muted-foreground">
            @{org.login}
          </span>
        </React.Fragment>
      ))}
      {remainingCount > 0 && (
        <span className="text-[11px] font-normal text-muted-foreground">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
};
