import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
	title: "UI/Button",
	component: Button,
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["default", "outline", "secondary", "destructive", "ghost"],
		},
		size: {
			control: { type: "select" },
			options: ["sm", "md", "md-plus", "lg", "icon"],
		},
		isLoading: { control: "boolean" },
		disabled: { control: "boolean" },
		children: { control: "text" },
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
	args: {
		children: "Button",
		variant: "default",
		size: "md",
	},
};

export const Variants: Story = {
	render: (args) => (
		<div className="flex flex-wrap gap-4">
			<Button {...args} variant="default">
				Default
			</Button>
			<Button {...args} variant="outline">
				Outline
			</Button>
			<Button {...args} variant="secondary">
				Secondary
			</Button>
			<Button {...args} variant="destructive">
				Destructive
			</Button>
			<Button {...args} variant="ghost">
				Ghost
			</Button>
		</div>
	),
};

export const Sizes: Story = {
	render: (args) => (
		<div className="flex flex-wrap gap-4 items-center">
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
	),
};

export const Loading: Story = {
	render: (args) => (
		<div className="flex gap-4">
			<Button {...args} isLoading>
				Loading...
			</Button>
			<Button {...args} disabled>
				Disabled
			</Button>
		</div>
	),
};

export const AsChild: Story = {
	render: (args) => (
		<Button {...args} asChild>
			<a href="#" className="underline">
				Link Button
			</a>
		</Button>
	),
};
