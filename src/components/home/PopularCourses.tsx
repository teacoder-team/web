import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import { Button } from '../ui/Button/Button'

export function PopularCourses() {
	return (
		<section className="px-6 py-24">
			<div className="mx-auto max-w-7xl">
				<div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
					<div>
						<h2 className="mb-4 text-4xl font-bold md:text-5xl">Popular Tracks</h2>
						<p className="text-muted-foreground text-xl">
							Deep dives into modern engineering stacks.
						</p>
					</div>
					<Button
						variant="ghost"
						className="text-primary hover:bg-primary/5 hover:text-primary flex h-auto gap-2 p-0 text-lg"
					>
						Browse all courses <ArrowRight className="h-5 w-5" />
					</Button>
				</div>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
					{[
						{
							title: 'Distributed Systems in Go',
							desc: 'Learn to build resilient, scalable backends with gRPC, Raft, and distributed tracing.',
							level: 'Advanced',
							lessons: 24,
							gradient: 'from-blue-500/20 to-cyan-500/20'
						},
						{
							title: 'High-Performance Rust',
							desc: 'Master memory safety, concurrency, and zero-cost abstractions for systems programming.',
							level: 'Intermediate',
							lessons: 18,
							gradient: 'from-orange-500/20 to-red-500/20'
						}
					].map((course, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							className="group bg-card relative overflow-hidden rounded-3xl border border-white/5 transition-all duration-500 hover:border-white/10"
						>
							<div
								className={`absolute inset-0 bg-linear-to-br ${course.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
							/>
							<div className="relative p-8 md:p-12">
								<div className="mb-6 flex items-center gap-3">
									<span className="text-muted-foreground rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wider uppercase">
										{course.level}
									</span>
									<span className="text-muted-foreground/60 text-xs font-medium">
										{course.lessons} Lessons
									</span>
								</div>
								<h3 className="group-hover:text-primary mb-4 text-3xl font-bold transition-colors">
									{course.title}
								</h3>
								<p className="text-muted-foreground mb-8 text-lg leading-relaxed">
									{course.desc}
								</p>
								<Button
									variant="outline"
									className="group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground rounded-full border-white/10 transition-all"
								>
									Start Learning
								</Button>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
