'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Icons } from '@/components/Icons'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/use-toast'

export default function UserAuthForm() {
	const [isLoading, setIsLoading] = useState(false)
	const { toast } = useToast()

	const loginWithGoogle = async () => {
		setIsLoading(true)

		try {
			await signIn('google')
		} catch (error) {
			toast({
				title: 'There was a problem',
				description: 'There was an error logging in with Google',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}
	return (
		<div className='flex justify-center'>
			<Button
				size='sm'
				className='w-full'
				isLoading={isLoading}
				onClick={loginWithGoogle}
			>
				{isLoading ? null : <Icons.google className='mr-2 h-4 w-4' />}
				Google
			</Button>
		</div>
	)
}
