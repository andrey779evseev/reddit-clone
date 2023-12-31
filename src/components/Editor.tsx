'use client'

import type EditorJS from '@editorjs/editorjs'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'
import { usePathname, useRouter } from 'next/navigation'
import { uploadFiles } from '@/lib/uploadthing'
import { PostCreationRequest, PostValidator } from '@/lib/validators/post'
import { toast } from '@/hooks/use-toast'

type PropsType = {
	subredditId: string
}

function Editor(props: PropsType) {
	const { subredditId } = props
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<PostCreationRequest>({
		resolver: zodResolver(PostValidator),
		defaultValues: {
			subredditId,
			title: '',
			content: null,
		},
	})
	const ref = useRef<EditorJS>()
	const _titleRef = useRef<HTMLTextAreaElement>(null)
	const [isMounted, setIsMounted] = useState(false)
	const pathname = usePathname()
	const router = useRouter()

	const initializeEditor = useCallback(async () => {
		const EditorJS = (await import('@editorjs/editorjs')).default
		const Header = (await import('@editorjs/header')).default
		const Embed = (await import('@editorjs/embed')).default
		const Table = (await import('@editorjs/table')).default
		const List = (await import('@editorjs/list')).default
		const Code = (await import('@editorjs/code')).default
		const LinkTool = (await import('@editorjs/link')).default
		const InlineCode = (await import('@editorjs/inline-code')).default
		const ImageTool = (await import('@editorjs/image')).default

		if (!ref.current) {
			const editor = new EditorJS({
				holder: 'editor',
				onReady() {
					ref.current = editor
				},
				placeholder: 'Type here to write your post...',
				inlineToolbar: true,
				data: { blocks: [] },
				tools: {
					header: Header,
					linkTool: {
						class: LinkTool,
						config: {
							endpoint: '/api/link',
						},
					},
					image: {
						class: ImageTool,
						config: {
							uploader: {
								async uploadByFile(file: File) {
									const [res] = await uploadFiles({
										files: [file],
										endpoint: 'imageUploader',
									})

									return {
										success: 1,
										file: {
											url: res.url,
										},
									}
								},
							},
						},
					},
					list: List,
					code: Code,
					inlineCode: InlineCode,
					table: Table,
					embed: Embed,
				},
			})
		}
	}, [])

	useEffect(() => {
		const init = async () => {
			await initializeEditor()

			setTimeout(() => {
				_titleRef.current?.focus()
			}, 0)
		}
		if (isMounted) {
			init()

			return () => {
				ref.current?.destroy()
				ref.current = undefined
			}
		}
	}, [isMounted, initializeEditor])

	useEffect(() => {
		if (typeof window !== 'undefined') setIsMounted(true)
	}, [])

	useEffect(() => {
		if (Object.keys(errors).length) {
			for (const [, value] of Object.entries(errors)) {
				toast({
					title: 'Something went wrong',
					description: (value as { message: string }).message,
					variant: 'destructive',
				})
			}
		}
	}, [errors])

	const { mutate: createPost } = useMutation({
		mutationFn: async (payload: PostCreationRequest) => {
			const { data } = await axios.post('/api/subreddit/post/create', payload)
			return data
		},
		onError: () => {
			return toast({
				title: 'Something went wrong',
				description: 'Your post was not been published, please try again later',
				variant: 'destructive',
			})
		},
		onSuccess: () => {
			const newPathname = pathname.split('/').slice(0, -1).join('/')
			router.push(newPathname)

			router.refresh()

			return toast({
				description: 'Your post has been published.',
			})
		},
	})

	const onSubmit = async (data: PostCreationRequest) => {
		const blocks = await ref.current?.save()

		const payload: PostCreationRequest = {
			title: data.title,
			content: blocks,
			subredditId,
		}

		createPost(payload)
	}

	// if (!isMounted)
	//   return null

	const { ref: titleRef, ...registerTitle } = register('title')

	return (
		<div className='w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4'>
			<form
				id='subreddit-post-form'
				className='w-fit'
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className='prose prose-stone dark:prose-invert'>
					<TextareaAutosize
						placeholder='Title'
						className='w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none'
						ref={(e) => {
							titleRef(e)
							// @ts-ignore
							_titleRef.current = e
						}}
						{...registerTitle}
					/>

					<div id='editor' className='min-h-[500px]' />
				</div>
			</form>
		</div>
	)
}

export default memo(Editor)
