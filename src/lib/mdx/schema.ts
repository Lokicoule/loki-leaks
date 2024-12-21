import slugify from 'slugify'
import { z } from 'zod'

export const frontmatterSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    date: z.string().transform((str) => new Date(str)),
    draft: z.boolean().default(false),
    slug: z.string().optional(),
  })
  .transform((data) => ({
    ...data,
    slug: data.slug || slugify(data.title, { lower: true, strict: true }),
  }))

export type Frontmatter = z.infer<typeof frontmatterSchema>
