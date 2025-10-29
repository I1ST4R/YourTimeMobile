import { z } from 'zod';

export const validateData = <T>(
  data: unknown,
  schema: z.ZodType<T>
): T | null => {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error('Validation error:', error);
    return null;
  }
};

export const validateArray = <T>(
  data: unknown,
  schema: z.ZodType<T>
): T[] => {
  try {
    const arraySchema = z.array(schema);
    return arraySchema.parse(data);
  } catch (error) {
    console.error('Array validation error:', error);
    return [];
  }
};