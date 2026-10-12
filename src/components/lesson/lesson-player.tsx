'use client'

import { Loader2, VideoOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface LessonPlayerProps {
	videoId: string | null
}

export function LessonPlayer({ videoId }: LessonPlayerProps) {
	const [isInView, setIsInView] = useState(false)
	const [isLoaded, setIsLoaded] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!containerRef.current) return

		const observer = new IntersectionObserver(
			entries => {
				if (entries.some(entry => entry.isIntersecting)) {
					setIsInView(true)
					observer.disconnect()
				}
			},
			{ threshold: 0.3 }
		)

		observer.observe(containerRef.current)
		return () => observer.disconnect()
	}, [])

	return (
		<div
			ref={containerRef}
			className='relative aspect-video w-full overflow-hidden rounded-2xl bg-inverse text-inverse-foreground ring-1 ring-border'
		>
			{!videoId ? (
				<div className='absolute inset-0 flex flex-col items-center justify-center gap-3 text-inverse-foreground/60'>
					<VideoOff className='size-7' />
					<p className='text-sm'>Видео для этого урока пока нет</p>
				</div>
			) : (
				<>
					{!isLoaded && (
						<div className='absolute inset-0 flex flex-col items-center justify-center gap-3 text-inverse-foreground/60'>
							<Loader2 className='size-6 animate-spin' />
							<p className='text-sm'>Загрузка видео…</p>
						</div>
					)}
					{isInView && (
						<iframe
							title='Видео урока'
							className='absolute inset-0 h-full w-full'
							src={`https://kinescope.io/embed/${videoId}`}
							allow='fullscreen; picture-in-picture; encrypted-media'
							allowFullScreen
							onLoad={() => setIsLoaded(true)}
						/>
					)}
				</>
			)}
		</div>
	)
}
