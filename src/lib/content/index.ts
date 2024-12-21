import fs from 'fs/promises'
import matter from 'gray-matter'
import path from 'path'
import { cache } from 'react'
import { z } from 'zod'
import { ContentError } from './error'
import { frontmatterSchema } from './schema'

const basePath = path.join(process.cwd(), 'content')

const readFile = cache(async (filePath: string) => {
  try {
    return await fs.readFile(filePath, 'utf8')
  } catch (error) {
    throw new ContentError(`Failed to read file: ${filePath}`, 'FILE_READ_ERROR')
  }
})

const validateDirectory = async (dirPath: string) => {
  try {
    const stats = await fs.stat(dirPath)
    if (!stats.isDirectory()) {
      throw new ContentError(`Path is not a directory: ${dirPath}`, 'INVALID_DIRECTORY')
    }
  } catch (error) {
    if (error instanceof ContentError) throw error
    throw new ContentError(`Directory does not exist: ${dirPath}`, 'DIRECTORY_NOT_FOUND')
  }
}

export const getPost = async (
  slug: string,
  section?: string,
): Promise<{
  frontmatter: z.infer<typeof frontmatterSchema>
  content: string
}> => {
  try {
    const realSlug = slug.replace(/\.mdx$/, '')
    const sectionPath = section ? path.join(basePath, section) : basePath
    const filePath = path.join(sectionPath, `${realSlug}.mdx`)

    const fileContent = await readFile(filePath)
    const { data: frontmatter, content } = matter(fileContent)

    return {
      frontmatter: frontmatterSchema.parse({
        ...frontmatter,
        slug: realSlug,
        section, // Add section to frontmatter if needed
      }),
      content,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ContentError(`Invalid frontmatter in ${slug}: ${error.message}`, 'VALIDATION_ERROR')
    }
    throw error
  }
}

export const getPosts = async (section: string) => {
  try {
    const fullPath = path.join(basePath, section)
    await validateDirectory(fullPath)

    const files = await fs.readdir(fullPath)
    const mdxFiles = files.filter((file) => path.extname(file) === '.mdx')

    const posts = await Promise.all(
      mdxFiles.map((file) => getPost(path.basename(file, '.mdx'), section)),
    )

    return posts
      .filter((post) => !post.frontmatter.draft)
      .sort((a, b) => b.frontmatter.date.getTime() - a.frontmatter.date.getTime())
  } catch (error) {
    if (error instanceof ContentError) throw error
    throw new ContentError(`Failed to get files from section: ${section}`, 'PATH_READ_ERROR')
  }
}

export const getRelated = async (
  currentSlug: string,
  section: string,
  tags: string[],
  limit = 3,
) => {
  try {
    const allPosts = await getPosts(section)

    return allPosts
      .filter((post) => post.frontmatter.slug !== currentSlug)
      .filter((post) => post.frontmatter.tags.some((tag) => tags.includes(tag)))
      .slice(0, limit)
  } catch (error) {
    throw new ContentError(
      `Failed to get related content for: ${currentSlug}`,
      'RELATED_CONTENT_ERROR',
    )
  }
}
