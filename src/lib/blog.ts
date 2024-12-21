import { getPost, getPosts } from './content'

export async function getAllBlogPosts() {
  return getPosts('blog')
}

export async function getBlogPost(slug: string) {
  return getPost(slug, 'blog')
}
