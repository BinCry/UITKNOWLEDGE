import { z } from "zod";
import type { ZodTypeAny } from "zod";

export const parseBody = async <T extends ZodTypeAny>(request: Request, schema: T) => {
  const body = (await request.json()) as unknown;
  return schema.parse(body) as z.infer<T>;
};
