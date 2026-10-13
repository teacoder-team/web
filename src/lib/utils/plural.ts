export type PluralForms = readonly [one: string, few: string, many: string]

const rules = new Intl.PluralRules('ru-RU')

export function plural(count: number, forms: PluralForms): string {
	switch (rules.select(count)) {
		case 'one':
			return forms[0]
		case 'few':
			return forms[1]
		default:
			return forms[2]
	}
}

export function pluralize(count: number, forms: PluralForms): string {
	return `${count} ${plural(count, forms)}`
}

export const COURSE: PluralForms = ['курс', 'курса', 'курсов']
export const LESSON: PluralForms = ['урок', 'урока', 'уроков']
export const SECTION: PluralForms = ['раздел', 'раздела', 'разделов']
export const DAY: PluralForms = ['день', 'дня', 'дней']
export const MONTH: PluralForms = ['месяц', 'месяца', 'месяцев']
