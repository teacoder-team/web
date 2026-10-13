export function formatPrice(amount: number, currency: string) {
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency,
		maximumFractionDigits: 0
	}).format(amount)
}

/** `price` is the full price; `discountPrice` is what is charged while a discount lasts. */
export function getPayablePrice(
	price: number | null,
	discountPrice: number | null
): number | null {
	if (price === null) return null

	return discountPrice !== null && discountPrice > 0 && discountPrice < price
		? discountPrice
		: price
}

/** Discount in whole percent, or `null` when there is no discount. */
export function getDiscountPercent(
	price: number | null,
	discountPrice: number | null
): number | null {
	const payable = getPayablePrice(price, discountPrice)

	if (price === null || payable === null || payable >= price) return null

	return Math.round((1 - payable / price) * 100)
}
