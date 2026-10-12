'use client'

import {
	motion,
	useReducedMotion,
	useScroll,
	useTransform
} from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { FaTelegram, FaYoutube } from 'react-icons/fa6'

import { Reveal } from '../motion/reveal'
import { Button } from '../ui/button'

export function TelegramCTA() {
	const ref = useRef<HTMLDivElement>(null)
	const reduceMotion = useReducedMotion()

	// The planet rises as the panel scrolls into view
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start end', 'end end']
	})
	const planetY = useTransform(scrollYProgress, [0, 1], ['45%', '0%'])

	return (
		<section className='frame-container pb-3 sm:pb-5'>
			<div
				ref={ref}
				className='relative isolate flex flex-col items-center overflow-hidden rounded-[1.75rem] bg-inverse px-6 pb-[clamp(11rem,24vw,22rem)] pt-20 text-center text-inverse-foreground sm:pt-28'
			>
				<Image
					src='/images/art/cta-grain.webp'
					alt=''
					fill
					sizes='100vw'
					className='-z-20 object-cover'
				/>
				<motion.div
					aria-hidden='true'
					style={reduceMotion ? undefined : { y: planetY }}
					className='pointer-events-none absolute -left-1/2 bottom-0 -z-10 w-[200%] sm:-left-[20%] sm:w-[140%] lg:left-0 lg:w-full'
				>
					<Image
						src='/images/art/planet-wide.png'
						alt=''
						width={2400}
						height={560}
						sizes='100vw'
						className='h-auto w-full'
					/>
				</motion.div>

				<Reveal className='flex flex-col items-center'>
					<span className='flex size-14 items-center justify-center rounded-full border border-inverse-foreground/15 bg-inverse-foreground/[0.06] backdrop-blur-md'>
						<FaTelegram className='size-6 text-highlight' />
					</span>
					<h2 className='mt-8 max-w-3xl font-display text-display-xl font-medium'>
						Присоединяйся{' '}
						<span className='text-highlight'>в Telegram</span>.
					</h2>
					<p className='mt-5 max-w-xl text-base leading-relaxed text-inverse-foreground/70 sm:text-lg'>
						Подписывайся на наш канал! Получай последние новости,
						общайся с единомышленниками и будь в курсе самых
						актуальных событий.
					</p>
					<div className='mt-10 flex flex-col gap-3 sm:flex-row'>
						<Button size='xl' variant='highlight' asChild>
							<Link
								href='https://t.me/TeaCoder_official'
								target='_blank'
								rel='noopener noreferrer'
							>
								Присоединиться
								<ArrowRight />
							</Link>
						</Button>
						<Button size='xl' variant='glass' asChild>
							<Link
								href='https://youtube.com/@TeaCoder52'
								target='_blank'
								rel='noopener noreferrer'
							>
								<FaYoutube />
								YouTube
							</Link>
						</Button>
					</div>
				</Reveal>
			</div>
		</section>
	)
}
