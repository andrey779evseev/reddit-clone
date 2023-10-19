'use client'

import { Icons } from '@/components/Icons'
import { Avatar, AvatarFallback } from '@/components/ui/Avatar'
import { User } from 'next-auth'
import Image from 'next/image'
import { memo } from 'react'

type PropsType = {
  user: Pick<User, 'name' | 'image'>
} & React.ComponentPropsWithoutRef<typeof Avatar>

function UserAvatar (props: PropsType) {
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
          <Icons.user className='w-4 h-4'/>
        </AvatarFallback>
      )}
    </Avatar>
  )
}

export default memo(UserAvatar)
