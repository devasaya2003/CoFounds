import Link from 'next/link';

export default function BuildPortfolioButton() {

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const redirectURL = `${BASE_URL}/auth/sign-up`

  return (
    <section className="flex justify-center mb-16">
      <Link 
        href={redirectURL} 
        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg transition-all duration-300 hover:shadow-xl"
      >
        Build Your Own Cofounds Portfolio
      </Link>
    </section>
  );
}