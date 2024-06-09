'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

import {
  useCreateUserAccount,
  useSignInAccount,
} from '@/lib/react-query/queries'
import { SignupValidation } from '@/lib/validation'
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

const SignupForm = () => {
  const { toast } = useToast()
  const router = useRouter()
  const {
    checkAuthUser,
    isLoading: isUserLoading,
    isAuthenticated,
  } = useUserContext()

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  // Queries
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccount()
  const { mutateAsync: signInAccount, isPending: isSigningInUser } =
    useSignInAccount()

  // Handler
  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    try {
      const newUser = await createUserAccount(user)

      if (!newUser) {
        toast({ title: '회원가입에 실패했습니다! 다시 시도해 주세요.' })
        return
      }

      const session = await signInAccount({
        email: user.email,
        password: user.password,
      })

      if (!session) {
        toast({
          title:
            '세션 생성중 오류가 발생했습니다! 생성된 계정에 다시 로그인해주세요.',
        })
        router.push('/signin')
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

        <h2 className='mt-5 text-3xl font-semibold md:font-bold'>계정 생성</h2>
        <p className='mt-2 font-light'>
          계정 생성을 위해, 상세정보를 입력하세요!
        </p>

        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className='flex flex-col gap-5 mt-4 w-full min-w-[360px]'
        >
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='shad-form_label'>닉네임</FormLabel>
                <FormControl>
                  <Input type='text' className='' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='shad-form_label'>이메일</FormLabel>
                <FormControl>
                  <Input type='text' className='' {...field} />
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
                  <Input type='password' className='' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='shad-button_primary'>
            {isCreatingAccount || isSigningInUser || isUserLoading ? (
              <div className='flex-center gap-2'>
                <Loader />
              </div>
            ) : (
              '회원가입'
            )}
          </Button>

          <p className='text-small-regular text-light-2 text-center mt-2'>
            이미 계정이 있나요?
            <Link
              href={'/signin'}
              className='ml-1 text-blue-500 underline font-semibold'
            >
              로그인
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm
