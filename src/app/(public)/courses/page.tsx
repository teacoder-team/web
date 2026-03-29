export const revalidate = 60

async function getCourses() {
	const res = await fetch('http://localhost:3000/api/courses', {
		next: { revalidate: 60 }
	})

	if (!res.ok) {
		throw new Error(`Failed to fetch courses: ${res.status}`)
	}

	return res.json()
}

export default async function CoursesPage() {
	const courses = await getCourses()

	return JSON.stringify(courses)
}
