import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function Welcome() {
    const { auth, url } = usePage<SharedData>().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [footerVisible, setFooterVisible] = useState(false);
    const footerRef = useRef<HTMLElement | null>(null);

    const currentPath = url || '';

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.target.getAttribute('data-footer')) {
                        if (entry.isIntersecting) {
                            setFooterVisible(true);
                        }
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        // Observe footer
        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => {
            if (footerRef.current) {
                observer.unobserve(footerRef.current);
            }
        };
    }, []);

    return (
        <>
            <Head title="MV Oxygen Trading">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex flex-col items-center bg-[#FDFDFC] pt-20 px-6 text-[#1b1b18] lg:px-8 dark:bg-[#0a0a0a]">
                <header className="fixed top-0 left-0 right-0 z-50 w-full px-6 pt-4 pb-3 text-sm bg-white/95 backdrop-blur-sm border-b border-gray-200 dark:bg-[#0a0a0a]/95 dark:border-gray-800 transition-all duration-300 ease-in-out">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src="images/mv-oxygen-logo.png"
                                alt="MV Oxygen Trading Logo"
                                className="w-10 h-10"
                            />
                            <span className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">MV Oxygen Trading</span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-3 flex-1 justify-center">
                            <a
                                href="/"
                                className={`inline-block px-5 py-1.5 text-sm leading-normal transition-colors ${
                                    currentPath === '/'
                                        ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                                        : 'text-[#1b1b18] hover:text-blue-600 dark:text-[#EDEDEC] dark:hover:text-blue-400'
                                }`}
                            >
                                Home
                            </a>
                            <Link
                                href="/faq"
                                className={`inline-block px-5 py-1.5 text-sm leading-normal transition-colors ${
                                    currentPath === '/faq'
                                        ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                                        : 'text-[#1b1b18] hover:text-blue-600 dark:text-[#EDEDEC] dark:hover:text-blue-400'
                                }`}
                            >
                                FAQ
                            </Link>
                            <Link
                                href="/contact"
                                className={`inline-block px-5 py-1.5 text-sm leading-normal transition-colors ${
                                    currentPath === '/contact'
                                        ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                                        : 'text-[#1b1b18] hover:text-blue-600 dark:text-[#EDEDEC] dark:hover:text-blue-400'
                                }`}
                            >
                                Contact
                            </Link>
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className={`inline-block px-5 py-1.5 text-sm leading-normal transition-colors ${
                                        currentPath === '/dashboard'
                                            ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                                            : 'text-[#1b1b18] border border-[#19140035] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]'
                                    }`}
                                >
                                    Dashboard
                                </Link>
                            ) : null}
                        </div>

                        {/* Auth Buttons */}
                        {auth.user ? null : (
                            <div className="hidden lg:flex items-center gap-3">
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm bg-blue-600 px-5 py-2 text-sm leading-normal text-white hover:bg-blue-700 transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-blue-600 bg-white px-5 py-2 text-sm leading-normal text-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 rounded-md text-[#1b1b18] dark:text-[#EDEDEC] hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-95"
                        >
                            <svg className="w-6 h-6 transition-all duration-300 ease-in-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" className="text-[#1b1b18] dark:text-[#EDEDEC]" />
                                ) : (
                                    <>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16" className={isMenuOpen ? "rotate-45 translate-y-2.5" : ""} />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16" className={isMenuOpen ? "opacity-0" : ""} />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 18h16" className={isMenuOpen ? "-rotate-45 -translate-y-2.5" : ""} />
                                    </>
                                )}
                            </svg>
                        </button>
                    </nav>

                    {/* Mobile Menu */}
                    <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col space-y-3 animate-fadeIn">
                                <a
                                    href="/"
                                    className="inline-block px-5 py-2 text-sm leading-normal text-[#1b1b18] hover:text-blue-600 dark:text-[#EDEDEC] dark:hover:text-blue-400 transition-colors"
                                >
                                    Home
                                </a>
                                <Link
                                    href="/faq"
                                    className="inline-block px-5 py-2 text-sm leading-normal text-[#1b1b18] hover:text-blue-600 dark:text-[#EDEDEC] dark:hover:text-blue-400 transition-colors"
                                >
                                    FAQ
                                </Link>
                                <Link
                                    href="/contact"
                                    className="inline-block px-5 py-2 text-sm leading-normal text-[#1b1b18] hover:text-blue-600 dark:text-[#EDEDEC] dark:hover:text-blue-400 transition-colors"
                                >
                                    Contact
                                </Link>
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-2 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="inline-block rounded-sm bg-blue-600 px-5 py-2 text-sm leading-normal text-white hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="inline-block rounded-sm border border-blue-600 bg-white px-5 py-2 text-sm leading-normal text-blue-600 hover:bg-blue-50 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>
                <section id="home" className="w-full flex justify-center">
                    <div className="py-2 lg:py-3 w-full max-w-7xl">
                        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                            {/* Left Content */}
                            <section className="flex-1 order-2 lg:order-1 animate-fadeInUp">
                                <header>
                                    <h1 className="font-bold mb-3 text-[#1b1b18] dark:text-[#EDEDEC]" style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}>
                                        <span>Oxygen Tank Rental &</span><br />
                                        <span className="text-blue-600 italic" style={{ color: '#2563EB' }}>Refill management system</span>
                                    </h1>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A] mb-4" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
                                        Manage rentals, track refills, monitor inventory in real-time
                                    </p>
                                </header>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded px-4 py-3 text-white font-medium transition-all duration-300 hover:scale-105 animate-fadeInUp"
                                    style={{ backgroundColor: '#2563EB', borderColor: '#2563EB', animationDelay: '0.2s' }}
                                >
                                    Get Started
                                </Link>

                                {/* Feature Cards */}
                                <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 lg:mt-5">
                                    <article className="bg-white border-0 shadow-sm rounded-lg p-3 text-center animate-fadeInUp hover:shadow-lg transition-all duration-300" style={{ animationDelay: '0.4s' }}>
                                        <div className="mx-auto mb-2 flex items-center justify-center rounded-full" style={{ width: '48px', height: '48px', backgroundColor: '#E3F2FD' }}>
                                            <svg className="w-6 h-6" style={{ color: '#2563EB' }} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                            </svg>
                                        </div>
                                        <h6 className="font-semibold mb-1" style={{ color: '#2563EB' }}>Tank Rental</h6>
                                        <small className="text-[#706f6c]" style={{ fontSize: '0.75rem' }}>Manage and track oxygen tank rentals easily.</small>
                                    </article>
                                    <article className="bg-white border-0 shadow-sm rounded-lg p-3 text-center animate-fadeInUp hover:shadow-lg transition-all duration-300" style={{ animationDelay: '0.6s' }}>
                                        <div className="mx-auto mb-2 flex items-center justify-center rounded-full" style={{ width: '48px', height: '48px', backgroundColor: '#E3F2FD' }}>
                                            <svg className="w-6 h-6" style={{ color: '#2563EB' }} fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <h6 className="font-semibold mb-1" style={{ color: '#2563EB' }}>Refill Tracking</h6>
                                        <small className="text-[#706f6c]" style={{ fontSize: '0.75rem' }}>Monitor refill requests and tank status in real-time.</small>
                                    </article>
                                    <article className="bg-white border-0 shadow-sm rounded-lg p-3 text-center animate-fadeInUp hover:shadow-lg transition-all duration-300" style={{ animationDelay: '0.8s' }}>
                                        <div className="mx-auto mb-2 flex items-center justify-center rounded-full" style={{ width: '48px', height: '48px', backgroundColor: '#E8F5E9' }}>
                                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <h6 className="font-semibold mb-1" style={{ color: '#2563EB' }}>
                                            Inventory<br className="hidden sm:inline" />Management
                                        </h6>
                                        <small className="text-[#706f6c]" style={{ fontSize: '0.75rem' }}>Keep accurate records of all oxygen tank inventory.</small>
                                    </article>
                                </section>
                            </section>

                            {/* Right Image */}
                            <aside className="flex-1 text-center order-1 lg:order-2 flex items-center justify-center animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                                <img
                                    src="images/hero-image.png"
                                    alt="Oxygen Tanks"
                                    className="w-full h-auto max-w-md lg:max-w-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                    style={{ maxWidth: 'min(100%, 500px)' }}
                                />
                            </aside>
                        </div>
                    </div>
                </section>
            </div>

            <footer
                ref={footerRef}
                data-footer="true"
                className={`bg-gray-900 text-white py-8 w-full transition-all duration-700 ${footerVisible ? 'animate-fadeInUp' : 'opacity-0'
                    }`}
            >
                <div className="px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src="images/mv-oxygen-logo.png"
                                alt="MV Oxygen Trading Logo"
                                className="w-8 h-8"
                            />
                            <span className="text-lg font-semibold">MV Oxygen Trading</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Oxygen Tank Rental & Refill Management System
                        </p>
                        <div className="mt-4 pt-4 border-t border-gray-700 text-gray-500 text-sm">
                            © 2026 MV Oxygen Trading. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
