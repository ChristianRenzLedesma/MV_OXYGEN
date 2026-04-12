import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef, FormEventHandler } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [visibleFaqItems, setVisibleFaqItems] = useState<Set<number>>(new Set());
    const [footerVisible, setFooterVisible] = useState(false);
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        message: ''
    });
    const faqRefs = useRef<(HTMLElement | null)[]>([]);
    const footerRef = useRef<HTMLElement | null>(null);

    const handleContactSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        // Handle contact form submission
        console.log('Contact form submitted:', contactForm);
        // You can add actual form submission logic here
        alert('Thank you for your message! We will get back to you soon.');
        setContactForm({ name: '', email: '', message: '' });
    };

    const handleContactChange = (field: string, value: string) => {
        setContactForm(prev => ({ ...prev, [field]: value }));
    };

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

        // Observe all FAQ items
        faqRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        // Observe footer
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
                        <div className="hidden lg:flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
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
                                </>
                            )}
                        </div>

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
                <section className="w-full flex justify-center">
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

                {/* FAQ Section */}
                <section className="py-16 bg-white dark:bg-gray-900">
                    <div className="px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12 animate-fadeInUp">
                                <h2 className="text-3xl font-bold text-[#1b1b18] dark:text-[#EDEDEC] mb-4">
                                    Frequently Asked Questions
                                </h2>
                                <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                    Everything you need to know about our oxygen tank rental services
                                </p>
                            </div>

                            <div className="space-y-4">
                                {/* FAQ Item 1 */}
                                <div
                                    ref={(el) => (faqRefs.current[0] = el)}
                                    data-faq-index="0"
                                    className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-all duration-300 ${visibleFaqItems.has(0) ? 'animate-fadeInUp' : 'opacity-0'
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
                                    className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-all duration-300 ${visibleFaqItems.has(1) ? 'animate-fadeInUp' : 'opacity-0'
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
                                    className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-all duration-300 ${visibleFaqItems.has(2) ? 'animate-fadeInUp' : 'opacity-0'
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
                                    className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-all duration-300 ${visibleFaqItems.has(3) ? 'animate-fadeInUp' : 'opacity-0'
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
                                    className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-all duration-300 ${visibleFaqItems.has(4) ? 'animate-fadeInUp' : 'opacity-0'
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
                    </div>
                </section>

                <section id="Contact" className="py-5 d-flex align-items-center" style={{ backgroundColor: 'blue', color: 'white', minHeight: '15vh' }}>
                    <div className="container">
                        {/* Content will be added here */}

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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Company Info */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src="images/mv-oxygen-logo.png"
                                    alt="MV Oxygen Trading Logo"
                                    className="w-8 h-8"
                                />
                                <span className="text-lg font-semibold">MV Oxygen Trading</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                MV Oxygen Trading
                            </p>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold mb-4">Send us a Message</h3>
                            </div>
                            <form onSubmit={handleContactSubmit} className="space-y-3">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        value={contactForm.name}
                                        onChange={(e) => handleContactChange('name', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        value={contactForm.email}
                                        onChange={(e) => handleContactChange('email', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
                                        required
                                    />
                                </div>
                                <div>
                                    <textarea
                                        placeholder="Your Message"
                                        value={contactForm.message}
                                        onChange={(e) => handleContactChange('message', e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 resize-none"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                        {/* Embedded Google Maps */}
                        <div className="mt-8">
                            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                                <div className="px-6 py-4">
                                    <h3 className="text-lg font-medium text-gray-900">Contact Us</h3>
                                    <p className="mt-1 text-gray-500">Find us on the map</p>
                                </div>
                                <div className="relative h-[250px]">
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3847.5302633465744!2d121.04813007011415!3d15.347742237171778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33972300634ae665%3A0x1fe9ddec2dc8a12a!2sLily%E2%80%99s%20Merchandise!5e0!3m2!1sen!2sph!4v1775918142505!5m2!1sen!2sph" width="600" height="450" style={{ border: '0' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full px-6 pb-4">
                                    <div className="flex items-center">
                                        <svg
                                            className="w-4 h-4 mr-2 fill-current text-gray-500"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <p className="text-sm text-gray-500">MV Oxygen Trading</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                        <div className="border-t border-gray-700 my-6"></div>
                        <p className="text-gray-400 text-sm">
                            2026 MV Oxygen Trading. All rights reserved.
                        </p>
                    </div>


                </div>
            </footer>
        </>
    );
}
