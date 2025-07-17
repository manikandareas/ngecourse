'use client';
import { useState } from 'react';
import {
    MobileNav,
    MobileNavHeader,
    MobileNavMenu,
    MobileNavToggle,
    NavbarButton,
    Navbar as NavbarComp,
    NavbarLogo,
    NavBody,
    NavItems,
} from '~/components/ui/resizable-navbar';

export function Navbar() {
    const navItems = [
        {
            name: 'Home',
            link: '/',
        },
        {
            name: 'Courses',
            link: '/courses',
        },
        {
            name: 'Threads',
            link: '/threads',
        },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <NavbarComp className="mx-auto max-w-6xl">
            {/* Desktop Navigation */}
            <NavBody className="py-4">
                <NavbarLogo />
                <NavItems items={navItems} />
                <div className="flex items-center gap-4">
                    <NavbarButton href="/sign-in" variant="secondary">
                        Login
                    </NavbarButton>
                    <NavbarButton variant="primary">Book a call</NavbarButton>
                </div>
            </NavBody>

            {/* Mobile Navigation */}
            <MobileNav>
                <MobileNavHeader>
                    <NavbarLogo />
                    <MobileNavToggle
                        isOpen={isMobileMenuOpen}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    />
                </MobileNavHeader>

                <MobileNavMenu
                    isOpen={isMobileMenuOpen}
                    onClose={() => setIsMobileMenuOpen(false)}
                >
                    {navItems.map((item, idx) => (
                        <a
                            className="relative text-neutral-600 dark:text-neutral-300"
                            href={item.link}
                            key={`mobile-link-${idx.toString()}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="block">{item.name}</span>
                        </a>
                    ))}
                    <div className="flex w-full flex-col gap-4">
                        <NavbarButton
                            className="w-full"
                            onClick={() => setIsMobileMenuOpen(false)}
                            variant="primary"
                        >
                            Login
                        </NavbarButton>
                        <NavbarButton
                            className="w-full"
                            onClick={() => setIsMobileMenuOpen(false)}
                            variant="primary"
                        >
                            Book a call
                        </NavbarButton>
                    </div>
                </MobileNavMenu>
            </MobileNav>
        </NavbarComp>
    );
}
