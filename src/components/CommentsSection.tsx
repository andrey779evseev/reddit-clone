import CreateComment from '@/components/CreateComment'
import PostComment from '@/components/PostComment'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'

type PropsType = {
  postId: string
}

export default async function CommentsSection(props: PropsType) {
  const { postId } = props

  const session = await getAuthSession()

  const comments = await db.comment.findMany({
    where: {
      postId,
      replyToId: null
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true
        }
      }
    }
  })
  return (
    <div className='flex flex-col gap-y-4 mt-4'>
      <hr className='w-full h-px my-6' />

      <CreateComment postId={postId} />

      <div className='flex flex-col gap-y-6 mt-4'>
        {comments
          .filter(comment => !comment.replyToId)
          .map(topLevelComment => {
            const topLevelCommentVote = topLevelComment.votes.find(
              vote => vote.userId === session?.user.id
            )

            return (
              <div key={topLevelComment.id} className='flex flex-col'>
                <div className='mb-2'>
                  <PostComment
                    comment={topLevelComment}
                    currentVote={topLevelCommentVote}
                  />
                </div>

                {topLevelComment.replies
                  .toSorted((a, b) => b.votes.length - a.votes.length)
                  .map(reply => {
                    const replyVote = reply.votes.find(
                      vote => vote.userId === session?.user.id
                    )

                    return (
                      <div
                        key={reply.id}
                        className='ml-2 py-2 pl-4 border-l border-zinc-200'
                      >
                        <PostComment comment={reply} currentVote={replyVote} />
                      </div>
                    )
                  })}
              </div>
            )
          })}
      </div>
    </div>
  )
}
