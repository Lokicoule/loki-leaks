import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { frontmatterSchema } from './schema'

const MDX_PATH = path.join(process.cwd(), 'content')

export class MdxRepository {
  private readonly basePath: string

  constructor(basePath: string = MDX_PATH) {
    this.basePath = basePath
  }

  getBySlug(slug: string) {
    const realSlug = slug.replace(/\.mdx$/, '')
    const filePath = path.join(this.basePath, `${realSlug}.mdx`)
    const fileContent = fs.readFileSync(filePath, 'utf8')

    const { data: frontmatter, content } = matter(fileContent)
    const validatedFrontmatter = frontmatterSchema.parse({
      ...frontmatter,
      slug: realSlug,
    })

    return {
      frontmatter: validatedFrontmatter,
      content,
    }
  }

  getAll() {
    const files = fs.readdirSync(this.basePath).filter((file) => path.extname(file) === '.mdx')

    const posts = files
      .map((file) => this.getBySlug(file))
      .filter((post) => !post.frontmatter.draft)
      .sort((a, b) => {
        return b.frontmatter.date.getTime() - a.frontmatter.date.getTime()
      })

    return posts
  }
}

export const mdxRepository = new MdxRepository()
