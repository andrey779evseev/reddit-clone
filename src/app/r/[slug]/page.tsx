import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { notFound } from 'next/navigation'
import MiniCreatePost from '@/components/MiniCreatePost'
import PostFeed from '@/components/PostFeed'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'

type PropsType = {
	params: {
		slug: string
	}
}

export default async function SubredditPage(props: PropsType) {
	const {
		params: { slug },
	} = props

	const session = await getAuthSession()

	const subreddit = await db.subreddit.findFirst({
		where: {
			name: slug,
		},
		include: {
			posts: {
				include: {
					author: true,
					votes: true,
					comments: true,
					subreddit: true,
				},
				orderBy: {
					createdAt: 'desc',
				},
				take: INFINITE_SCROLLING_PAGINATION_RESULTS,
			},
		},
	})

	if (!subreddit) return notFound()

	const totalCount = await db.post.count({
		where: {
			subreddit: {
				name: slug,
			},
		},
	})

	return (
		<>
			<h1 className='h-14 text-3xl font-bold md:text-4xl'>
				r/{subreddit.name}
			</h1>
			<MiniCreatePost session={session} />
			<PostFeed
				initialPosts={subreddit.posts}
				subredditName={subreddit.name}
				userId={session?.user.id!}
				initialTotalCount={totalCount}
			/>
		</>
	)
}
