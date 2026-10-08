import { config } from 'dotenv'
import { defineConfig } from 'orval'

config({ path: '.env' })

const input = process.env.OPENAPI_URL || 'http://localhost:8000/spec.json'

function toPascalCase(value: string) {
	return value
		.split(/[^a-zA-Z0-9]+/)
		.filter(Boolean)
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join('')
}

function operationName(_operation: unknown, route: string, verb: string) {
	const path = route
		.split('/')
		.filter(Boolean)
		.map(segment => {
			const param = segment.match(/^\$?\{(.+)\}$/)

			return param ? `By${toPascalCase(param[1])}` : toPascalCase(segment)
		})
		.join('')

	const suffix = verb === 'get' ? 'Query' : 'Mutation'

	return `${verb}${path || 'Root'}${suffix}`
}

export default defineConfig({
	api: {
		input: {
			target: input,
			override: {
				transformer: spec => ({ ...spec, openapi: '3.1.0' })
			},
			filters: {
				mode: 'exclude',
				tags: ['Вебхуки']
			}
		},
		output: {
			mode: 'split',
			target: './generated/api.ts',
			schemas: './generated/model',
			client: 'react-query',
			httpClient: 'axios',
			clean: true,
			override: {
				mutator: {
					path: './src/lib/api/client.ts',
					name: 'apiClient'
				},
				operationName
			}
		}
	}
})
