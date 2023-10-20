'use client'

import UserAvatar from '@/components/UserAvatar'
import { formatTimeToNow } from '@/lib/utils'
import { Comment, CommentVote, User } from '@prisma/client'
import { useRef } from 'react'

type PropsType = {
  comment: Comment & {
    author: User
    votes: CommentVote[]
  }
}

export default function PostComment(props: PropsType) {
  const { comment } = props
  const commentRef = useRef<HTMLDivElement>(null)
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
        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text0gray-900">u/{comment.author.username}</p>
          <p className="max-h-40 truncate text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>

      <div className="flex gap-2 items-center">
        
      </div>
    </div>
  )
}
