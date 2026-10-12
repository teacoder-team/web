import * as TabsPrimitives from '@radix-ui/react-tabs'
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	createContext,
	forwardRef,
	useContext
} from 'react'

import { cn, focusRing } from '@/src/lib/utils'

const Tabs = (
	props: Omit<
		ComponentPropsWithoutRef<typeof TabsPrimitives.Root>,
		'orientation'
	>
) => {
	return <TabsPrimitives.Root tremor-id='tremor-raw' {...props} />
}

Tabs.displayName = 'Tabs'

type TabsListVariant = 'line' | 'solid'

const TabsListVariantContext = createContext<TabsListVariant>('line')

interface TabsListProps
	extends ComponentPropsWithoutRef<typeof TabsPrimitives.List> {
	variant?: TabsListVariant
}

const variantStyles: Record<TabsListVariant, string> = {
	line: cn('flex items-center justify-start border-b border-border'),
	solid: cn(
		'inline-flex items-center justify-center rounded-full p-1 bg-secondary'
	)
}

const TabsList = forwardRef<
	ComponentRef<typeof TabsPrimitives.List>,
	TabsListProps
>(({ className, variant = 'line', children, ...props }, forwardedRef) => (
	<TabsPrimitives.List
		ref={forwardedRef}
		className={cn(variantStyles[variant], className)}
		{...props}
	>
		<TabsListVariantContext.Provider value={variant}>
			{children}
		</TabsListVariantContext.Provider>
	</TabsPrimitives.List>
))

TabsList.displayName = 'TabsList'

function getVariantStyles(tabVariant: TabsListVariant) {
	switch (tabVariant) {
		case 'line':
			return '-mb-px items-center justify-center whitespace-nowrap border-b-2 border-transparent px-3 pb-2.5 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
		case 'solid':
			return 'inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-card data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
	}
}

const TabsTrigger = forwardRef<
	ComponentRef<typeof TabsPrimitives.Trigger>,
	ComponentPropsWithoutRef<typeof TabsPrimitives.Trigger>
>(({ className, children, ...props }, forwardedRef) => {
	const variant = useContext(TabsListVariantContext)
	return (
		<TabsPrimitives.Trigger
			ref={forwardedRef}
			className={cn(getVariantStyles(variant), focusRing, className)}
			{...props}
		>
			{children}
		</TabsPrimitives.Trigger>
	)
})

TabsTrigger.displayName = 'TabsTrigger'

const TabsContent = forwardRef<
	ComponentRef<typeof TabsPrimitives.Content>,
	ComponentPropsWithoutRef<typeof TabsPrimitives.Content>
>(({ className, ...props }, forwardedRef) => (
	<TabsPrimitives.Content
		ref={forwardedRef}
		className={cn('outline-none', focusRing, className)}
		{...props}
	/>
))

TabsContent.displayName = 'TabsContent'

export { Tabs, TabsContent, TabsList, TabsTrigger }
