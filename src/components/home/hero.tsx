'use client'

import {
	motion,
	useMotionValue,
	useReducedMotion,
	useSpring,
	useTransform
} from 'framer-motion'
import { ArrowRight, Play, PlayCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { PointerEvent } from 'react'

import { ROUTES } from '@/constants/routes'

import { cn, getLessonLabel } from '@/lib/utils'

import { Logo } from '../shared/logo'
import { Button } from '../ui/button'

export interface CourseCover {
	slug: string
	title: string
	src: string
	lessons: number
}

interface HeroProps {
	covers: CourseCover[]
}

const EASE = [0.22, 1, 0.36, 1] as const

export function Hero({ covers }: HeroProps) {
	const reduceMotion = useReducedMotion()

	// Subtle pointer parallax for the sphere
	const pointerX = useMotionValue(0)
	const pointerY = useMotionValue(0)
	const springX = useSpring(pointerX, { stiffness: 60, damping: 20 })
	const springY = useSpring(pointerY, { stiffness: 60, damping: 20 })
	const sphereX = useTransform(springX, value => value * 28)
	const sphereY = useTransform(springY, value => value * 20)

	function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
		if (reduceMotion) return
		const rect = event.currentTarget.getBoundingClientRect()
		pointerX.set((event.clientX - rect.left) / rect.width - 0.5)
		pointerY.set((event.clientY - rect.top) / rect.height - 0.5)
	}

	const fadeUp = (delay: number) => ({
		initial: reduceMotion ? false : { opacity: 0, y: 18 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.8, delay, ease: EASE }
	})

	return (
		<section className='frame-container pt-2'>
			<div
				onPointerMove={handlePointerMove}
				className='relative isolate overflow-hidden rounded-[1.75rem] bg-inverse text-inverse-foreground'
			>
				<Image
					src='/images/art/hero-grain.webp'
					alt=''
					fill
					priority
					sizes='100vw'
					className='-z-20 object-cover'
				/>
				<motion.div
					aria-hidden='true'
					style={{ x: sphereX, y: sphereY }}
					className='pointer-events-none absolute -right-[4%] top-[5%] -z-10 hidden w-[42%] max-w-[580px] md:block'
					initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1.4, delay: 0.2, ease: EASE }}
				>
					<Image
						src='/images/art/sphere-halftone.png'
						unoptimized
						alt=''
						width={960}
						height={960}
						priority
						className='h-auto w-full'
					/>
				</motion.div>

				<div className='px-6 pb-12 pt-16 sm:px-12 sm:pt-24 lg:px-16 lg:pt-32'>
					<motion.p
						{...fadeUp(0)}
						className='inline-flex rounded-full border border-highlight/40 px-3.5 py-1.5 text-sm font-medium text-highlight'
					>
						Курсы по веб-разработке
					</motion.p>

					<motion.h1
						{...fadeUp(0.08)}
						className='mt-7 max-w-3xl font-display text-display-2xl font-medium'
					>
						Изучай веб&#8209;разработку
						<br />с <span className='text-highlight'>TeaCoder</span>
						.
					</motion.h1>

					<motion.p
						{...fadeUp(0.16)}
						className='mt-6 max-w-xl text-base leading-relaxed text-inverse-foreground/70 sm:text-lg'
					>
						Платформа для изучения веб-разработки с гибким подходом.
						Получи доступ к курсам, которые помогут развить навыки и
						разобраться в реальных примерах.
					</motion.p>

					<motion.div
						{...fadeUp(0.24)}
						className='mt-10 flex flex-col gap-3 sm:flex-row'
					>
						<Button size='xl' variant='highlight' asChild>
							<Link href={ROUTES.COURSES.ROOT}>
								Начать обучение
								<ArrowRight />
							</Link>
						</Button>
						<Button size='xl' variant='glass' asChild>
							<Link href={ROUTES.PREMIUM}>Оформить подписку</Link>
						</Button>
					</motion.div>
				</div>

				{/* {covers.length > 0 && (
					<motion.div
						className='ml-auto mt-4 w-full pl-6 sm:pl-12 lg:w-[76%] lg:pl-0'
						initial={reduceMotion ? false : { opacity: 0, y: 60 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1.1, delay: 0.45, ease: EASE }}
					>
						<LessonPreview covers={covers} />
					</motion.div>
				)} */}
			</div>
		</section>
	)
}

/**
 * Illustrative window of the lesson screen built from real course data.
 * The panel's bottom edge crops it on purpose.
 */
function LessonPreview({ covers }: { covers: CourseCover[] }) {
	const current = covers[0]!
	const list = covers.slice(0, 6)

	return (
		<div
			aria-hidden='true'
			className='h-[300px] overflow-hidden rounded-tl-2xl border-l border-t border-inverse-foreground/10 bg-inverse/85 backdrop-blur-xl sm:h-[380px]'
		>
			<div className='grid h-full grid-cols-1 md:grid-cols-[230px_1fr]'>
				<aside className='hidden border-r border-inverse-foreground/10 p-4 md:block'>
					<div className='flex items-center gap-2 text-sm font-semibold'>
						<Logo className='h-5 w-auto' color='fill-highlight' />
						TeaCoder
					</div>
					<p className='mt-6 px-2 text-xs font-medium text-inverse-foreground/40'>
						Курсы
					</p>
					<ul className='mt-2 space-y-0.5'>
						{list.map((cover, index) => (
							<li
								key={`${cover.slug}-${index}`}
								className={cn(
									'flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px]',
									index === 0
										? 'bg-inverse-foreground/[0.08] text-highlight'
										: 'text-inverse-foreground/55'
								)}
							>
								<PlayCircle className='size-3.5 shrink-0' />
								<span className='truncate'>{cover.title}</span>
							</li>
						))}
					</ul>
				</aside>

				<div className='min-w-0 p-5 sm:p-7'>
					<p className='truncate text-xs text-inverse-foreground/40'>
						Курсы / {current.title}
					</p>
					<p className='mt-2 truncate font-display text-xl font-medium sm:text-2xl'>
						{current.title}
					</p>
					{current.lessons > 0 && (
						<p className='mt-1 text-sm text-inverse-foreground/50'>
							{current.lessons} {getLessonLabel(current.lessons)}
						</p>
					)}
					<div className='relative mt-5 aspect-video max-w-2xl overflow-hidden rounded-xl border border-inverse-foreground/10'>
						<Image
							src={current.src}
							alt=''
							fill
							sizes='640px'
							className='object-cover'
						/>
						<span className='absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-inverse-foreground/20 bg-inverse/50 backdrop-blur-md'>
							<Play className='size-5 translate-x-px fill-current' />
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}
