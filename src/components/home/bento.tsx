'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, Code2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { type ReactNode, useEffect, useRef, useState } from 'react'

import { ROUTES } from '@/lib/routes'
import { LESSON, cn, pluralize } from '@/lib/utils'

import { Reveal } from '../motion/reveal'
import { Button } from '../ui/button'

const EASE = [0.22, 1, 0.36, 1] as const

export interface CourseCover {
	slug: string
	title: string
	src: string
	lessons: number
}

interface BentoProps {
	covers: CourseCover[]
}

export function Bento({ covers }: BentoProps) {
	return (
		<section className='page-container pb-20 sm:pb-28'>
			<div className='grid gap-5 lg:grid-cols-2 [&>*]:min-w-0'>
				<Reveal>
					<TextCard
						title='Разнообразие курсов.'
						description='На платформе есть курсы по программированию и другим темам. Все уроки доступны в любое время, так что ты можешь учиться в удобном ритме.'
						action={
							<Button size='lg' asChild>
								<Link href={ROUTES.COURSES.ROOT}>
									Все курсы
									<ArrowRight />
								</Link>
							</Button>
						}
					/>
				</Reveal>
				<Reveal delay={0.08}>
					<CoursesMarqueeCard covers={covers} />
				</Reveal>
				<Reveal>
					<ProgressCard />
				</Reveal>
				<Reveal delay={0.08}>
					<TextCard
						title='Практика с кодом.'
						description='Все курсы включают видеоуроки и реальные примеры кода. Ты сможешь не только изучать теорию, но и сразу применять её на практике.'
					>
						<CodeWindow />
					</TextCard>
				</Reveal>
			</div>

			<Reveal>
				<h2 className='pt-20 text-center font-display text-display-xl font-medium text-brand sm:pt-28'>
					Учись в своём ритме.
				</h2>
			</Reveal>
		</section>
	)
}

interface TextCardProps {
	title: string
	description: string
	action?: ReactNode
	children?: ReactNode
}

function TextCard({ title, description, action, children }: TextCardProps) {
	return (
		<article className='flex h-full min-h-[400px] flex-col rounded-3xl border border-border bg-card p-7 sm:p-10'>
			<h3 className='font-display text-display-md font-medium'>
				{title}
			</h3>
			<p className='mt-4 max-w-lg leading-relaxed text-muted-foreground'>
				{description}
			</p>
			{action && <div className='mt-8'>{action}</div>}
			{children && <div className='mt-8 flex-1'>{children}</div>}
		</article>
	)
}

function CoursesMarqueeCard({ covers }: { covers: CourseCover[] }) {
	const minItems = 6
	const repeats = Math.max(
		1,
		Math.ceil(minItems / Math.max(covers.length, 1))
	)
	const items = Array.from({ length: repeats }, () => covers).flat()

	return (
		<div className='grain relative flex h-full min-h-[400px] items-center overflow-hidden rounded-3xl bg-primary py-10'>
			<div className='group flex overflow-hidden'>
				<div
					className='flex w-max animate-marquee gap-5 pr-5 group-hover:[animation-play-state:paused] motion-reduce:animate-none'
					style={{ ['--marquee-duration' as string]: '55s' }}
				>
					{[...items, ...items].map((cover, index) => {
						const isClone = index >= items.length

						return (
							<Link
								key={index}
								href={ROUTES.COURSES.SINGLE(cover.slug)}
								tabIndex={isClone ? -1 : 0}
								aria-hidden={isClone}
								className='group/card w-72 shrink-0 rounded-2xl bg-inverse p-2.5 text-inverse-foreground shadow-[0_24px_48px_-24px_hsl(var(--inverse)/0.7)] transition-transform duration-300 ease-out hover:-translate-y-1 sm:w-80'
							>
								<div className='relative aspect-video overflow-hidden rounded-xl'>
									<Image
										src={cover.src}
										alt={cover.title}
										fill
										sizes='320px'
										className='object-cover'
									/>
								</div>
								<div className='px-2 pb-2 pt-4'>
									<p className='line-clamp-1 font-medium'>
										{cover.title}
									</p>
									<p className='mt-1 text-sm text-inverse-foreground/50'>
										{cover.lessons > 0
											? pluralize(cover.lessons, LESSON)
											: 'Видео на YouTube'}
									</p>
								</div>
							</Link>
						)
					})}
				</div>
			</div>
		</div>
	)
}

const PROGRESS_ROWS = [
	{ done: true, width: 70 },
	{ done: true, width: 54 },
	{ done: true, width: 78 },
	{ done: false, width: 62, current: true },
	{ done: false, width: 48 }
]

