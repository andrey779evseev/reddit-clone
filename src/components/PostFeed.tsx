'use client'

import Post from '@/components/Post'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { ExtendedPost } from '@/types/db'
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { memo, useMemo, useRef } from 'react'

type PropsType = {
  initialPosts: ExtendedPost[]
  subredditName?: string
  userId: string
}

function PostFeed(props: PropsType) {
  const { initialPosts, subredditName, userId } = props
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

      const { data } = await axios.get<ExtendedPost[]>(query)
      return data
    },
    getNextPageParam: (_, pages) => {
      return pages.length + 1
    },
    initialData: {
      pages: [initialPosts],
      pageParams: [1]
    }
  })

  const posts = useMemo(
    () => data?.pages.flat() ?? initialPosts,
    [data, initialPosts]
  )

  return (
    <ul className='flex flex-col col-span-2 space-y-6'>
      {posts.map((post, index) => {
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === 'UP') return acc + 1
          if (vote.type === 'DOWN') return acc - 1
          return acc
        }, 0)

        const currentVote = post.votes.find(vote => vote.userId === userId)

        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post post={post}/>
            </li>
          )
        }

        return (
          <li key={post.id}>
            <Post post={post}/>
          </li>
        )
      })}
    </ul>
  )
}

export default memo(PostFeed)
