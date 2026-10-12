interface HeadingProps {
	title: string
	description: string
}

export function Heading({ title, description }: HeadingProps) {
	return (
		<div className='space-y-1.5'>
			<h1 className='font-display text-display-md font-medium'>
				{title}
			</h1>
			<p className='text-sm text-muted-foreground'>{description}</p>
		</div>
	)
}
