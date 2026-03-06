"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Logo } from "../Logo";

const navLinks = [
	{ href: "/courses", label: "Курсы" },
	{ href: "/about", label: "Об основателе" },
	{ href: "/premium", label: "Подписка" },
];

export function Header() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={cn(
				"fixed top-0 left-0 right-0 z-50 transition-all duration-300",
				scrolled
					? "bg-background/95 backdrop-blur-xl border-b border-white/5"
					: "bg-transparent",
			)}
		>
			<nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
				<Link href="/" className="flex items-center gap-3 group shrink-0">
					<Logo className="size-9" />
					<span className="text-xl font-semibold tracking-normal">TeaCoder</span>
				</Link>

				<div className="hidden md:flex items-center gap-8">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
						>
							{link.label}
						</Link>
					))}
				</div>

				<div className="hidden md:flex items-center gap-6">
					<Link
						href="/login"
						className="text-base text-muted-foreground hover:text-primary transition-colors font-medium"
					>
						Войти
					</Link>
					<Link
						href="/register"
						className="px-5 h-10 flex items-center rounded-full bg-primary text-primary-foreground text-base font-medium hover:opacity-90 transition"
					>
						Начать
					</Link>
				</div>

				<button
					className="md:hidden p-2 text-muted-foreground"
					onClick={() => setMobileOpen(!mobileOpen)}
					aria-label="Toggle navigation"
				>
					{mobileOpen ? <X size={22} /> : <Menu size={22} />}
				</button>
			</nav>

			{mobileOpen && (
				<div className="md:hidden bg-background border-t border-white/5 px-6 pb-6 pt-4 flex flex-col gap-4">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="text-lg text-muted-foreground hover:text-primary transition-colors"
							onClick={() => setMobileOpen(false)}
						>
							{link.label}
						</Link>
					))}

					<div className="flex flex-col gap-3 pt-4">
						<Link
							href="/login"
							className="h-11 flex items-center justify-center rounded-full border border-white/10 text-base"
						>
							Sign in
						</Link>
						<Link
							href="/register"
							className="h-11 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-base font-medium"
						>
							Get started
						</Link>
					</div>
				</div>
			)}
		</header>
	);
}
