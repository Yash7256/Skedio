import { useEffect, type ReactNode } from 'react'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import appCss from '../styles.css?url'
import { Footer } from '../components/Footer'
import { smoothScroll } from '../lib/smooth-scroll'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Skedio' },
    ],
    links: [
      { rel: 'icon', type: 'image/png', href: '/skedio-logomark.png' },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  useEffect(() => {
    smoothScroll.init()
    return () => smoothScroll.destroy()
  }, [])

  return (
    <RootDocument>
      <Outlet />
      {!pathname.startsWith('/projects') && <Footer />}
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
