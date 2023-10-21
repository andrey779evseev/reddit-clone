'use client'

import axios, { AxiosError } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { memo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { CommentRequest } from '@/lib/validators/comment'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'

type PropsType = {
	postId: string
	replyToId?: string
	close?: () => void
}

function CreateComment(props: PropsType) {
	const { postId, replyToId, close } = props
	const [input, setInput] = useState('')
	const { loginToast } = useCustomToast()
	const router = useRouter()

	const { mutate: comment, isLoading } = useMutation({
		mutationFn: async (payload: CommentRequest) => {
			await axios.patch('/api/subreddit/post/comment', payload)
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
			if (close) close()
			router.refresh()
			setInput('')
		},
	})

	return (
		<div className='grid w-full gap-1.5'>
			<Label htmlFor='comment'>Your comment</Label>
			<div className='mt-2'>
				<Textarea
					id='comment'
					value={input}
					onChange={(e) => setInput(e.target.value)}
					rows={1}
					placeholder='What are your thoughts?'
				/>

				<div className='mt-2 flex justify-end gap-2'>
					{close ? (
						<Button onClick={() => close()} tabIndex={-1} variant='subtle'>
							Cancel
						</Button>
					) : null}
					<Button
						isLoading={isLoading}
						disabled={input.length === 0}
						onClick={() =>
							comment({
								postId,
								text: input,
								replyToId,
							})
						}
					>
						Post
					</Button>
				</div>
			</div>
		</div>
	)
}

export default memo(CreateComment)
