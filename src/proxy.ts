import { type NextRequest, NextResponse } from 'next/server'

import { SESSION_MARKER } from '@/lib/auth/marker'

/**
 * UX redirects only. The marker is a hint - the real check is the refresh on the
 * client, which drops the marker if the session is gone.
 */
export default function proxy(request: NextRequest) {
	const { pathname, search } = request.nextUrl

	const hasSession = request.cookies.has(SESSION_MARKER)

	// Providers return here after linking from settings, when the user is signed in.
	if (pathname.startsWith('/auth/callback/')) {
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
	matcher: ['/auth/:path*', '/account/:path*', '/lesson/:path*']
}
