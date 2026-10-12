import { type NextRequest, NextResponse } from 'next/server'

import { ROUTES } from '@/constants/routes'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Robokassa's success URL is set in its dashboard, not per payment, so it still
 * lands here. It echoes our payment id back as `Shp_paymentId` (GET or POST,
 * depending on the dashboard setting) - forward to the live status page.
 */
async function readPaymentId(request: NextRequest) {
	const fromQuery = request.nextUrl.searchParams.get('Shp_paymentId')

	if (fromQuery || request.method !== 'POST') {
		return fromQuery
	}

	const form = await request.formData().catch(() => null)
	const value = form?.get('Shp_paymentId')

	return typeof value === 'string' ? value : null
}

async function redirectToPayment(request: NextRequest) {
	const paymentId = await readPaymentId(request)
	const target =
		paymentId && UUID.test(paymentId)
			? `/payment/${paymentId}`
			: ROUTES.ACCOUNT.SUBSCRIPTION

	return NextResponse.redirect(new URL(target, request.url), 303)
}

export const GET = redirectToPayment
export const POST = redirectToPayment
