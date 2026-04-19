import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { type SharedData } from '@/types';

export default function FAQ() {
    const { auth, url } = usePage<SharedData>().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [visibleFaqItems, setVisibleFaqItems] = useState<Set<number>>(new Set());
    const [footerVisible, setFooterVisible] = useState(false);
    const faqRefs = useRef<(HTMLElement | null)[]>([]);
    const footerRef = useRef<HTMLElement | null>(null);

    const currentPath = url || '';

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.target.getAttribute('data-faq-index')) {
                        const index = parseInt(entry.target.getAttribute('data-faq-index') || '0');
                        if (entry.isIntersecting) {
                            setVisibleFaqItems((prev) => new Set(prev).add(index));
                        }
                    } else if (entry.target.getAttribute('data-footer')) {
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

        faqRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => {
            faqRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
            if (footerRef.current) {
                observer.unobserve(footerRef.current);
            }
        };
    }, []);

    return (
        <>
            <Head title="FAQ - MV Oxygen Trading">
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
                                className="inline-block px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:text-blue-600 dark:text-[#EDEDEC] dark:hover:text-blue-400 transition-colors"
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
                                className="inline-block px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:text-blue-600 dark:text-[#EDEDEC] dark:hover:text-blue-400 transition-colors"
                            >
                                Contact
                            </Link>
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
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
                {/* Header */}
                <header className="max-w-4xl mx-auto text-center mb-12 animate-fadeInUp">
                    <h1 className="text-4xl font-bold text-[#1b1b18] dark:text-[#EDEDEC] mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-[#706f6c] dark:text-[#A1A09A] text-lg">
                        Everything you need to know about our oxygen tank rental services
                    </p>
                </header>

                {/* FAQ Section */}
                <div className="max-w-4xl mx-auto space-y-4">
                    {/* FAQ Item 1 */}
                    <div
                        ref={(el) => (faqRefs.current[0] = el)}
                        data-faq-index="0"
                        className={`bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-all duration-300 ${visibleFaqItems.has(0) ? 'animate-fadeInUp' : 'opacity-0'
                            }`}
                        style={{ animationDelay: visibleFaqItems.has(0) ? '0.1s' : '0s' }}
                    >
                        <button
                            onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                            className="w-full text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-colors"
                        >
                            <h3 className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                How do I rent an oxygen tank?
                            </h3>
                            <svg
                                className={`w-5 h-5 text-[#706f6c] dark:text-[#A1A09A] transition-transform duration-200 ${openFaq === 1 ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {openFaq === 1 && (
                            <p className="mt-4 text-[#706f6c] dark:text-[#A1A09A] animate-fadeIn">
                                Simply register for an account, browse our available tanks, and select rental period that suits your needs. We offer flexible rental options from daily to monthly plans.
                            </p>
                        )}
                    </div>

                    {/* FAQ Item 2 */}
                    <div
                        ref={(el) => (faqRefs.current[1] = el)}
                        data-faq-index="1"
                        className={`bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-all duration-300 ${visibleFaqItems.has(1) ? 'animate-fadeInUp' : 'opacity-0'
                            }`}
                        style={{ animationDelay: visibleFaqItems.has(1) ? '0.2s' : '0s' }}
                    >
                        <button
                            onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                            className="w-full text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-colors"
                        >
                            <h3 className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                What types of oxygen tanks do you offer?
                            </h3>
                            <svg
                                className={`w-5 h-5 text-[#706f6c] dark:text-[#A1A09A] transition-transform duration-200 ${openFaq === 2 ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {openFaq === 2 && (
                            <p className="mt-4 text-[#706f6c] dark:text-[#A1A09A] animate-fadeIn">
                                We offer various sizes of medical-grade oxygen tanks including portable cylinders (5L, 10L) and larger stationary tanks (20L, 50L) suitable for home and clinical use.
                            </p>
                        )}
                    </div>

                    {/* FAQ Item 3 */}
                    <div
                        ref={(el) => (faqRefs.current[2] = el)}
                        data-faq-index="2"
                        className={`bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-all duration-300 ${visibleFaqItems.has(2) ? 'animate-fadeInUp' : 'opacity-0'
                            }`}
                        style={{ animationDelay: visibleFaqItems.has(2) ? '0.3s' : '0s' }}
                    >
                        <button
                            onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                            className="w-full text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-colors"
                        >
                            <h3 className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                How do I request a refill?
                            </h3>
                            <svg
                                className={`w-5 h-5 text-[#706f6c] dark:text-[#A1A09A] transition-transform duration-200 ${openFaq === 3 ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {openFaq === 3 && (
                            <p className="mt-4 text-[#706f6c] dark:text-[#A1A09A] animate-fadeIn">
                                Through our dashboard, you can easily request refills for your rented tanks. We monitor tank levels and provide timely delivery services to ensure you never run out of oxygen.
                            </p>
                        )}
                    </div>

                    {/* FAQ Item 4 */}
                    <div
                        ref={(el) => (faqRefs.current[3] = el)}
                        data-faq-index="3"
                        className={`bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-all duration-300 ${visibleFaqItems.has(3) ? 'animate-fadeInUp' : 'opacity-0'
                            }`}
                        style={{ animationDelay: visibleFaqItems.has(3) ? '0.4s' : '0s' }}
                    >
                        <button
                            onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
                            className="w-full text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-colors"
                        >
                            <h3 className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                Is delivery available?
                            </h3>
                            <svg
                                className={`w-5 h-5 text-[#706f6c] dark:text-[#A1A09A] transition-transform duration-200 ${openFaq === 4 ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {openFaq === 4 && (
                            <p className="mt-4 text-[#706f6c] dark:text-[#A1A09A] animate-fadeIn">
                                Yes, we offer delivery services within Metro Manila and surrounding areas. Delivery fees may apply depending on your location. Same-day delivery is available for emergency requests.
                            </p>
                        )}
                    </div>

                    {/* FAQ Item 5 */}
                    <div
                        ref={(el) => (faqRefs.current[4] = el)}
                        data-faq-index="4"
                        className={`bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-all duration-300 ${visibleFaqItems.has(4) ? 'animate-fadeInUp' : 'opacity-0'
                            }`}
                        style={{ animationDelay: visibleFaqItems.has(4) ? '0.5s' : '0s' }}
                    >
                        <button
                            onClick={() => setOpenFaq(openFaq === 5 ? null : 5)}
                            className="w-full text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-colors"
                        >
                            <h3 className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                What safety measures should I follow?
                            </h3>
                            <svg
                                className={`w-5 h-5 text-[#706f6c] dark:text-[#A1A09A] transition-transform duration-200 ${openFaq === 5 ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {openFaq === 5 && (
                            <p className="mt-4 text-[#706f6c] dark:text-[#A1A09A] animate-fadeIn">
                                Keep tanks upright, away from heat sources and open flames. Ensure proper ventilation in the usage area. Our team provides comprehensive safety guidelines with every rental.
                            </p>
                        )}
                    </div>
                </div>
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
