'use client'

import EditorOutput from '@/components/EditorOutput'
import PostVoteClient from '@/components/post-vote/PostVoteClient'
import { formatTimeToNow } from '@/lib/utils'
import { ExtendedPost } from '@/types/db'
import { Vote } from '@prisma/client'
import { MessageSquare } from 'lucide-react'
import { useMemo, useRef } from 'react'

type PropsType = {
  post: ExtendedPost
  currentVote?: Pick<Vote, 'type'>
}

export default function Post(props: PropsType) {
  const { post, currentVote } = props
  const pRef = useRef<HTMLDivElement>(null)
  const subredditName = useMemo(() => post.subreddit.name, [post])
  const votesAmt = useMemo(
    () =>
      post.votes.reduce((acc, vote) => {
        if (vote.type === 'UP') return acc + 1
        if (vote.type === 'DOWN') return acc - 1
        return acc
      }, 0),
    [post.votes]
  )
  return (
    <div className='rounded-md bg-white shadow'>
      <div className='px-6 py-4 flex justify-between'>
        <PostVoteClient
          postId={post.id}
          initialVote={currentVote?.type}
          initialVotesAmt={votesAmt}
        />

        <div className='w-0 flex-1'>
          <div className='max-h-40 mt-1 text-xs text-gray-500'>
            {subredditName ? (
              <>
                <a
                  href={`/r/${subredditName}`}
                  className='underline text-zinc-900 text-sm underline-offset-2'
                >
                  r/{subredditName}
                </a>
                <span className='px-1'>•</span>
              </>
            ) : null}
            <span>Posted by u/{post.author.name}</span>{' '}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>

          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className='text-lg font-semibold py-2 leading-6 text-gray-900'>
              {post.title}
            </h1>
          </a>

          <div
            className='relative text-sm max-h-40 w-full overflow-clip'
            ref={pRef}
          >
            <EditorOutput content={post.content} />

            {pRef.current?.clientHeight === 160 ? (
              <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent' />
            ) : null}
          </div>
        </div>
      </div>

      <div className='bg-gray-50 z-20 text-sm p-4 sm:px-6'>
        <a
          className='w-fit flex gap-2 items-center'
          href={`/r/${subredditName}/post/${post.id}`}
        >
          <MessageSquare className='h-4 w-4' />
          {post.comments.length} comments
        </a>
      </div>
    </div>
  )
}