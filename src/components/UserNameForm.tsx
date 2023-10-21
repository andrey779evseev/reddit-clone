'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import axios, { AxiosError } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { memo } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { UsernameRequest, UsernameValidator } from '@/lib/validators/username'
import { toast } from '@/hooks/use-toast'

type PropsType = {
	user: Pick<User, 'id' | 'username'>
}

function UserNameForm(props: PropsType) {
	const { user } = props
	const router = useRouter()
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<UsernameRequest>({
		resolver: zodResolver(UsernameValidator),
		defaultValues: {
			name: user?.username || '',
		},
	})

	const { mutate: updateUsername, isLoading } = useMutation({
		mutationFn: async (payload: UsernameRequest) => {
			await axios.patch('/api/username', payload)
		},
		onError: (err) => {
			if (err instanceof AxiosError) {
				if (err.response?.status === 409)
					return toast({
						title: 'Username already taken.',
						description: 'Please choose a different username.',
						variant: 'destructive',
					})
			}
			return toast({
				title: 'There was an error.',
				description: 'Could not change username.',
				variant: 'destructive',
			})
		},
		onSuccess: () => {
			toast({
				description: 'Your username has been updated.',
			})
			router.refresh()
		},
	})

	return (
		<form
			onSubmit={handleSubmit((e) => updateUsername(e))}
			className='max-w-4xl'
		>
			<Card>
				<CardHeader>
					<CardTitle>Your username</CardTitle>
					<CardDescription>
						Please enter a display name you are comfortable with.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='relative grid gap-1'>
						<div className='absolute left-0 top-0 grid h-10 w-8 place-items-center'>
							<span className='text-sm text-zinc-400'>u/</span>
						</div>

						<Label className='sr-only' htmlFor='name'>
							Name
						</Label>
						<Input
							id='name'
							className='w-5/6 pl-6 sm:w-[400px]'
							size={32}
							{...register('name')}
						/>

						{errors.name && (
							<p className='px-1 text-xs text-red-600'>{errors.name.message}</p>
						)}
					</div>
				</CardContent>

				<CardFooter>
					<Button isLoading={isLoading} type='submit'>
						Change name
					</Button>
				</CardFooter>
			</Card>
		</form>
	)
}

export default memo(UserNameForm)
