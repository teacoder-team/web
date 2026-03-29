import { motion } from 'framer-motion'
import { Code2, Cpu, Trophy } from 'lucide-react'

export function Features() {
	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 }
	}

	return (
		<section className="px-6 py-24">
			<div className="mx-auto max-w-7xl">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					<motion.div
						variants={itemVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
					>
						<div className="claude-card h-full">
							<div className="bg-primary/10 mb-6 flex h-12 w-12 items-center justify-center rounded-xl">
								<Code2 className="text-primary h-6 w-6" />
							</div>
							<h3 className="mb-4 text-2xl font-semibold">Production-Ready Code</h3>
							<p className="text-muted-foreground leading-relaxed">
								Every lesson comes with a fully-functional, documented repository.
								Clone, study, and deploy.
							</p>
						</div>
					</motion.div>

					<motion.div
						variants={itemVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
					>
						<div className="claude-card h-full">
							<div className="bg-primary/10 mb-6 flex h-12 w-12 items-center justify-center rounded-xl">
								<Cpu className="text-primary h-6 w-6" />
							</div>
							<h3 className="mb-4 text-2xl font-semibold">Systems Architecture</h3>
							<p className="text-muted-foreground leading-relaxed">
								Go beyond syntax. Learn how to build distributed systems,
								microservices, and high-scale backends.
							</p>
						</div>
					</motion.div>

					<motion.div
						variants={itemVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}
					>
						<div className="claude-card h-full">
							<div className="bg-primary/10 mb-6 flex h-12 w-12 items-center justify-center rounded-xl">
								<Trophy className="text-primary h-6 w-6" />
							</div>
							<h3 className="mb-4 text-2xl font-semibold">Proof of Mastery</h3>
							<p className="text-muted-foreground leading-relaxed">
								Earn points and climb the global leaderboard. Build your technical
								prestige in a community of experts.
							</p>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	)
}
