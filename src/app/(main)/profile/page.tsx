// Static export version — no server-side auth available
import Link from "next/link";
import { User, ArrowLeft } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <User className="h-10 w-10 text-gray-400" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        请先登录
      </h1>
      <p className="mb-6 max-w-md text-gray-500 dark:text-gray-400">
        个人主页需要登录后才能查看。请使用电脑访问完整版网站进行登录。
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        返回首页
      </Link>
    </div>
  );
}
