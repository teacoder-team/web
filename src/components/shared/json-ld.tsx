import type { Schema } from '@/lib/seo/schema'

interface JsonLdProps {
	schema: Schema | Schema[]
}

export function JsonLd({ schema }: JsonLdProps) {
	const graph = Array.isArray(schema) ? schema : [schema]

	return (
		<script
			type='application/ld+json'
			// JSON-LD is data, not markup: escaping `<` keeps it away from the HTML parser
			dangerouslySetInnerHTML={{
				__html: JSON.stringify({
					'@context': 'https://schema.org',
					'@graph': graph
				}).replace(/</g, '\u003c')
			}}
		/>
	)
}
