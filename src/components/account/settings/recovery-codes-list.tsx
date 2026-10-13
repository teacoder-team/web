import { splitIntoColumns } from '@/lib/utils'

interface RecoveryCodesListProps {
	codes: string[]
	className: string
}

/** Freshly issued codes in three columns - the API never shows them again. */
export function RecoveryCodesList({
	codes,
	className
}: RecoveryCodesListProps) {
	return (
		<div className={className}>
			{splitIntoColumns(codes).map((column, columnIndex) => (
				<div key={columnIndex} className='flex flex-col'>
					{column.map((code, index) => (
						<p
							key={index}
							className='font-mono text-[15px] font-medium sm:text-[17px]'
						>
							{code}
						</p>
					))}
				</div>
			))}
		</div>
	)
}
