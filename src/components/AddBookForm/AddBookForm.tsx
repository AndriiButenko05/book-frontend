import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBookSchema,
  type CreateBookFormValues,
} from "../../schemas/book.schema";
import { createBook } from "../../api/books";
import { ApiError } from "../../types/book";
import { StarRating } from "../StarRating/StarRating";
import styles from "./AddBookForm.module.css";

export function AddBookForm() {
  const queryClient = useQueryClient();
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateBookFormValues>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: "",
      author: "",
      isbn: "",
      pages: undefined as unknown as number,
      rating: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: createBook,
    onSuccess: (book) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      reset();
      setApiError(null);
      setSuccessMsg(`"${book.title}" added successfully.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    },
    onError: (err) => {
      setSuccessMsg(null);
      setApiError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.",
      );
    },
  });

  const onSubmit = (values: CreateBookFormValues) => {
    setApiError(null);
    mutation.mutate(values);
  };

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Add a Book</span>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={styles.form}
      >
        {apiError && (
          <div role="alert" className={`${styles.alert} ${styles.alertError}`}>
            {apiError}
          </div>
        )}
        {successMsg && (
          <div
            role="status"
            className={`${styles.alert} ${styles.alertSuccess}`}
          >
            {successMsg}
          </div>
        )}

        <div className={styles.field}>
          <label htmlFor="title" className={styles.label}>
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="e.g. The Great Gatsby"
            className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
            {...register("title")}
          />
          {errors.title && (
            <p className={styles.errorMsg}>{errors.title.message}</p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="author" className={styles.label}>
            Author
          </label>
          <input
            id="author"
            type="text"
            placeholder="e.g. F. Scott Fitzgerald"
            className={`${styles.input} ${errors.author ? styles.inputError : ""}`}
            {...register("author")}
          />
          {errors.author && (
            <p className={styles.errorMsg}>{errors.author.message}</p>
          )}
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="isbn" className={styles.label}>
              ISBN
            </label>
            <input
              id="isbn"
              type="text"
              placeholder="97857..."
              className={`${styles.input} ${errors.isbn ? styles.inputError : ""}`}
              {...register("isbn")}
            />
            {errors.isbn && (
              <p className={styles.errorMsg}>{errors.isbn.message}</p>
            )}
          </div>
          <div className={styles.field}>
            <label htmlFor="pages" className={styles.label}>
              Pages
            </label>
            <input
              id="pages"
              type="number"
              min={1}
              placeholder="e.g. 320"
              className={`${styles.input} ${errors.pages ? styles.inputError : ""}`}
              {...register("pages", { valueAsNumber: true })}
            />
            {errors.pages && (
              <p className={styles.errorMsg}>{errors.pages.message}</p>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Rating</label>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <StarRating
                value={field.value}
                onChange={field.onChange}
                error={errors.rating?.message}
              />
            )}
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className={styles.submitBtn}
        >
          {mutation.isPending ? "Saving…" : "Add Book"}
        </button>
      </form>
    </section>
  );
}
