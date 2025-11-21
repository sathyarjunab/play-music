import zod from "zod";

// User
export const signupValidation = zod.object({
  name: zod.string(),
  email: zod.email(),
  password: zod.string().min(8),
});

export const loginValidation = signupValidation.omit({ name: true });
