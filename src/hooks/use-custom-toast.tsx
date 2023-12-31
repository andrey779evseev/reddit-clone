import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'
import { toast } from '@/hooks/use-toast'

export function useCustomToast() {
	const loginToast = () => {
		const { dismiss } = toast({
			title: 'Login required.',
			description: 'You need to be logged in to do that.',
			variant: 'destructive',
			action: (
				<Link
					className={buttonVariants({ variant: 'outline' })}
					href='/sign-in'
					onClick={() => dismiss()}
				>
					Login
				</Link>
			),
		})
	}

	return { loginToast }
}
