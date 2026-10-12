'use client'

import { type HTMLMotionProps, motion, useReducedMotion } from 'framer-motion'

interface RevealProps extends HTMLMotionProps<'div'> {
	delay?: number
	y?: number
}

/**
 * Fades content in once when it enters the viewport. Runs a single time per
 * mount so sections don't re-animate on every scroll.
 */
export function Reveal({ delay = 0, y = 24, children, ...props }: RevealProps) {
	const reduceMotion = useReducedMotion()

	return (
		<motion.div
			initial={reduceMotion ? false : { opacity: 0, y }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: '0px 0px -12% 0px' }}
			transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
			{...props}
		>
			{children}
		</motion.div>
	)
}
