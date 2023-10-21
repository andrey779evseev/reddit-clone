'use client'

import { Vote } from '@prisma/client'
import { MessageSquare } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import EditorOutput from '@/components/EditorOutput'
import PostVoteClient from '@/components/post-vote/PostVoteClient'
import { formatTimeToNow } from '@/lib/utils'
import { ExtendedPost } from '@/types/db'

type PropsType = {
	post: ExtendedPost
	currentVote?: Pick<Vote, 'type'>
}

export default function Post(props: PropsType) {
	const { post, currentVote } = props
	const [pRef, setPRef] = useState<HTMLDivElement | null>(null)
	const subredditName = useMemo(() => post.subreddit.name, [post])
	const votesAmt = useMemo(
		() =>
			post.votes.reduce((acc, vote) => {
				if (vote.type === 'UP') return acc + 1
				if (vote.type === 'DOWN') return acc - 1
				return acc
			}, 0),
		[post.votes],
	)

	useEffect(() => {
		console.log(pRef?.clientHeight)
	}, [pRef?.clientHeight])

	return (
		<div className='rounded-md bg-white shadow'>
			<div className='flex flex-col items-center justify-between px-6 py-4 sm:flex-row sm:items-start'>
				<PostVoteClient
					postId={post.id}
					initialVote={currentVote?.type}
					initialVotesAmt={votesAmt}
				/>

				<div className='flex-1 self-start'>
					<div className='mt-1 max-h-40 text-xs text-gray-500'>
						{subredditName ? (
							<>
								<a
									href={`/r/${subredditName}`}
									className='text-sm text-zinc-900 underline underline-offset-2'
								>
									r/{subredditName}
								</a>
								<span className='px-1'>•</span>
							</>
						) : null}
						<span>Posted by u/{post.author.username}</span>{' '}
						{formatTimeToNow(new Date(post.createdAt))}
					</div>

					<a href={`/r/${subredditName}/post/${post.id}`}>
						<h1 className='py-2 text-lg font-semibold leading-6 text-gray-900'>
							{post.title}
						</h1>
					</a>

					<div
						className='relative max-h-40 w-full overflow-clip text-sm'
						ref={setPRef}
					>
						<EditorOutput content={post.content} />

						<div className='absolute left-0 top-16 h-24 w-full bg-gradient-to-t from-white to-transparent' />
					</div>
				</div>
			</div>

			<div className='z-20 bg-gray-50 p-4 text-sm sm:px-6'>
				<a
					className='flex w-fit items-center gap-2'
					href={`/r/${subredditName}/post/${post.id}`}
				>
					<MessageSquare className='h-4 w-4' />
					{post.comments.length} comments
				</a>
			</div>
		</div>
	)
}
