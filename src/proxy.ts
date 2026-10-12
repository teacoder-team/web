import { type NextRequest, NextResponse } from 'next/server'

import { SESSION_MARKER } from '@/lib/auth/marker'

export default function proxy(request: NextRequest) {
	const { pathname, search } = request.nextUrl

	const hasSession = request.cookies.has(SESSION_MARKER)

	if (
		pathname.startsWith('/auth/callback/') ||
		pathname.startsWith('/auth/verify/')
	) {
		return NextResponse.next()
	}

	// Robokassa returns here with a cross-site POST, which carries no Lax cookies.
	// The route only forwards to /payment/:id, where the session is checked.
	if (pathname === '/payment/success') {
		return NextResponse.next()
	}

	if (pathname.startsWith('/auth')) {
		return hasSession
			? NextResponse.redirect(new URL('/account', request.url))
			: NextResponse.next()
	}

	if (!hasSession) {
		const login = new URL('/auth/login', request.url)

		login.searchParams.set('redirectTo', `${pathname}${search}`)

		return NextResponse.redirect(login)
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		'/auth/:path*',
		'/account/:path*',
		'/lesson/:path*',
		'/payment/:path*'
	]
}
