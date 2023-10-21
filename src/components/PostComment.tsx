'use client'

import CommentVotes from '@/components/CommentVotes'
import CreateComment from '@/components/CreateComment'
import UserAvatar from '@/components/UserAvatar'
import { Button } from '@/components/ui/Button'
import { formatTimeToNow } from '@/lib/utils'
import { Comment, CommentVote, User } from '@prisma/client'
import { MessageSquare } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'

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
    [comment]
  )

  return (
    <div className='flex flex-col' ref={commentRef}>
      <div className='flex items-center'>
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null
          }}
          className='h-6 w-6'
        />
        <div className='ml-2 flex items-center gap-x-2'>
          <p className='text-sm font-medium text0gray-900'>
            u/{comment.author.username}
          </p>
          <p className='max-h-40 truncate text-xs text-zinc-500'>
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className='text-sm text-zinc-900 mt-2'>{comment.text}</p>

      <div className='flex flex-wrap gap-2 items-center'>
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
          <MessageSquare className='h-4 w-4 mr-1.5' />
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
