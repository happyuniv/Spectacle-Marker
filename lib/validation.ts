import * as z from 'zod'

export const SignupValidation = z.object({
  username: z.string().min(2, { message: '이름은 최소 두글자입니다.' }),
  email: z.string().email('유효한 이메일이 아닙니다.'),
  password: z.string().min(8, { message: '비밀번호는 최소 8글자입니다.' }),
})

export const SigninValidation = z.object({
  email: z.string().email('유효한 이메일이 아닙니다.'),
  password: z.string().min(8, { message: '비밀번호는 최소 8글자입니다.' }),
})

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  username: z.string().min(2, { message: '이름은 최소 두글자입니다.' }),
  email: z.string().email('유효한 이메일이 아닙니다.'),
})
