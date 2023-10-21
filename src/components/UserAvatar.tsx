'use client'

import { memo } from 'react'
import { User } from 'next-auth'
import Image from 'next/image'
import { Icons } from '@/components/Icons'
import { Avatar, AvatarFallback } from '@/components/ui/Avatar'

type PropsType = {
	user: Pick<User, 'name' | 'image'>
} & React.ComponentPropsWithoutRef<typeof Avatar>

function UserAvatar(props: PropsType) {
	const { user, ...otherProps } = props
	return (
		<Avatar {...otherProps}>
			{user.image ? (
				<div className='relative aspect-square h-full w-full'>
					<Image
						fill
						src={user.image}
						alt='profile picture'
						referrerPolicy='no-referrer'
					/>
				</div>
			) : (
				<AvatarFallback>
					<span className='sr-only'>{user?.name}</span>
					<Icons.user className='h-4 w-4' />
				</AvatarFallback>
			)}
		</Avatar>
	)
}

export default memo(UserAvatar)
