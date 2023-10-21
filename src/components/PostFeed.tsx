'use client'

import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { useIntersection } from '@mantine/hooks'
import axios from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { memo, useEffect, useMemo, useRef } from 'react'
import Post from '@/components/Post'
import { ExtendedPost } from '@/types/db'

type PropsType = {
	initialPosts: ExtendedPost[]
	subredditName?: string
	userId?: string
	initialTotalCount: number
}

function PostFeed(props: PropsType) {
	const { initialPosts, subredditName, userId, initialTotalCount } = props
	const lastPostRef = useRef<HTMLElement>(null)
	const { ref, entry } = useIntersection({
		root: lastPostRef.current,
		threshold: 1,
	})

	const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
		queryKey: ['infinite-query', subredditName],
		queryFn: async ({ pageParam = 1 }) => {
			const query =
				`/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
				(!!subredditName ? `&subredditName=${subredditName}` : '')

			const { data } = await axios.get<{
				posts: ExtendedPost[]
				totalCount: number
			}>(query)
			return data
		},
		enabled: initialPosts.length < initialTotalCount,
		getNextPageParam: (lastPage, pages) => {
			return lastPage.totalCount <= pages.map((x) => x.posts).flat().length
				? undefined
				: pages.length + 1
		},
		initialData: {
			pages: [{ posts: initialPosts, totalCount: initialTotalCount }],
			pageParams: [1],
		},
	})

	useEffect(() => {
		if (entry?.isIntersecting) fetchNextPage()
	}, [entry, fetchNextPage])

	const posts = useMemo(
		() => data?.pages.map((x) => x.posts).flat() ?? initialPosts,
		[data, initialPosts],
	)

	return (
		<ul className='col-span-2 flex flex-col space-y-6'>
			{posts.map((post, index) => {
				const currentVote = post.votes.find((vote) => vote.userId === userId)

				if (index === posts.length - 1) {
					return (
						<li key={post.id} ref={ref}>
							<Post post={post} currentVote={currentVote} />
						</li>
					)
				}

				return (
					<li key={post.id}>
						<Post post={post} currentVote={currentVote} />
					</li>
				)
			})}

			{isFetchingNextPage && (
				<li className='flex justify-center'>
					<Loader2 className='h-6 w-6 animate-spin text-zinc-500' />
				</li>
			)}
		</ul>
	)
}

export default memo(PostFeed)
