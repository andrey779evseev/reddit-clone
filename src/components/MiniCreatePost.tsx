'use client'

import { ImageIcon, Link2 } from 'lucide-react'
import { memo } from 'react'
import { Session } from 'next-auth'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import UserAvatar from '@/components/UserAvatar'

type PropsType = {
	session: Session | null
}

function MiniCreatePost(props: PropsType) {
	const { session } = props
	const router = useRouter()
	const pathname = usePathname()
	return (
		<li className='list-none overflow-hidden rounded-md bg-white shadow'>
			<div className='flex h-full justify-between gap-6 px-6 py-4'>
				<div className='relative h-10 w-10'>
					<UserAvatar
						user={{
							name: session?.user.name || null,
							image: session?.user.image || null,
						}}
					/>

					<span className='absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 outline outline-2 outline-white' />
				</div>

				<Input
					readOnly
					onClick={() => router.push(pathname + '/submit')}
					placeholder='Create post'
				/>

				<Button
					variant='ghost'
					onClick={() => router.push(pathname + '/submit')}
					className='hidden sm:block'
				>
					<ImageIcon className='text-zinc-600' />
				</Button>
				<Button
					variant='ghost'
					onClick={() => router.push(pathname + '/submit')}
					className='hidden sm:block'
				>
					<Link2 className='text-zinc-600' />
				</Button>
			</div>
		</li>
	)
}

export default memo(MiniCreatePost)
