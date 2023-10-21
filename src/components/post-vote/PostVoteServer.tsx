import { Post, Vote, VoteType } from '@prisma/client'
import { notFound } from 'next/navigation'
import PostVoteClient from '@/components/post-vote/PostVoteClient'
import { getAuthSession } from '@/lib/auth'

type PropsType = {
	postId: string
} & (
	| {
			initialVotesAmt: number
			initialVote: VoteType | null
			getData?: never
	  }
	| {
			initialVotesAmt?: never
			initialVote?: never
			getData: () => Promise<(Post & { votes: Vote[] }) | null>
	  }
)

export default async function PostVoteServer(props: PropsType) {
	const { postId, getData, initialVote, initialVotesAmt } = props

	const session = await getAuthSession()

	let _votesAmt = 0
	let _currentVote: VoteType | null | undefined = undefined

	if (getData) {
		const post = await getData()
		if (!post) return notFound()

		_votesAmt = post.votes.reduce((acc, vote) => {
			if (vote.type === 'UP') return acc + 1
			if (vote.type === 'DOWN') return acc - 1
			return acc
		}, 0)

		_currentVote = post.votes.find((v) => v.userId === session?.user.id)?.type
	} else {
		_votesAmt = initialVotesAmt
		_currentVote = initialVote
	}

	return (
		<PostVoteClient
			postId={postId}
			initialVotesAmt={_votesAmt}
			initialVote={_currentVote}
		/>
	)
}
