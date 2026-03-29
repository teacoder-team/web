'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Logo } from '../Logo'

import { cn } from '@/lib/utils/cn'

const navLinks = [
	{ href: '/courses', label: 'Курсы' },
	{ href: '/about', label: 'Об основателе' },
	{ href: '/pricing', label: 'Подписка' }
]

export function Header() {
	const [mobileOpen, setMobileOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return (
		<header
			className={cn(
				'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
				scrolled
					? 'bg-background/95 border-b border-white/5 backdrop-blur-xl'
					: 'bg-transparent'
			)}
		>
			<nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
				<Link href="/" className="group flex shrink-0 items-center gap-3">
					<Logo className="size-9" />
					<span className="text-xl font-semibold tracking-normal">TeaCoder</span>
				</Link>

				<div className="hidden items-center gap-8 md:flex">
					{navLinks.map(link => (
						<Link
							key={link.href}
							href={link.href}
							className="text-muted-foreground hover:text-primary text-[15px] font-normal transition-colors"
						>
							{link.label}
						</Link>
					))}
				</div>

				<div className="hidden items-center gap-6 md:flex">
					<Link
						href="/login"
						className="text-muted-foreground hover:text-primary text-[15px] font-normal transition-colors"
					>
						Войти
					</Link>
					<Link
						href="/register"
						className="bg-primary text-primary-foreground flex h-10 items-center rounded-full px-5 text-[15px] font-normal transition hover:opacity-90"
					>
						Начать
					</Link>
				</div>

				<button
					className="text-muted-foreground p-2 md:hidden"
					onClick={() => setMobileOpen(!mobileOpen)}
					aria-label="Toggle navigation"
				>
					{mobileOpen ? <X size={22} /> : <Menu size={22} />}
				</button>
			</nav>

			{mobileOpen && (
				<div className="bg-background flex flex-col gap-4 border-t border-white/5 px-6 pt-4 pb-6 md:hidden">
					{navLinks.map(link => (
						<Link
							key={link.href}
							href={link.href}
							className="text-muted-foreground hover:text-primary text-lg transition-colors"
							onClick={() => setMobileOpen(false)}
						>
							{link.label}
						</Link>
					))}

					<div className="flex flex-col gap-3 pt-4">
						<Link
							href="/login"
							className="flex h-11 items-center justify-center rounded-full border border-white/10 text-base"
						>
							Sign in
						</Link>
						<Link
							href="/register"
							className="bg-primary text-primary-foreground flex h-11 items-center justify-center rounded-full text-base font-medium"
						>
							Get started
						</Link>
					</div>
				</div>
			)}
		</header>
	)
}
