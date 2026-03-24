import { CtaTargetType } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const isValidTargetType = (value: string): value is CtaTargetType =>
  ["HERO", "COURSE", "PRODUCT", "VIDEO", "CONTACT"].includes(value);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetType = searchParams.get("targetType");
  const targetUrl = searchParams.get("targetUrl");

  if (!targetType || !targetUrl || !isValidTargetType(targetType)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    await prisma.ctaClickEvent.create({
      data: {
        targetType,
        targetId: searchParams.get("targetId") ?? undefined,
        targetLabel: searchParams.get("targetLabel") ?? undefined,
        targetUrl,
        source: searchParams.get("source") ?? undefined,
        referrer: request.headers.get("referer") ?? undefined,
      },
    });
  } catch (error) {
    console.error("Failed to log CTA click", error);
  }

  return NextResponse.redirect(targetUrl);
}
