'use client'

import { useDebouncedValue } from '@mantine/hooks'
import { Prisma, Subreddit } from '@prisma/client'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Users } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/Command'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'

type QueryType = (Subreddit & { _count: Prisma.SubredditCountOutputType })[]

export default function SearchBar() {
	const [input, setInput] = useState('')
	const [debouncedInput] = useDebouncedValue(input, 500)
	const router = useRouter()
	const commandRef = useRef<HTMLDivElement>(null)
	const pathname = usePathname()

	useOnClickOutside(commandRef, () => {
		setInput('')
	})

	const {
		data: queryResults,
		refetch,
		isFetched,
		isFetching,
	} = useQuery({
		queryKey: ['search-query', debouncedInput],
		queryFn: async () => {
			if (!input) return [] as QueryType
			const { data } = await axios.get<QueryType>(
				`/api/search?q=${debouncedInput}`,
			)
			return data
		},
		enabled: false,
	})

	useEffect(() => {
		refetch()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedInput])

	useEffect(() => {
		setInput('')
	}, [pathname])

	return (
		<Command
			className='relative z-50 max-w-lg overflow-visible rounded-lg border'
			ref={commandRef}
		>
			<CommandInput
				isLoading={isFetching}
				className='border-none outline-none ring-0 focus:border-none focus:outline-none'
				placeholder='Search communities...'
				value={input}
				onValueChange={(text) => setInput(text)}
			/>
			{input.length > 0 ? (
				<CommandList className='absolute inset-x-0 top-full rounded-md bg-white shadow'>
					{isFetched && <CommandEmpty>No results found.</CommandEmpty>}
					{(queryResults?.length ?? 0) > 0 ? (
						<CommandGroup heading='Communities'>
							{queryResults?.map((subreddit) => (
								<CommandItem
									onSelect={(e) => {
										router.push(`/r/${e}`)
										router.refresh()
									}}
									key={subreddit.id}
									value={subreddit.name}
								>
									<Users className='mr-2 h-4 w-4' />
									<a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
								</CommandItem>
							))}
						</CommandGroup>
					) : null}
				</CommandList>
			) : null}
		</Command>
	)
}
