import { format } from 'date-fns'
import { PropsWithChildren } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SubscribeLeaveToggle from '@/components/SubscribeLeaveToggle'
import { buttonVariants } from '@/components/ui/Button'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'

type PropsType = {
	params: {
		slug: string
	}
} & PropsWithChildren

export default async function SubredditLayout(props: PropsType) {
	const {
		children,
		params: { slug },
	} = props

	const session = await getAuthSession()

	const subreddit = await db.subreddit.findFirst({
		where: {
			name: slug,
		},
		include: {
			posts: {
				include: {
					author: true,
					votes: true,
				},
			},
		},
	})

	if (!subreddit) return notFound()

	const subscription = !session?.user
		? undefined
		: await db.subscription.findFirst({
				where: {
					subreddit: {
						name: slug,
					},
					user: {
						id: session.user.id,
					},
				},
		  })

	const isSubscribed = !!subscription

	const memberCount = await db.subscription.count({
		where: {
			subreddit: {
				name: slug,
			},
		},
	})

	return (
		<div className='mx-auto h-full max-w-7xl pt-12 sm:container'>
			<div>
				{/* TODO: Button to take us back */}

				<div className='grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4'>
					<div className='col-span-2 flex flex-col space-y-6'>{children}</div>

					{/* info sidebar */}
					<div className='order-first hidden h-fit overflow-hidden rounded-lg border border-gray-200 md:order-last md:block'>
						<div className='px-6 py-4'>
							<p className='py-3 font-semibold'>About r/{slug}</p>
						</div>

						<dl className='divide-y divide-gray-100 bg-white px-6 py-4 text-sm leading-6'>
							<div className='flex justify-between gap-x-4 py-3'>
								<dt className='text-gray-500'>Created</dt>
								<dd className='text-gray-700'>
									<time dateTime={subreddit.createdAt.toDateString()}>
										{format(subreddit.createdAt, 'MMMM d, yyyy')}
									</time>
								</dd>
							</div>

							<div className='flex justify-between gap-x-4 py-3'>
								<dt className='text-gray-500'>Memebers</dt>
								<dd className='text-gray-700'>
									<div className='text-gray-900'>{memberCount}</div>
								</dd>
							</div>

							{subreddit.creatorId === session?.user.id ? (
								<div className='flex justify-between gap-x-4 py-3'>
									<p className='text-gray-500'>You created this community</p>
								</div>
							) : null}

							{subreddit.creatorId !== session?.user.id ? (
								<SubscribeLeaveToggle
									subredditId={subreddit.id}
									subredditName={subreddit.name}
									isSubscribed={isSubscribed}
								/>
							) : null}
							<Link
								className={buttonVariants({
									variant: 'outline',
									className: 'mb-6 w-full',
								})}
								href={`/r/${slug}/submit`}
							>
								Create Post
							</Link>
						</dl>
					</div>
				</div>
			</div>
		</div>
	)
}
