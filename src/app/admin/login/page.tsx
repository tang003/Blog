import type { Metadata } from "next";
import { loginAction } from "../actions";

export const metadata: Metadata = {
  title: "管理员登录",
};

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    locked?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, locked } = await searchParams;

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center py-16">
      <h1 className="text-3xl font-semibold tracking-tight">管理员登录</h1>
      <p className="mt-3 leading-7 text-zinc-600">
        输入环境变量中配置的管理员账号和密码后，可以进入后台管理文章。
      </p>

      {locked ? (
        <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          登录尝试过于频繁，请稍后再试。
        </p>
      ) : null}

      {error ? (
        <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          账号或密码不正确，请重试。
        </p>
      ) : null}

      <form action={loginAction} className="mt-8 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">账号</span>
          <input
            autoComplete="username"
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            name="username"
            type="text"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">密码</span>
          <input
            autoComplete="current-password"
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            name="password"
            required
            type="password"
          />
        </label>

        <button
          className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
          type="submit"
        >
          登录
        </button>
      </form>
    </div>
  );
}
