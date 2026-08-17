import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { handleXVerifyRequest } from './server/xVerifyMiddleware.ts'
import { siteXVerifyConfig } from './server/xVerifyConfig.ts'

function xVerifyPlugin(): Plugin {
  const attach = (server: { middlewares: { use: (fn: (req: IncomingMessage, res: ServerResponse, next: () => void) => void) => void } }) => {
    server.middlewares.use((req, res, next) => {
      void handleXVerifyRequest(req, res, siteXVerifyConfig()).then((handled) => {
        if (!handled) next()
      })
    })
  }

  return {
    name: 'x-verify-api',
    configureServer: attach,
    configurePreviewServer: attach,
  }
}

export default defineConfig({
  plugins: [react(), xVerifyPlugin()],
})
