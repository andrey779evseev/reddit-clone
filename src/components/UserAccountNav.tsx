'use client'

import { signOut } from 'next-auth/react'
import { memo } from 'react'
import { User } from 'next-auth'
import Link from 'next/link'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import UserAvatar from '@/components/UserAvatar'

type PropsType = {
	user: Pick<User, 'name' | 'image' | 'email'>
}

function UserAccountNav(props: PropsType) {
	const { user } = props

	const logout = (e: Event) => {
		e.preventDefault()
		signOut({
			callbackUrl: `${window.location.origin}/sign-in`,
		})
	}

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger className='outline-none'>
				<UserAvatar
					user={{ name: user.name || null, image: user.image }}
					className='h-8 w-8'
				/>
			</DropdownMenuTrigger>

			<DropdownMenuContent className='bg-white' align='end'>
				<div className='flex items-center justify-start gap-2 p-2'>
					<div className='flex flex-col space-y-1 leading-none'>
						{user.name && <p className='font-medium'>{user.name}</p>}
						{user.email && (
							<p className='w-[200px] truncate text-sm text-zinc-700'>
								{user.email}
							</p>
						)}
					</div>
				</div>

				<DropdownMenuSeparator />

				<DropdownMenuItem asChild>
					<Link href='/'>Feed</Link>
				</DropdownMenuItem>

				<DropdownMenuItem asChild>
					<Link href='/r/create'>Create community</Link>
				</DropdownMenuItem>

				<DropdownMenuItem asChild>
					<Link href='/settings'>Settings</Link>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem className='cursor-pointer' onSelect={logout}>
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default memo(UserAccountNav)
