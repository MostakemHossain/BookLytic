import { z } from "zod";

const createBookValidationSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Book title is required" }),
    caption: z.string({ required_error: "Caption is required" }),
    image: z.string({ required_error: "Image is required" }),
    rating: z
      .number({ required_error: "Rating is required" })
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must be at most 5"),
  }),
});

export const BookValidations = {
  createBookValidationSchema,
};
