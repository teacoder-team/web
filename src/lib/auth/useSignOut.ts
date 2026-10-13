'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { usePostAuthLogoutMutation } from '@/generated/api'

import { getErrorMessage } from '@/lib/api/errors'
import { ROUTES } from '@/lib/routes'

import { setAccessToken } from './token'

export function useSignOut(onSignedOut?: () => void) {
	const router = useRouter()

	return usePostAuthLogoutMutation({
		mutation: {
			onSuccess() {
				setAccessToken(null)
				onSignedOut?.()
				router.push(ROUTES.AUTH.LOGIN())
			},
			onError(error) {
				toast.error(getErrorMessage(error, 'Ошибка при выходе'))
			}
		}
	})
}
