import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import PostFeed from '@/components/PostFeed'
import { db } from '@/lib/db'

export default async function GuestFeed() {
	const [posts, count] = await Promise.all([
		db.post.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				votes: true,
				author: true,
				comments: true,
				subreddit: true,
			},
			take: INFINITE_SCROLLING_PAGINATION_RESULTS,
		}),
		db.post.count(),
	])

	return <PostFeed initialPosts={posts} initialTotalCount={count} />
}
