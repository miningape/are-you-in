import { z } from "zod";

export const UserClaims = z.object({
  given_name: z.optional(z.string()),
  family_name: z.optional(z.string()),
  nickname: z.string(),
  picture: z.string(),
  email: z.string(),
});
