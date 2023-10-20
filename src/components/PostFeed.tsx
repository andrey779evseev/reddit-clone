'use client'

import Post from '@/components/Post'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { ExtendedPost } from '@/types/db'
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { memo, useEffect, useMemo, useRef } from 'react'

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
    threshold: 1
  })

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['infinite-query'],
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
      return lastPage.totalCount <= pages.map(x => x.posts).flat().length
        ? undefined
        : pages.length + 1
    },
    initialData: {
      pages: [{ posts: initialPosts, totalCount: initialTotalCount }],
      pageParams: [1]
    }
  })

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPage()
  }, [entry, fetchNextPage])

  const posts = useMemo(
    () => data?.pages.map(x => x.posts).flat() ?? initialPosts,
    [data, initialPosts]
  )

  return (
    <ul className='flex flex-col col-span-2 space-y-6'>
      {posts.map((post, index) => {
        const currentVote = post.votes.find(vote => vote.userId === userId)

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
    </ul>
  )
}

export default memo(PostFeed)
