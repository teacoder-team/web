import { CheckCircle2 } from 'lucide-react'

import { Button } from '../ui/Button/Button'
import { Card } from '../ui/Card/Card'

export function CTA() {
	return (
		<section className="px-6 py-32">
			<div className="mx-auto max-w-5xl">
				<div className="bg-primary relative overflow-hidden rounded-[40px] p-8 md:p-16">
					<div className="absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
					<div className="relative z-10 flex flex-col items-center gap-12 md:flex-row">
						<div className="flex-1 text-center md:text-left">
							<h2 className="text-primary-foreground mb-6 text-4xl leading-tight font-bold md:text-6xl">
								Unlock everything with Premium.
							</h2>
							<p className="text-primary-foreground/80 mb-8 text-xl leading-relaxed">
								Get full source code access, advanced distributed systems tracks,
								and private cohort support.
							</p>
							<div className="flex flex-wrap justify-center gap-4 md:justify-start">
								<div className="text-primary-foreground flex items-center gap-2 font-medium">
									<CheckCircle2 className="h-5 w-5" /> All Source Code
								</div>
								<div className="text-primary-foreground flex items-center gap-2 font-medium">
									<CheckCircle2 className="h-5 w-5" /> Advanced Tracks
								</div>
								<div className="text-primary-foreground flex items-center gap-2 font-medium">
									<CheckCircle2 className="h-5 w-5" /> Private MessageSquareDiff
								</div>
							</div>
						</div>
						<div className="w-full shrink-0 md:w-auto">
							<Card className="rounded-4xl bg-white p-8 text-center shadow-2xl">
								<div className="mb-2 text-4xl font-bold text-black">449₽</div>
								<div className="text-muted-foreground mb-8 text-sm font-medium">
									per month
								</div>
								<Button
									size="lg"
									className="h-14 w-full rounded-full bg-black text-lg text-white hover:bg-black/90"
								>
									Go Premium
								</Button>
								<p className="text-muted-foreground mt-4 text-[10px] font-bold tracking-widest uppercase">
									Secure checkout with Stripe
								</p>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
