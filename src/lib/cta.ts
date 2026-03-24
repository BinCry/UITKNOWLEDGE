import { CtaTargetType } from "@prisma/client";

export const buildTrackedCtaHref = ({
  targetType,
  targetUrl,
  source,
  targetId,
  targetLabel,
}: {
  targetType: CtaTargetType;
  targetUrl: string;
  source: string;
  targetId?: string;
  targetLabel?: string;
}) => {
  const params = new URLSearchParams({
    targetType,
    targetUrl,
    source,
  });

  if (targetId) {
    params.set("targetId", targetId);
  }

  if (targetLabel) {
    params.set("targetLabel", targetLabel);
  }

  return `/api/cta?${params.toString()}`;
};
