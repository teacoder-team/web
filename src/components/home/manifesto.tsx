'use client'

import {
	type MotionValue,
	motion,
	useReducedMotion,
	useScroll,
	useTransform
} from 'framer-motion'
import { useRef } from 'react'

import { cn } from '@/lib/utils'

const SEGMENTS: { text: string; accent?: boolean }[] = [
	{ text: 'TeaCoder', accent: true },
	{ text: '- платформа для изучения' },
	{ text: 'веб-разработки', accent: true },
	{ text: 'с гибким подходом. Курсы помогают' },
	{ text: 'развить навыки', accent: true },
	{ text: 'и разобраться в' },
	{ text: 'реальных примерах', accent: true },
	{ text: '- в удобном для тебя' },
	{ text: 'ритме.', accent: true }
]

const WORDS = SEGMENTS.flatMap(segment =>
	segment.text.split(' ').map(word => ({ word, accent: !!segment.accent }))
)

export function Manifesto() {
	const ref = useRef<HTMLParagraphElement>(null)
	const reduceMotion = useReducedMotion()

	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start 0.85', 'end 0.45']
	})

	return (
		<section className='page-container py-24 sm:py-36'>
			<p
				ref={ref}
				className='max-w-5xl font-display text-[clamp(1.75rem,1.1rem+2.4vw,3.25rem)] font-medium leading-[1.18] tracking-[-0.03em]'
			>
				{WORDS.map(({ word, accent }, index) => (
					<Word
						key={index}
						progress={scrollYProgress}
						range={[
							index / WORDS.length,
							(index + 1) / WORDS.length
						]}
						isStatic={!!reduceMotion}
						className={cn(accent && 'text-brand')}
					>
						{word}
					</Word>
				))}
			</p>
		</section>
	)
}

interface WordProps {
	children: string
	progress: MotionValue<number>
	range: [number, number]
	isStatic: boolean
	className?: string
}

function Word({ children, progress, range, isStatic, className }: WordProps) {
	const opacity = useTransform(progress, range, [0.16, 1])

	return (
		<>
			<motion.span
				style={isStatic ? undefined : { opacity }}
				className={className}
			>
				{children}
			</motion.span>{' '}
		</>
	)
}
