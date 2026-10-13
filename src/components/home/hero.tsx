'use client'

import {
	motion,
	useMotionValue,
	useReducedMotion,
	useSpring,
	useTransform
} from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { PointerEvent } from 'react'

import { ROUTES } from '@/lib/routes'

import { Button } from '../ui/button'

const EASE = [0.22, 1, 0.36, 1] as const

export function Hero() {
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
					className='pointer-events-none absolute top-[5%] right-[-4%] -z-10 hidden w-[42%] max-w-[580px] md:block'
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

				<div className='px-6 pt-16 pb-12 sm:px-12 sm:pt-24 lg:px-16 lg:pt-32'>
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
			</div>
		</section>
	)
}
