import type { Decorator } from '@storybook/react'

import { withTheme } from './withTheme'

export const withProviders: Decorator = (Story, context) => {
	return withTheme(Story, context)
}
