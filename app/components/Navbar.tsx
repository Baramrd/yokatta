import Link from 'next/link';
import Image from 'next/image';
import SearchBar from './SearchBar';

export default function Navbar() {
  return (
    <nav className="bg-dark border-b border-secondary p-4 mb-8">
      <div className="container mx-auto flex justify-between items-center gap-4 flex-wrap">
        <Link href="/" className="flex items-center space-x-4">
          <Image src="/logo.png" alt="Yokatta Logo" width={50} height={50} />
          <span className="text-2xl font-bold text-primary">Yokatta</span>
        </Link>
        <div className="flex items-center gap-4">
          <SearchBar />
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-primary hover:text-highlight">
            Home
          </Link>
          <Link href="/bookmarks" className="text-primary hover:text-highlight">
            Bookmarks
          </Link>
        </div>
      </div>
    </nav>
  );
}