export function splitIntoColumns(
	codes: string[]
): [string[], string[], string[]] {
	const size = Math.ceil(codes.length / 3)

	return [
		codes.slice(0, size),
		codes.slice(size, size * 2),
		codes.slice(size * 2)
	]
}

export function downloadRecoveryCodes(codes: string[]) {
	const blob = new Blob([codes.join('\n')], { type: 'text/plain' })
	const fileURL = window.URL.createObjectURL(blob)
	const link = document.createElement('a')

	link.href = fileURL
	link.setAttribute('download', 'teacoder_recovery_codes.txt')

	document.body.appendChild(link)
	link.click()
	link.remove()

	setTimeout(() => window.URL.revokeObjectURL(fileURL), 0)
}
