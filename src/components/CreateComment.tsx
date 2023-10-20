'use client'

import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'
import { CommentRequest } from '@/lib/validators/comment'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { memo, useState } from 'react'

type PropsType = {
  postId: string
  replyToId?: string
}

function CreateComment(props: PropsType) {
  const {postId, replyToId} = props
  const [input, setInput] = useState('')
  const { loginToast } = useCustomToast()
  const router = useRouter()

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async (payload: CommentRequest) => {
      await axios.patch('/api/subreddit/post/comment', payload)
    },
    onError: err => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) return loginToast()
      }

      return toast({
        title: 'There was a problem',
        description: 'Something went wrong, please try again',
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      router.refresh()
      setInput('')
    }
  })
  return (
    <div className='grid w-full gap-1.5'>
      <Label htmlFor='comment'>Your comment</Label>
      <div className='mt'>
        <Textarea
          id='comment'
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={1}
          placeholder='What are your thoughts?'
        />

        <div className='mt-2 flex justify-end'>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() =>
              comment({
                postId,
                text: input,
                replyToId
              })
            }
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  )
}

export default memo(CreateComment)
