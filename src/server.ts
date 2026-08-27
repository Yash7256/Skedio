import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import type { Register } from '@tanstack/react-router'
import type { RequestHandler } from '@tanstack/react-start/server'
import { consumeLastCapturedError, describeError } from './lib/error-capture'
import { renderErrorPage } from './lib/error-page'

const handle = createStartHandler(defaultStreamHandler)

// SSR error wrapper: h3 swallows unhandled throws into a generic 500 Response,
// stripping the stack before it reaches the log pipeline. error-capture patches
// console.error to record + expand the original error out-of-band; here we
// recover it, log the full detail, and serve the friendly error page instead of
// an empty 500.
const fetch: RequestHandler<Register> = async (request) => {
  try {
    const response = await handle(request)
    if (response.status < 500) return response
    const captured = consumeLastCapturedError()
    if (captured === undefined) return response
    console.error(describeError(captured))
    return new Response(renderErrorPage(), {
      status: response.status,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    })
  } catch (error) {
    console.error(error)
    const captured = consumeLastCapturedError() ?? error
    console.error(describeError(captured))
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    })
  }
}

export type ServerEntry = { fetch: RequestHandler<Register> }

export function createServerEntry(entry: ServerEntry): ServerEntry {
  return {
    async fetch(...args) {
      return await entry.fetch(...args)
    },
  }
}

export default createServerEntry({ fetch })
