'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

import { useSignInAccount } from '@/lib/react-query/queries'
import { SigninValidation } from '@/lib/validation'
import { useUserContext } from '@/contexts/AuthContext'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input, Button, useToast } from '@/components/ui'
import { Loader } from '@/components/index'

const SigninForm = () => {
  const { toast } = useToast()
  const router = useRouter()
  const {
    checkAuthUser,
    isLoading: isUserLoading,
    isAuthenticated,
  } = useUserContext()

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Queries
  const { mutateAsync: signInAccount, isPending: isSigningInUser } =
    useSignInAccount()

  // Handler
  const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
    try {
      const session = await signInAccount(user)

      if (!session) {
        toast({ title: '로그인에 실패했습니다! 다시 시도해 주세요.' })
        return
      }

      const isLoggedIn = await checkAuthUser()

      if (isLoggedIn) {
        form.reset()
        router.push('/')
      } else {
        toast({ title: '로그인에 실패했습니다! 다시 시도해 주세요.' })
        return
      }
    } catch (error) {
      toast({ title: '서버 오류입니다! 다시 시도해 주세요.' })
      console.log({ error })
    }
  }

  if (isAuthenticated) router.push('/')

  return (
    <Form {...form}>
      <div className='flex flex-col items-center sm:w-420'>
        <Link href={'/'} className='flex justify-center items-center gap-1'>
          <MapPin width={64} height={64} />
          <span className='text-2xl font-extrabold'>Spectacle Marker</span>
        </Link>

        <h2 className='mt-5 text-3xl font-semibold md:font-bold'>
          계정 로그인
        </h2>
        <p className='mt-2 font-light'>서비스 이용을 위해 접속하세요!</p>

        <form
          onSubmit={form.handleSubmit(handleSignin)}
          className='flex flex-col gap-5 mt-4 w-full min-w-[360px]'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='shad-form_label'>이메일</FormLabel>
                <FormControl>
                  <Input type='text' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='shad-form_label'>비밀번호</FormLabel>
                <FormControl>
                  <Input type='password' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='shad-button_primary'>
            {isSigningInUser || isUserLoading ? (
              <div className='flex-center gap-2'>
                <Loader />
              </div>
            ) : (
              '로그인'
            )}
          </Button>

          <p className='text-small-regular text-light-2 text-center mt-2'>
            계정이 없나요?
            <Link
              href={'/signup'}
              className='ml-1 text-blue-500 underline font-semibold'
            >
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm
