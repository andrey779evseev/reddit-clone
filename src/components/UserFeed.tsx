import PostFeed from '@/components/PostFeed'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'

export default async function UserFeed() {
  const session = await getAuthSession()

  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session?.user.id
    },
    include: {
      subreddit: true
    }
  })

  const communitiesNames = followedCommunities.map(x => x.subreddit.name)

  const [posts, count] = await Promise.all([
    await db.post.findMany({
      where: {
        subreddit: {
          name: {
            in: communitiesNames
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: true,
        subreddit: true,
        votes: true,
        comments: true
      },
      take: INFINITE_SCROLLING_PAGINATION_RESULTS
    }),
    await db.post.count({
      where: {
        subreddit: {
          name: {
            in: communitiesNames
          }
        }
      }
    })
  ])

  return <PostFeed initialPosts={posts} initialTotalCount={count} userId={session?.user.id}/>
}
