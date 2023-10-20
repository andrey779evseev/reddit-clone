type PropsType = {
  params: {
    postId: string
  }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function PostPage(props: PropsType) {
  const {
    params: { postId }
  } = props

  
  
  return <></>
}
