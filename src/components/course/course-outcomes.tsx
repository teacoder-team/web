import { Check } from 'lucide-react'

interface CourseOutcomesProps {
	outcomes: string[]
}

export function CourseOutcomes({ outcomes }: CourseOutcomesProps) {
	if (outcomes.length === 0) return null

	return (
		<section className='mt-12'>
			<h2 className='font-display text-display-md font-medium'>
				Чему вы научитесь
			</h2>
			<ul className='mt-6 grid gap-x-8 gap-y-5 rounded-3xl border border-border bg-card p-6 sm:grid-cols-2 sm:p-8'>
				{outcomes.map((outcome, index) => (
					<li key={index} className='flex items-start gap-3'>
						<span className='mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand'>
							<Check className='size-3.5' strokeWidth={2.5} />
						</span>
						<span className='text-[15px] leading-relaxed'>
							{outcome}
						</span>
					</li>
				))}
			</ul>
		</section>
	)
}
