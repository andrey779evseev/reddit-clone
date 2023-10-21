'use client'

import axios, { AxiosError } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { memo, startTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'

type PropsType = {
	subredditId: string
	subredditName: string
	isSubscribed: boolean
}

function SubscribeLeaveToggle(props: PropsType) {
	const { subredditId, subredditName, isSubscribed } = props
	const router = useRouter()

	const { loginToast } = useCustomToast()

	const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
		mutationFn: async () => {
			const payload: SubscribeToSubredditPayload = {
				subredditId,
			}

			const { data } = await axios.post<string>(
				'/api/subreddit/subscribe',
				payload,
			)
			return data
		},
		onError: (err) => {
			if (err instanceof AxiosError) {
				if (err.response?.status === 401) return loginToast()
			}

			return toast({
				title: 'There was a problem',
				description: 'Something went wrong, please try again',
				variant: 'destructive',
			})
		},
		onSuccess: () => {
			startTransition(() => {
				router.refresh()
			})

			return toast({
				title: 'Subscribed',
				description: `You are now subscribed to r/${subredditName}`,
			})
		},
	})

	const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
		mutationFn: async () => {
			const payload: SubscribeToSubredditPayload = {
				subredditId,
			}

			const { data } = await axios.post<string>(
				'/api/subreddit/unsubscribe',
				payload,
			)
			return data
		},
		onError: (err) => {
			if (err instanceof AxiosError) {
				if (err.response?.status === 401) return loginToast()
			}

			return toast({
				title: 'There was a problem',
				description: 'Something went wrong, please try again',
				variant: 'destructive',
			})
		},
		onSuccess: () => {
			startTransition(() => {
				router.refresh()
			})

			return toast({
				title: 'Unsubscribed',
				description: `You are now unsubscribed to r/${subredditName}`,
			})
		},
	})

	return isSubscribed ? (
		<Button
			className='mb-4 mt-1 w-full'
			onClick={() => unsubscribe()}
			isLoading={isUnsubLoading}
		>
			Leave community
		</Button>
	) : (
		<Button
			className='mb-4 mt-1 w-full'
			isLoading={isSubLoading}
			onClick={() => subscribe()}
		>
			Joint to post
		</Button>
	)
}

export default memo(SubscribeLeaveToggle)
