"use client";

import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { store } from "@/redux/store";
import { usePathname } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

  const isSubdomain = hostname.includes('.') &&
    !hostname.startsWith('www.') &&
    hostname !== 'localhost' &&
    hostname !== process.env.NEXT_PUBLIC_DOMAIN;

  const isPublicPath =
    isSubdomain ||
    pathname.startsWith('/portfolio/') ||
    pathname.startsWith('/api/portfolio/');

  return (
    <Provider store={store}>
      {isPublicPath ? (
        children
      ) : (
        <SessionProvider>{children}</SessionProvider>
      )}
    </Provider>
  );
}