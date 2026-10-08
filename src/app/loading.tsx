import { EllipsisLoader } from '@/components/shared/ellipsis-loader'

export default function LoadingPage() {
	return (
		<div className='flex min-h-screen items-center justify-center'>
			<EllipsisLoader />
		</div>
	)
}
