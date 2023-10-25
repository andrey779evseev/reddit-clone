'use client'

import { Comment, CommentVote, User } from '@prisma/client'
import { MessageSquare } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import CommentVotes from '@/components/CommentVotes'
import CreateComment from '@/components/CreateComment'
import { Button } from '@/components/ui/Button'
import UserAvatar from '@/components/UserAvatar'
import { formatTimeToNow } from '@/lib/utils'

type PropsType = {
	comment: Comment & {
		author: User
		votes: CommentVote[]
	}
	currentVote: CommentVote | undefined
}

export default function PostComment(props: PropsType) {
	const { comment, currentVote } = props
	const commentRef = useRef<HTMLDivElement>(null)
	const router = useRouter()
	const { data: session } = useSession()
	const [isReplying, setIsReplying] = useState(false)

	const votesAmt = useMemo(
		() =>
			comment.votes.reduce((acc, vote) => {
				if (vote.type === 'UP') return acc + 1
				if (vote.type === 'DOWN') return acc - 1
				return acc
			}, 0),
		[comment],
	)

	return (
		<div className='flex flex-col' ref={commentRef}>
			<div className='flex items-center'>
				<UserAvatar
					user={{
						name: comment.author.name || null,
						image: comment.author.image || null,
					}}
					className='h-6 w-6'
				/>
				<div className='ml-2 flex items-center gap-x-2'>
					<p className='text-sm font-medium text-gray-900'>
						u/{comment.author.username}
					</p>
					<p
						className='max-h-40 truncate text-xs text-zinc-500'
						suppressHydrationWarning
					>
						{formatTimeToNow(new Date(comment.createdAt))}
					</p>
				</div>
			</div>

			<p className='mt-2 text-sm text-zinc-900'>{comment.text}</p>

			<div className='flex flex-wrap items-center gap-2'>
				<CommentVotes
					commentId={comment.id}
					initialVotesAmt={votesAmt}
					initialVote={currentVote}
				/>

				<Button
					onClick={() => {
						if (!session) return router.push('/sign-in')
						setIsReplying(true)
					}}
					variant='ghost'
					size='xs'
				>
					<MessageSquare className='mr-1.5 h-4 w-4' />
					Reply
				</Button>

				{isReplying ? (
					<CreateComment
						postId={comment.postId}
						replyToId={comment.replyToId ?? comment.id}
						close={() => setIsReplying(false)}
					/>
				) : null}
			</div>
		</div>
	)
}
