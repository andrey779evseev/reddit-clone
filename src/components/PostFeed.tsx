'use client'

import { ExtendedPost } from '@/types/db'
import { memo, useRef } from 'react'
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import axios from 'axios'

type PropsType = {
  initialPosts: ExtendedPost[]
  subredditName?: string
}

function PostFeed(props: PropsType) {
  const { initialPosts, subredditName } = props
  const lastPostRef = useRef<HTMLElement>(null)
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1
  })

  const {} = useInfiniteQuery({
    queryKey: ['infinite-query'],
    queryFn: async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subredditName ? `&subredditName=${subredditName}` : '')

      const {data} = await axios.get<ExtendedPost[]>(query)
      return data
    },
    getNextPageParam: (_, pages) => {}
  })

  return <ul className='flex flex-col col-span-2 space-y-6'></ul>
}

export default memo(PostFeed)
