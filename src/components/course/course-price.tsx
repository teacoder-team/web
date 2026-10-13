import {
	cn,
	formatPrice,
	getDiscountPercent,
	getPayablePrice
} from '@/lib/utils'

interface CoursePriceProps {
	price: number | null
	discountPrice: number | null
	currency: string | undefined
	className?: string
	priceClassName?: string
}

/** Payable price; while a discount lasts the full price is struck through. */
export function CoursePrice({
	price,
	discountPrice,
	currency,
	className,
	priceClassName
}: CoursePriceProps) {
	const payable = getPayablePrice(price, discountPrice)

	if (price === null || payable === null || !currency) return null

	const discount = getDiscountPercent(price, discountPrice)

	return (
		<span
			className={cn(
				'inline-flex flex-wrap items-baseline gap-x-2.5 gap-y-1',
				className
			)}
		>
			<span className={cn('tabular-nums', priceClassName)}>
				{formatPrice(payable, currency)}
			</span>
			{discount !== null && (
				<>
					<s className='text-[0.6em] font-normal text-muted-foreground tabular-nums decoration-muted-foreground/60'>
						{formatPrice(price, currency)}
					</s>
					<span className='rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success'>
						−{discount}%
					</span>
				</>
			)}
		</span>
	)
}
