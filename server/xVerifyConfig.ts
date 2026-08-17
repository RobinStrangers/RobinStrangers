import { FOLLOW_URL, LIKE_URL, RETWEET_URL } from '../src/config/socialTasks.ts'
import type { XVerifyConfig } from '../supabase/functions/_shared/xTaskVerifier.ts'
import { createXVerifyConfig } from './xVerifyMiddleware.ts'

export function siteXVerifyConfig(): XVerifyConfig {
  return createXVerifyConfig({
    followUrl: FOLLOW_URL,
    likeUrl: LIKE_URL,
    retweetUrl: RETWEET_URL,
  })
}
