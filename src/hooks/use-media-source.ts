'use client'

import { useCallback } from 'react'

import { useAppConfig } from '@/lib/config/use-app-config'
import { getMediaSource } from '@/lib/utils'

/** `getMediaSource` with the storage address from `GET /`. */
export function useMediaSource() {
	const { data } = useAppConfig()

	const storageUrl = data?.features.orion.url

	return useCallback(
		(
			path: string | null | undefined,
			tag: Parameters<typeof getMediaSource>[1]
		) =>
			// A bare file id is not a usable src until the storage URL arrives
			storageUrl || path?.startsWith('https://')
				? getMediaSource(path, tag, storageUrl)
				: '',
		[storageUrl]
	)
}
