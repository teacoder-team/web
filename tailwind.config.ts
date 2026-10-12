import type { Config } from 'tailwindcss'

const config: Config = {
	darkMode: ['class'],
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}'
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
				display: ['var(--font-display)', 'system-ui', 'sans-serif'],
				serif: ['var(--font-serif)', 'Georgia', 'serif'],
				mono: [
					'ui-monospace',
					'SFMono-Regular',
					'Menlo',
					'Consolas',
					'monospace'
				]
			},
			fontSize: {
				// Fluid display scale for headings (Onest, tight tracking)
				'display-2xl': [
					'clamp(2.5rem, 1.3rem + 3.6vw, 4.5rem)',
					{ lineHeight: '1.04', letterSpacing: '-0.035em' }
				],
				'display-xl': [
					'clamp(2rem, 1.3rem + 2.6vw, 3.5rem)',
					{ lineHeight: '1.08', letterSpacing: '-0.03em' }
				],
				'display-lg': [
					'clamp(1.75rem, 1.3rem + 1.6vw, 2.75rem)',
					{ lineHeight: '1.1', letterSpacing: '-0.03em' }
				],
				'display-md': [
					'clamp(1.375rem, 1.2rem + 0.7vw, 1.875rem)',
					{ lineHeight: '1.2', letterSpacing: '-0.02em' }
				]
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				brand: {
					DEFAULT: 'hsl(var(--brand))',
					soft: 'hsl(var(--brand-soft))'
				},
				highlight: 'hsl(var(--highlight))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
					soft: 'hsl(var(--destructive-soft))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					soft: 'hsl(var(--success-soft))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					soft: 'hsl(var(--warning-soft))'
				},
				inverse: {
					DEFAULT: 'hsl(var(--inverse))',
					foreground: 'hsl(var(--inverse-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				// sm 8 / md 10 / lg 12 / xl 16 / 2xl 20 / 3xl 28 (radius = 12px)
				sm: 'calc(var(--radius) - 4px)',
				md: 'calc(var(--radius) - 2px)',
				lg: 'var(--radius)',
				xl: 'calc(var(--radius) + 4px)',
				'2xl': 'calc(var(--radius) + 8px)',
				'3xl': 'calc(var(--radius) + 16px)'
			},
			boxShadow: {
				// Hairline + soft lift used by cards instead of plain borders
				card: '0 0 0 1px hsl(var(--border) / 0.7), 0 1px 2px hsl(var(--foreground) / 0.04)',
				'card-hover':
					'0 0 0 1px hsl(var(--border)), 0 8px 24px -12px hsl(var(--foreground) / 0.18)',
				popover:
					'0 0 0 1px hsl(var(--border)), 0 16px 40px -16px hsl(var(--foreground) / 0.25)',
				highlight: 'inset 0 1px 0 hsl(0 0% 100% / 0.16)'
			},
			transitionTimingFunction: {
				out: 'cubic-bezier(0.22, 1, 0.36, 1)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'collapsible-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-collapsible-content-height)' }
				},
				'collapsible-up': {
					from: { height: 'var(--radix-collapsible-content-height)' },
					to: { height: '0' }
				},
				'fade-up': {
					from: { opacity: '0', transform: 'translateY(8px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				marquee: {
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(-50%)' }
				},
				steam: {
					'0%, 100%': { transform: 'translateY(0) scaleY(1)' },
					'50%': { transform: 'translateY(-6%) scaleY(1.04)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'collapsible-down': 'collapsible-down 0.2s ease-out',
				'collapsible-up': 'collapsible-up 0.2s ease-out',
				'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
				marquee: 'marquee var(--marquee-duration, 60s) linear infinite',
				steam: 'steam 3.2s ease-in-out infinite'
			}
		}
	},
	plugins: [require('tailwindcss-animate')]
}
export default config
