import type { Frontmatter } from '@/lib/mdx/schema'
import { MDXProvider } from '@mdx-js/react'
import { format } from 'date-fns'
import { mdxComponents } from './mdx-components'

interface MdxLayoutProps {
  frontmatter: Frontmatter
  children: React.ReactNode
}

export function MdxLayout({ frontmatter, children }: MdxLayoutProps) {
  return (
    <article className="prose prose-lg max-w-none">
      <div className="mb-8">
        <h1 className="mb-2">{frontmatter.title}</h1>
        <time className="text-gray-600">{format(frontmatter.date, 'MMMM d, yyyy')}</time>
      </div>
      <MDXProvider components={mdxComponents}>{children}</MDXProvider>
    </article>
  )
}
