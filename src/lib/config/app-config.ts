import { cache } from 'react'

import { getRootQuery } from '@/generated/api'

const TIMEOUT_MS = 3000

export const getAppConfig = cache(() =>
	getRootQuery({ timeout: TIMEOUT_MS }).catch(() => null)
)
