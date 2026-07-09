"use client";

import { useFormStatus } from "react-dom";

type DeletePostFormProps = {
  action: () => void | Promise<void>;
  confirmMessage?: string;
  label?: string;
};

function DeleteButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "删除中..." : label}
    </button>
  );
}

export function DeletePostForm({
  action,
  confirmMessage = "确定要删除这篇文章吗？这个操作不能撤销。",
  label = "删除",
}: DeletePostFormProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <DeleteButton label={label} />
    </form>
  );
}
