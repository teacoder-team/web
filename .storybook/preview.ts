import type { Preview } from '@storybook/nextjs-vite'

import '../src/assets/styles/globals.css'

import { withProviders } from './decorators/withProviders'

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},
		a11y: {
			test: 'todo'
		}
	},
	decorators: [withProviders]
}

export default preview
