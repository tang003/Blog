"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";

type CommentFormProps = {
  action: (formData: FormData) => void | Promise<void>;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
      disabled={pending}
      type="submit"
    >
      {pending ? "提交中..." : "发表评论"}
    </button>
  );
}

export function CommentForm({ action }: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      action={async (formData) => {
        await action(formData);
        formRef.current?.reset();
      }}
      className="grid gap-4"
      ref={formRef}
    >
      <input
        aria-hidden="true"
        autoComplete="off"
        className="hidden"
        name="website"
        tabIndex={-1}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">昵称</span>
          <input
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            maxLength={40}
            name="author"
            required
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">邮箱，可选</span>
          <input
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            maxLength={120}
            name="email"
            type="email"
          />
        </label>
      </div>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-zinc-700">评论</span>
        <textarea
          className="min-h-28 rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          maxLength={1000}
          name="content"
          required
        />
      </label>
      <SubmitButton />
    </form>
  );
}
