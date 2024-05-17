import { z } from 'zod';

export const signInSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .min(1, 'Email is required')
      .email('Invalid email'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required'),
  })
  .strip();

export type SignInDto = z.TypeOf<typeof signInSchema>;

export const signUpSchema = z
  .object({
    firstName: z
      .string({ required_error: 'First name is required' })
      .min(1, 'First name is required'),
    lastName: z
      .string({ required_error: 'Last name is required' })
      .min(1, 'Last name is required'),
    email: z
      .string({ required_error: 'Email is required' })
      .min(1, 'Email is required')
      .email('Invalid email'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string({ required_error: 'Password confirmation is required' })
      .min(1, 'Password confirmation is required'),
  })
  .strip()
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
  });

export type SignUpDto = z.TypeOf<typeof signUpSchema>;
