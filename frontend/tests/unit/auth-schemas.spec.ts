import { test, expect } from "@playwright/test";
import {
  RegisterSchema,
  LoginSchema,
  UpdateProfileSchema,
  ChangePasswordSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from "../../lib/validations/auth-schemas";

const validUser = {
  firstName: "Pratap",
  lastName: "Rai",
  email: "pratap@example.com",
  password: "Password123",
};

test.describe("RegisterSchema", () => {
  test("accepts valid registration data", () => {
    const result = RegisterSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  test("rejects an empty first name", () => {
    const result = RegisterSchema.safeParse({ ...validUser, firstName: "" });
    expect(result.success).toBe(false);
  });

  test("rejects an invalid email format", () => {
    const result = RegisterSchema.safeParse({ ...validUser, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  test("rejects a password under 6 characters", () => {
    const result = RegisterSchema.safeParse({ ...validUser, password: "Ab1" });
    expect(result.success).toBe(false);
  });

  test("rejects a password without an uppercase letter", () => {
    const result = RegisterSchema.safeParse({ ...validUser, password: "password123" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.message.includes("uppercase"))).toBe(true);
    }
  });

  test("rejects a password without a number", () => {
    const result = RegisterSchema.safeParse({ ...validUser, password: "PasswordOnly" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.message.includes("number"))).toBe(true);
    }
  });

  test("accepts a password with exactly the minimum requirements", () => {
    const result = RegisterSchema.safeParse({ ...validUser, password: "Abcde1" });
    expect(result.success).toBe(true);
  });
});

test.describe("LoginSchema", () => {
  test("accepts a valid email and non-empty password", () => {
    const result = LoginSchema.safeParse({ email: "pratap@example.com", password: "anything" });
    expect(result.success).toBe(true);
  });

  test("rejects an empty password", () => {
    const result = LoginSchema.safeParse({ email: "pratap@example.com", password: "" });
    expect(result.success).toBe(false);
  });

  test("rejects a malformed email", () => {
    const result = LoginSchema.safeParse({ email: "not-an-email", password: "anything" });
    expect(result.success).toBe(false);
  });
});

test.describe("UpdateProfileSchema", () => {
  test("accepts an empty object since all fields are optional", () => {
    const result = UpdateProfileSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  test("rejects an invalid email when provided", () => {
    const result = UpdateProfileSchema.safeParse({ email: "bad-email" });
    expect(result.success).toBe(false);
  });

  test("rejects an empty first name when explicitly provided", () => {
    const result = UpdateProfileSchema.safeParse({ firstName: "" });
    expect(result.success).toBe(false);
  });
});

test.describe("ChangePasswordSchema", () => {
  test("accepts matching valid passwords", () => {
    const result = ChangePasswordSchema.safeParse({
      password: "NewPass123",
      confirmPassword: "NewPass123",
    });
    expect(result.success).toBe(true);
  });

  test("rejects mismatched passwords", () => {
    const result = ChangePasswordSchema.safeParse({
      password: "NewPass123",
      confirmPassword: "Different123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.message.includes("do not match"))).toBe(true);
    }
  });

  test("rejects a weak new password even if confirmed correctly", () => {
    const result = ChangePasswordSchema.safeParse({
      password: "weak",
      confirmPassword: "weak",
    });
    expect(result.success).toBe(false);
  });
});

test.describe("ForgotPasswordSchema", () => {
  test("accepts a valid email", () => {
    const result = ForgotPasswordSchema.safeParse({ email: "pratap@example.com" });
    expect(result.success).toBe(true);
  });

  test("rejects an invalid email", () => {
    const result = ForgotPasswordSchema.safeParse({ email: "invalid" });
    expect(result.success).toBe(false);
  });
});

test.describe("ResetPasswordSchema", () => {
  test("accepts matching strong passwords", () => {
    const result = ResetPasswordSchema.safeParse({
      password: "ResetPass1",
      confirmPassword: "ResetPass1",
    });
    expect(result.success).toBe(true);
  });

  test("rejects mismatched confirmation", () => {
    const result = ResetPasswordSchema.safeParse({
      password: "ResetPass1",
      confirmPassword: "WrongOne1",
    });
    expect(result.success).toBe(false);
  });
});