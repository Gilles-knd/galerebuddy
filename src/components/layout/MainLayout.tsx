import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white border-b shadow-sm">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold text-blue-600">
                        GalèreBuddy
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-4">
              <span className="hidden md:inline-block text-sm text-gray-700">
                Salut, {user.firstname}!
              </span>
                            <button
                                onClick={logout}
                                className="text-sm text-gray-700 hover:text-gray-900"
                            >
                                Déconnexion
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <Link
                                href="/login"
                                className="text-sm font-medium hover:text-blue-600"
                            >
                                Connexion
                            </Link>
                            <Link
                                href="/register"
                                className="text-sm px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Inscription
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Mobile navigation */}
            {user && (
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
                    <div className="flex justify-around items-center h-16">
                        <Link
                            href="/feed"
                            className={`flex flex-col items-center p-2 ${pathname === '/feed' ? 'text-blue-600' : 'text-gray-500'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="text-xs">Feed</span>
                        </Link>

                        <Link
                            href="/explore"
                            className={`flex flex-col items-center p-2 ${pathname === '/explore' ? 'text-blue-600' : 'text-gray-500'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="text-xs">Explore</span>
                        </Link>

                        <Link
                            href="/post/new"
                            className={`flex flex-col items-center p-2 ${pathname === '/post/new' ? 'text-blue-600' : 'text-gray-500'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-xs">Publier</span>
                        </Link>

                        <Link
                            href="/collabs"
                            className={`flex flex-col items-center p-2 ${pathname === '/collabs' ? 'text-blue-600' : 'text-gray-500'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-xs">Collabs</span>
                        </Link>

                        <Link
                            href="/profile"
                            className={`flex flex-col items-center p-2 ${pathname === '/profile' ? 'text-blue-600' : 'text-gray-500'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-xs">Profil</span>
                        </Link>
                    </div>
                </nav>
            )}

            {/* Desktop sidebar for authenticated users */}
            {user && (
                <aside className="hidden md:block fixed top-16 left-0 bottom-0 w-64 bg-white border-r p-4">
                    <nav className="space-y-2">
                        <Link
                            href="/feed"
                            className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 ${pathname === '/feed' ? 'bg-blue-50 text-blue-600' : ''}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>Feed</span>
                        </Link>

                        <Link
                            href="/explore"
                            className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 ${pathname === '/explore' ? 'bg-blue-50 text-blue-600' : ''}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span>Explore</span>
                        </Link>

                        <Link
                            href="/collabs"
                            className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 ${pathname === '/collabs' ? 'bg-blue-50 text-blue-600' : ''}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>Collabs</span>
                        </Link>

                        <Link
                            href="/profile"
                            className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 ${pathname === '/profile' ? 'bg-blue-50 text-blue-600' : ''}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Profil</span>
                        </Link>

                        <div className="pt-6">
                            <Link
                                href="/post/new"
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Nouvelle galère</span>
                            </Link>
                        </div>
                    </nav>
                </aside>
            )}

            {/* Adjust padding for authenticated users on desktop */}
            {user && (
                <div className="md:pl-64 pt-4 pb-20 md:pb-4">
                    <div className="container mx-auto px-4">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}