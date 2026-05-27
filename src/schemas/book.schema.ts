import { z } from 'zod';

export const createBookSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title is required')
    .max(500, 'Title is too long'),
  author: z
    .string({ required_error: 'Author is required' })
    .trim()
    .min(1, 'Author is required')
    .max(300, 'Author is too long'),
  isbn: z
    .string({ required_error: 'ISBN is required' })
    .trim()
    .min(1, 'ISBN is required')
    .max(20, 'ISBN is too long'),
  pages: z
    .number({ required_error: 'Pages is required', invalid_type_error: 'Pages must be a number' })
    .int('Pages must be a whole number')
    .min(1, 'Pages must be at least 1')
    .max(50000, 'Pages value is too large'),
  rating: z
    .number({ required_error: 'Rating is required', invalid_type_error: 'Rating must be a number' })
    .int('Rating must be a whole number')
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5'),
});

export type CreateBookFormValues = z.infer<typeof createBookSchema>;
