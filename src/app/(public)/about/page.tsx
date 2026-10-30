import type { Metadata } from 'next'

import { JsonLd } from '@/components/shared/json-ld'

import { ROUTES } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo'
import { breadcrumbSchema, personSchema } from '@/lib/seo/schema'

export const metadata: Metadata = pageMetadata({
	title: 'Об основателе',
	description:
		'Вадим - основатель TeaCoder и автор курсов по веб-разработке: путь от первых сайтов в 11 лет до собственной платформы и YouTube-канала.',
	path: ROUTES.ABOUT,
	openGraphType: 'profile'
})

export default function AboutPage() {
	return (
		<main className='mx-auto my-20 max-w-4xl'>
			<JsonLd
				schema={[
					personSchema(),
					breadcrumbSchema([
						{ name: 'Главная', path: ROUTES.HOME },
						{ name: 'Об основателе', path: ROUTES.ABOUT }
					])
				]}
			/>
			<div className='mx-auto max-w-7xl px-4 lg:px-8'>
				<section className='mx-auto'>
					<h1 className='text-center text-4xl font-semibold tracking-tight sm:text-5xl'>
						Об основателе
					</h1>
					<div className='mt-6 space-y-4 leading-7 text-foreground sm:leading-8'>
						<p>
							Меня зовут Вадим, и я - веб-разработчик. В свои 16
							лет я уже успел создать свою образовательную
							платформу{' '}
							<span className='text-blue-600'>TeaCoder</span> и
							запустить YouTube-канал, где публикую видеоуроки по
							веб-разработке.
						</p>
						<p>
							Моя история началась в 11 лет, когда мой папа
							записал меня на офлайн-курсы по созданию сайтов.
							Честно говоря, с первого урока мне не очень
							понравилось, и я не был уверен, что это то, чем я
							хочу заниматься. Однако я решил продолжить, и
							продолжил ходить на эти курсы. Мы начали с простого
							конструктора сайтов Tilda, а затем я освоил основы
							HTML и CSS. Этот путь длился целый год.
						</p>
						<p>
							В 12 лет я продолжил обучаться на курсах по Python.
							Несмотря на то, что это был мой первый язык
							программирования и было довольно тяжело, я понял,
							насколько увлекательным может быть процесс создания
							программ. После этого я начал изучать JavaScript и
							PHP. В то время я был еще новичком, но это не
							остановило меня - я продолжил изучать и углублять
							свои знания самостоятельно, создавая проекты и решая
							задачи.
						</p>
						<p>
							Вскоре мне стало интересно работать с фреймворками,
							и я освоил React JS. Это позволило мне расширить
							горизонты и начать создавать более сложные и
							динамичные приложения.
						</p>
						<p>
							Сегодня я рад поделиться своими знаниями и опытом с
							другими. Моя платформа{' '}
							<span className='text-blue-600'>TeaCoder</span>{' '}
							помогает начинающим веб-разработчикам погрузиться в
							мир программирования и создать свои первые проекты.
						</p>
						<p>
							Каждый день я стремлюсь учиться и открывать для себя
							что-то новое в мире технологий, и мне очень нравится
							то, чем я занимаюсь. Надеюсь, мой опыт вдохновит вас
							на создание собственных проектов и карьеру в
							веб-разработке!
						</p>
					</div>
				</section>
			</div>
		</main>
	)
}
