export function formatPrice(amount: number, currency: string) {
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency,
		maximumFractionDigits: 0
	}).format(amount)
}
