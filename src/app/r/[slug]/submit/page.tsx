import { notFound } from 'next/navigation'
import Editor from '@/components/Editor'
import { Button } from '@/components/ui/Button'
import { db } from '@/lib/db'

type PropsType = {
	params: {
		slug: string
	}
}

export default async function SubmitPage(props: PropsType) {
	const {
		params: { slug },
	} = props
	const subreddit = await db.subreddit.findFirst({
		where: {
			name: slug,
		},
	})

	if (!subreddit) notFound()

	return (
		<div className='flex flex-col items-center gap-6'>
			<div className='border-b border-gray-200 pb-5'>
				<div className='-ml-2 -mt-2 flex flex-wrap items-baseline'>
					<h3 className='ml-2 mt-2 text-base font-semibold leading-6 text-gray-900'>
						Create Post
					</h3>
					<p className='ml-2 mt-1 truncate text-sm text-gray-500'>
						in r/{slug}
					</p>
				</div>
			</div>

			{/* form */}

			<Editor subredditId={subreddit.id} />

			<div className='flex w-full justify-end'>
				<Button type='submit' className='w-full' form='subreddit-post-form'>
					Post
				</Button>
			</div>
		</div>
	)
}
