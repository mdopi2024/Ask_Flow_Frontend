"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CircleUser, LogOut, Menu, MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";


// TEMPORARY: change to true/false to preview both navbar states.
const IS_LOGGED_IN = true;

const MOCK_USER = { email: "demo@formchat.com", name: "Demo User" };

// Links that always show in the middle
const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/#features", label: "Features" },
    { href: "/# how-it-works", label: "How it works" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/#demo", label: "Demo", live: true },
];

// Extra link that shows only when the user is logged in
const dashboardLink = { href: "/dashboard", label: "Dashboard" };

const primaryButton = "bg-primary text-primary-foreground hover:bg-primary-hover";
const hoverStyle = "hover:bg-primary-soft hover:text-primary";
const activeStyle = "bg-primary-soft text-primary";

// TYPES AND HELPERS
type User = { email: string; name?: string };
type NavLink = { href: string; label: string; live?: boolean };

// Decides which link gets the highlighted "active" style
function isActive(pathname: string, href: string) {
    if (href.includes("#")) return false; // landing page anchors are never "active"
    return pathname === href || pathname.startsWith(href + "/");
}


// SMALL BUILDING BLOCKS                                            


// Green pulsing "Live" badge
function LiveBadge() {
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-teal px-1.5 py-0.5 text-[10px] font-semibold leading-none text-teal-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-foreground" />
            Live
        </span>
    );
}

function Logo({ href }: { href: string }) {
    return (
        <Link href={href} className="flex items-center gap-2 font-semibold text-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <MessageSquareText className="h-4 w-4" />
            </span>
            <span className="text-lg tracking-tight">FormChat</span>
        </Link>
    );
}

// Middle links on desktop
function DesktopLinks({ links, pathname }: { links: NavLink[]; pathname: string }) {
    return (
        <ul className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                                "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors",
                                hoverStyle,
                                active && activeStyle
                            )}
                        >
                            {link.label}
                            {link.live && <LiveBadge />}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}


/* 4. RIGHT SIDE (desktop)                                             */


// Logged in: user icon with a dropdown (name + Log out)
function UserMenu({ user, onLogout }: { user: User; onLogout: () => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("hidden md:inline-flex", hoverStyle)}
                        aria-label="Open user menu"
                    />
                }
            >
                <CircleUser className="size-6.5" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                        <p className="truncate text-sm font-medium text-foreground">
                            {user.name ?? user.email}
                        </p>
                        {user.name && (
                            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                        )}
                    </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem variant="destructive" onClick={onLogout}>
                    <LogOut className="h-4 w-4" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// Logged out: simple Log in button
function LoginButton() {
    return (
        <Link
            href="/login"
            className={cn(buttonVariants(), primaryButton, "hidden md:inline-flex")}
        >
            Log in
        </Link>
    );
}


/* 5. MOBILE MENU                                                      */


function MobileMenu({
    user,
    links,
    pathname,
    onLogout,
}: {
    user: User | null;
    links: NavLink[];
    pathname: string;
    onLogout: () => void;
}) {
    return (
        <Sheet>
            <SheetTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("md:hidden", hoverStyle)}
                        aria-label="Open menu"
                    />
                }
            >
                <Menu className="h-5 w-5" />
            </SheetTrigger>

            <SheetContent side="right" className="w-72 bg-surface p-0">
                <SheetHeader className="border-b border-border p-4">
                    <SheetTitle className="text-left">
                        <Logo href="/" />
                    </SheetTitle>
                </SheetHeader>

                {/* Links */}
                <div className="flex flex-col gap-1 p-4">
                    {links.map((link) => {
                        const active = isActive(pathname, link.href);
                        return (
                            <SheetClose
                                key={link.href}
                                nativeButton={false}
                                render={
                                    <Link
                                        href={link.href}
                                        aria-current={active ? "page" : undefined}
                                        className={cn(
                                            "flex items-center gap-1.5 rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors",
                                            hoverStyle,
                                            active && activeStyle
                                        )}
                                    />
                                }
                            >
                                {link.label}
                                {link.live && <LiveBadge />}
                            </SheetClose>
                        );
                    })}
                </div>

                {/* Bottom: Log in or Log out */}
                <div className="mt-2 flex flex-col gap-2 border-t border-border p-4">
                    {user ? (
                        <>
                            <p className="truncate px-1 text-xs text-muted-foreground">
                                Signed in as {user.name ?? user.email}
                            </p>
                            <SheetClose
                                render={
                                    <Button
                                        variant="outline"
                                        className="border-border"
                                        onClick={onLogout}
                                    />
                                }
                            >
                                <LogOut className="h-4 w-4" />
                                Log out
                            </SheetClose>
                        </>
                    ) : (
                        <SheetClose
                            nativeButton={false}
                            render={
                                <Link href="/login" className={cn(buttonVariants(), primaryButton)} />
                            }
                        >
                            Log in
                        </SheetClose>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}


/* 6. MAIN NAVBAR                                                      */

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [loggedIn, setLoggedIn] = useState(IS_LOGGED_IN);

    const user = loggedIn ? MOCK_USER : null;
    const links = user ? [...publicLinks, dashboardLink] : publicLinks;

    function handleLogout() {
        setLoggedIn(false);
        router.push("/");
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <nav
                aria-label="Main"
                className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6"
            >
                {/* Left */}
                <Logo href="/" />

                {/* Middle */}
                <DesktopLinks links={links} pathname={pathname} />

                {/* Right */}
                <div className="flex items-center gap-2">
                    {user ? <UserMenu user={user} onLogout={handleLogout} /> : <LoginButton />}
                    <MobileMenu
                        user={user}
                        links={links}
                        pathname={pathname}
                        onLogout={handleLogout}
                    />
                </div>
            </nav>
        </header>
    );
}