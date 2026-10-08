'use client'

import Script from 'next/script'

import { env } from '@/lib/config/env'
import { useConsent } from '@/lib/consent/consent-provider'

export function YandexMetrikaScript() {
	const id = env.YANDEX_METRIKA_ID
	const { consent } = useConsent()

	if (!id || !consent?.analytics) return null

	return (
		<>
			<Script id='yandex-metrika' strategy='afterInteractive'>
				{`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {
            if (document.scripts[j].src === r) { return; }
          }
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],
          k.async=1,k.src=r,a.parentNode.insertBefore(k,a)}
          )(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          ym(${id}, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true
          });
        `}
			</Script>

			<noscript>
				<div>
					<img
						src={`https://mc.yandex.ru/watch/${id}`}
						style={{ position: 'absolute', left: '-9999px' }}
					/>
				</div>
			</noscript>
		</>
	)
}
