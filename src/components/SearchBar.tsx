'use client'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/Command'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'
import { useDebouncedValue } from '@mantine/hooks'
import { Prisma, Subreddit } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

type QueryType = (Subreddit & { _count: Prisma.SubredditCountOutputType })[]

export default function SearchBar() {
  const [input, setInput] = useState('')
  const [debouncedInput] = useDebouncedValue(input, 500)
  const router = useRouter()
  const commandRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(commandRef, () => {
    setInput('')
  })

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching
  } = useQuery({
    queryKey: ['search-query', debouncedInput],
    queryFn: async () => {
      if (!input) return [] as QueryType
      const { data } = await axios.get<QueryType>(
        `/api/search?q=${debouncedInput}`
      )
      return data
    },
    enabled: false
  })

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput])

  return (
    <Command className='relative rounded-lg border max-w-lg z-50 overflow-visible'>
      <CommandInput
        isLoading={isFetching}
        className='outline-none border-none focus:border-none focus:outline-none ring-0'
        placeholder='Search communities...'
        value={input}
        onValueChange={text => setInput(text)}
      />
      {input.length > 0 ? (
        <CommandList className='absolute bg-white top-full inset-x-0 shadow rounded-md'>
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading='Communities'>
              {queryResults?.map(subreddit => (
                <CommandItem
                  onSelect={e => {
                    router.push(`/r/${e}`)
                    router.refresh()
                  }}
                  key={subreddit.id}
                  value={subreddit.name}
                >
                  <Users className='mr-2 w-4 h-4' />
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
