import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { FOLLOW_URL, LIKE_URL, RETWEET_URL } from './src/config/socialTasks.ts'
import { createXVerifyConfig, handleXVerifyRequest } from './server/xVerifyMiddleware.ts'

function xVerifyPlugin(): Plugin {
  const config = createXVerifyConfig({
    followUrl: FOLLOW_URL,
    likeUrl: LIKE_URL,
    retweetUrl: RETWEET_URL,
  })

  const attach = (server: { middlewares: { use: (fn: (req: IncomingMessage, res: ServerResponse, next: () => void) => void) => void } }) => {
    server.middlewares.use((req, res, next) => {
      void handleXVerifyRequest(req, res, config).then((handled) => {
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
