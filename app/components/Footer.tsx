import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200/80 bg-white py-12 text-xs text-gray-500">
      <div className="max-w-5xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#111111] text-white flex items-center justify-center font-bold text-[10px]">
            T
          </div>
          <span className="font-semibold text-gray-900 tracking-tight text-sm">TechPulse</span>
          <span className="text-gray-400 font-normal ml-2">© {new Date().getFullYear()} TechPulse Inc. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 text-gray-500 font-medium">
          <Link href="/" className="hover:text-gray-900 transition">
            Articles
          </Link>
          <Link href="/blogs/my" className="hover:text-gray-900 transition">
            My Posts
          </Link>
          <a
            href="https://github.com/Chilhan23/golang-blog-api"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 transition"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
