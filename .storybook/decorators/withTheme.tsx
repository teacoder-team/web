import type { Decorator } from '@storybook/react'

import { ThemeProvider } from '../../src/providers/ThemeProvider'

export const withTheme: Decorator = (Story, context) => {
	return (
		<ThemeProvider>
			<Story {...context} />
		</ThemeProvider>
	)
}
