import type { Meta, StoryObj } from '@storybook/react'

import { Button } from './Button'

const meta = {
	title: 'UI/Button',
	component: Button,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: { type: 'select' },
			options: ['default', 'outline', 'secondary', 'destructive', 'ghost']
		},
		size: {
			control: { type: 'select' },
			options: ['sm', 'md', 'md-plus', 'lg', 'icon']
		},
		isLoading: { control: 'boolean' },
		disabled: { control: 'boolean' },
		children: { control: 'text' }
	}
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
	args: {
		children: 'Button',
		variant: 'default',
		size: 'md'
	}
}

export const Outline: Story = {
	args: {
		children: 'Outline',
		variant: 'outline',
		size: 'md'
	}
}

export const Secondary: Story = {
	args: {
		children: 'Secondary',
		variant: 'secondary',
		size: 'md'
	}
}

export const Destructive: Story = {
	args: {
		children: 'Destructive',
		variant: 'destructive',
		size: 'md'
	}
}

export const Ghost: Story = {
	args: {
		children: 'Ghost',
		variant: 'ghost',
		size: 'md'
	}
}

export const Sizes: Story = {
	render: args => (
		<div className="flex flex-wrap items-center gap-4">
			<Button {...args} size="sm">
				SM
			</Button>
			<Button {...args} size="md">
				MD
			</Button>
			<Button {...args} size="md-plus">
				MD+
			</Button>
			<Button {...args} size="lg">
				LG
			</Button>
			<Button {...args} size="icon">
				Icon
			</Button>
		</div>
	)
}

export const Loading: Story = {
	render: args => (
		<div className="flex gap-4">
			<Button {...args} isLoading>
				Loading...
			</Button>
			<Button {...args} disabled>
				Disabled
			</Button>
		</div>
	)
}

export const AsChild: Story = {
	render: args => (
		<Button {...args} asChild>
			<a href="#" className="underline">
				Link Button
			</a>
		</Button>
	)
}
