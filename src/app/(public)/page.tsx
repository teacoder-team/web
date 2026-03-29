'use client'

import { CTA } from '@/components/home/CTA'
import { Features } from '@/components/home/Features'
import { Hero } from '@/components/home/Hero'
import { PopularCourses } from '@/components/home/PopularCourses'

export default function Home() {
	return (
		<>
			<Hero />
			<Features />
			<PopularCourses />
			<CTA />
		</>
	)
}
