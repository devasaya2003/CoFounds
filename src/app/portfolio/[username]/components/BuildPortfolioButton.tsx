import Link from 'next/link';

export default function BuildPortfolioButton() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const redirectURL = `${BASE_URL}/auth/sign-up`

  return (
    <Link 
      href={redirectURL} 
      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
    >
      Build your own portfolio
    </Link>
  );
}