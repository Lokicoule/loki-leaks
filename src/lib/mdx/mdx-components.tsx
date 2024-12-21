import type { MDXComponents } from 'mdx/types'

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => <h1 className="text-3xl font-bold tracking-tight mb-4">{children}</h1>,
  h2: ({ children }) => <h2 className="text-2xl font-semibold tracking-tight mb-3">{children}</h2>,
}
