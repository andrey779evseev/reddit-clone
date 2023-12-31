import Link from 'next/link'
import { Icons } from '@/components/Icons'
import SearchBar from '@/components/SearchBar'
import { buttonVariants } from '@/components/ui/Button'
import UserAccountNav from '@/components/UserAccountNav'
import { getAuthSession } from '@/lib/auth'

export default async function Navbar() {
	const session = await getAuthSession()
	return (
		<div className='fixed inset-x-0 top-0 z-[10] h-fit border-b border-zinc-300 bg-zinc-100 py-2'>
			<div className='container mx-auto flex h-fit max-w-7xl items-center justify-between gap-2'>
				{/* Logo */}
				<Link href='/' className='flex items-center gap-2'>
					<Icons.logo className='h-8 w-8 sm:h-6 sm:w-6' />
					<p className='hidden text-sm font-medium text-zinc-700 md:block'>
						Breadit
					</p>
				</Link>

				{/* Search bar */}
				<SearchBar />

				{session?.user ? (
					<UserAccountNav user={session.user} />
				) : (
					<Link
						href='/sign-in'
						className={buttonVariants({ className: 'min-w-fit' })}
					>
						Sign in
					</Link>
				)}
			</div>
		</div>
	)
}
