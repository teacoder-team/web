'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

import { Button } from '../ui/Button/Button'

export function Hero() {
	return (
		<section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-14">
			<div className="mx-auto max-w-7xl text-center">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
					className="bg-primary/5 text-primary mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium"
				>
					<Sparkles className="h-4 w-4" />
					<span>Платформа для изучения веб-разработки</span>
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="mb-8 text-5xl leading-[1.06] font-medium tracking-tight text-balance md:text-[85px]"
				>
					Изучай веб-разработку <br />
					<span className="text-primary">с TeaCoder.</span>
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="text-muted-foreground mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-balance"
				>
					Образовательная платформа по веб разработке с упором на практику. Получи доступ
					к курсам, которые помогут развить навыки и разобраться в реальных примерах
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="flex flex-col items-center justify-center gap-4 sm:flex-row"
				>
					<Button size="lg" className="group h-12 rounded-full px-7 text-base text-white">
						Начать бесплатно{' '}
						<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
					</Button>
					{/* <Button
							size="lg"
							variant="outline"
							className="h-14 px-8 rounded-full text-lg font-medium border-white/10 hover:bg-white/5"
						>
							Github
						</Button> */}
				</motion.div>
			</div>
		</section>
	)
}