function ProgressCard() {
	const ref = useRef<HTMLDivElement>(null)
	const isInView = useInView(ref, { once: true, amount: 0.5 })
	const reduceMotion = useReducedMotion()
	const play = isInView || !!reduceMotion

	const done = PROGRESS_ROWS.filter(row => row.done).length
	const percent = Math.round((done / PROGRESS_ROWS.length) * 100)

	return (
		<div
			ref={ref}
			className='relative isolate flex h-full min-h-[400px] flex-col overflow-hidden rounded-3xl bg-inverse text-inverse-foreground'
		>
			<Image
				src='/images/art/panel-grain.webp'
				alt=''
				fill
				sizes='(min-width: 1024px) 50vw, 100vw'
				className='-z-10 object-cover'
			/>
			<div className='p-7 sm:p-10'>
				<h3 className='font-display text-display-md font-medium'>
					Отслеживание прогресса.
				</h3>
				<p className='mt-4 max-w-md leading-relaxed text-inverse-foreground/70'>
					Проходи уроки и зарабатывай очки. Вся статистика сохраняется
					в профиле, чтобы ты видел свой рост.
				</p>
			</div>

			<div
				aria-hidden='true'
				className='ml-auto mt-auto w-[88%] rounded-tl-2xl border-l border-t border-inverse-foreground/10 bg-inverse/80 p-5 backdrop-blur-xl sm:p-6'
			>
				<div className='flex items-center justify-between text-sm'>
					<span className='font-medium'>Прогресс курса</span>
					<span className='font-mono tabular-nums text-highlight'>
						{percent}%
					</span>
				</div>
				<div className='mt-3 h-1.5 overflow-hidden rounded-full bg-inverse-foreground/10'>
					<motion.div
						className='h-full rounded-full bg-highlight'
						initial={{ width: 0 }}
						animate={{ width: play ? `${percent}%` : 0 }}
						transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
					/>
				</div>
				<ul className='mt-5 space-y-3'>
					{PROGRESS_ROWS.map((row, index) => (
						<li
							key={index}
							className={cn(
								'flex items-center gap-3 rounded-lg',
								row.current &&
									'-mx-2 bg-inverse-foreground/[0.06] px-2 py-1.5'
							)}
						>
							<motion.span
								className={cn(
									'flex size-5 shrink-0 items-center justify-center rounded-full',
									row.done
										? 'bg-highlight text-inverse'
										: 'ring-1 ring-inset ring-inverse-foreground/25'
								)}
								initial={row.done ? { scale: 0 } : false}
								animate={{ scale: play || !row.done ? 1 : 0 }}
								transition={{
									delay: 0.35 + index * 0.18,
									type: 'spring',
									stiffness: 500,
									damping: 24
								}}
							>
								{row.done && (
									<Check className='size-3' strokeWidth={3} />
								)}
							</motion.span>
							<span
								className={cn(
									'h-2 rounded-full',
									row.current
										? 'bg-highlight/50'
										: 'bg-inverse-foreground/15'
								)}
								style={{ width: `${row.width}%` }}
							/>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

const CODE_LINES = [
	'export default async function Page() {',
	'  const courses = await getCourses()',
	'',
	'  return <CourseList courses={courses} />',
	'}'
]
const CODE_TEXT = CODE_LINES.join('\n')

function CodeWindow() {
	const ref = useRef<HTMLDivElement>(null)
	const isInView = useInView(ref, { once: true, amount: 0.6 })
	const reduceMotion = useReducedMotion()
	const [length, setLength] = useState(0)

	const visible = reduceMotion ? CODE_TEXT.length : length

	useEffect(() => {
		if (!isInView || reduceMotion) return

		const interval = setInterval(() => {
			setLength(prev => {
				if (prev >= CODE_TEXT.length) {
					clearInterval(interval)
					return prev
				}
				return prev + 1
			})
		}, 26)
		return () => clearInterval(interval)
	}, [isInView, reduceMotion])

	const visibleLines = CODE_TEXT.slice(0, visible).split('\n')

	return (
		<div
			ref={ref}
			aria-hidden='true'
			className='overflow-hidden rounded-2xl border border-border bg-background'
		>
			<div className='flex items-center gap-2 border-b border-border px-4 py-3 text-xs text-muted-foreground'>
				<Code2 className='size-3.5' />
				page.tsx
			</div>
			<pre className='overflow-x-auto p-5 font-mono text-[13px] leading-7'>
				{CODE_LINES.map((_, index) => (
					<div key={index} className='flex gap-5'>
						<span className='w-4 shrink-0 select-none text-right text-muted-foreground/50'>
							{index + 1}
						</span>
						<code className='whitespace-pre'>
							<Highlighted line={visibleLines[index] ?? ''} />
							{index === visibleLines.length - 1 && (
								<span className='ml-px inline-block h-[1.1em] w-[2px] translate-y-[3px] animate-pulse bg-brand' />
							)}
						</code>
					</div>
				))}
			</pre>
		</div>
	)
}

const KEYWORDS = /\b(export|default|async|function|const|await|return)\b/
const KEYWORD = /^(export|default|async|function|const|await|return)$/

/** Minimal keyword tinting for the decorative snippet. */
function Highlighted({ line }: { line: string }) {
	const parts = line.split(KEYWORDS)

	return (
		<>
			{parts.map((part, index) =>
				KEYWORD.test(part) ? (
					<span key={index} className='text-brand'>
						{part}
					</span>
				) : (
					<span key={index}>{part}</span>
				)
			)}
		</>
	)
}
