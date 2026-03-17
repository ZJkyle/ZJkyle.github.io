import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    category: z.enum(['tech', 'discovery', 'reflection']).default('tech'),
    externalUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
  }),
});

export const collections = { blog };
