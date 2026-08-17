export type TaskId = 'follow' | 'like' | 'retweet'
export type VerifyTaskId = TaskId | 'all'

export type XVerifyConfig = {
  followUrl: string
  likeUrl: string
  retweetUrl: string
  officialBearer?: string
}

export type XVerifyTarget = {
  handle: string
  tweetId?: string
  tweetUrl?: string
  followUrl: string
  likeUrl: string
  retweetUrl: string
}

export type XVerifyResult = {
  ok: boolean
  verified: boolean
  error?: string
  target?: XVerifyTarget
}

export type XVerifyRequest = {
  username: string
  taskId: VerifyTaskId
}

const GUEST_BEARER =
  'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs=1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA'

const USER_BY_SCREEN = 'IGgvgiOx4QZndDHuD3x9TQ'
const USER_TWEETS = '36rb3Xj3iJ64Q-9wKDjCcQ'
const TWEET_BY_ID = 'tCVRZ3WCvoj0BVO7BKnL-Q'
const FAVORITERS_IDS = ['yObihOW0q78g0PONS3QWVw', 'SPOr3rvo2j1E8bFd-qGczQ']
const RETWEETERS_IDS = ['ROjiuYueotTnWoI8m2YaiQ', 'TZsWuSj7vGmncVnq7KWDUQ']

const USER_FEATURES = {
  hidden_profile_subscriptions_enabled: true,
  profile_label_improvements_pcf_label_in_post_enabled: true,
  responsive_web_profile_redirect_enabled: false,
  rweb_tipjar_consumption_enabled: false,
  verified_phone_label_enabled: false,
  subscriptions_verification_info_is_identity_verified_enabled: true,
  subscriptions_verification_info_verified_since_enabled: true,
  highlights_tweets_tab_ui_enabled: true,
  responsive_web_twitter_article_notes_tab_enabled: true,
  subscriptions_feature_can_gift_premium: true,
  creator_subscriptions_tweet_preview_api_enabled: true,
  responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
  responsive_web_graphql_timeline_navigation_enabled: true,
}

const TIMELINE_FEATURES = {
  rweb_video_screen_enabled: false,
  rweb_cashtags_enabled: true,
  profile_label_improvements_pcf_label_in_post_enabled: true,
  responsive_web_profile_redirect_enabled: false,
  rweb_tipjar_consumption_enabled: false,
  verified_phone_label_enabled: false,
  creator_subscriptions_tweet_preview_api_enabled: true,
  responsive_web_graphql_timeline_navigation_enabled: true,
  responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
  premium_content_api_read_enabled: false,
  communities_web_enable_tweet_community_results_fetch: true,
  c9s_tweet_anatomy_moderator_badge_enabled: true,
  responsive_web_grok_analyze_button_fetch_trends_enabled: false,
  responsive_web_grok_analyze_post_followups_enabled: true,
  rweb_cashtags_composer_attachment_enabled: true,
  responsive_web_jetfuel_frame: true,
  responsive_web_grok_share_attachment_enabled: true,
  responsive_web_grok_annotations_enabled: true,
  articles_preview_enabled: true,
  responsive_web_edit_tweet_api_enabled: true,
  rweb_conversational_replies_downvote_enabled: false,
  graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
  view_counts_everywhere_api_enabled: true,
  longform_notetweets_consumption_enabled: true,
  responsive_web_twitter_article_tweet_consumption_enabled: true,
  content_disclosure_indicator_enabled: true,
  content_disclosure_ai_generated_indicator_enabled: true,
  responsive_web_grok_show_grok_translated_post: true,
  responsive_web_grok_analysis_button_from_backend: true,
  post_ctas_fetch_enabled: true,
  freedom_of_speech_not_reach_fetch_enabled: true,
  standardized_nudges_misinfo: true,
  tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
  longform_notetweets_rich_text_read_enabled: true,
  longform_notetweets_inline_media_enabled: false,
  responsive_web_grok_image_annotation_enabled: true,
  responsive_web_grok_imagine_annotation_enabled: true,
  responsive_web_grok_community_note_auto_translation_is_enabled: true,
  responsive_web_enhance_cards_enabled: false,
}

const TWEET_FEATURES = {
  creator_subscriptions_tweet_preview_api_enabled: true,
  premium_content_api_read_enabled: false,
  communities_web_enable_tweet_community_results_fetch: true,
  c9s_tweet_anatomy_moderator_badge_enabled: true,
  responsive_web_grok_analyze_button_fetch_trends_enabled: false,
  responsive_web_grok_analyze_post_followups_enabled: true,
  responsive_web_jetfuel_frame: true,
  responsive_web_grok_share_attachment_enabled: true,
  articles_preview_enabled: true,
  responsive_web_edit_tweet_api_enabled: true,
  graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
  view_counts_everywhere_api_enabled: true,
  longform_notetweets_consumption_enabled: true,
  responsive_web_twitter_article_tweet_consumption_enabled: true,
  tweet_awards_web_tipping_enabled: false,
  responsive_web_grok_show_grok_translated_post: false,
  responsive_web_grok_analysis_button_from_backend: true,
  creator_subscriptions_quote_tweet_preview_enabled: false,
  freedom_of_speech_not_reach_fetch_enabled: true,
  standardized_nudges_misinfo: true,
  tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
  longform_notetweets_rich_text_read_enabled: true,
  longform_notetweets_inline_media_enabled: true,
  payments_enabled: false,
  profile_label_improvements_pcf_label_in_post_enabled: true,
  responsive_web_profile_redirect_enabled: false,
  rweb_tipjar_consumption_enabled: true,
  verified_phone_label_enabled: false,
  responsive_web_grok_image_annotation_enabled: true,
  responsive_web_grok_imagine_annotation_enabled: true,
  responsive_web_grok_community_note_auto_translation_is_enabled: false,
  responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
  responsive_web_graphql_timeline_navigation_enabled: true,
  responsive_web_enhance_cards_enabled: false,
}

const USERNAME_PATTERN = /^[A-Za-z0-9_]{1,15}$/

type TweetRecord = {
  id: string
  userId: string
  quotedId?: string
  retweetedId?: string
  replyToId?: string
}

type GuestSession = {
  token: string
  expiresAt: number
}

let guestSession: GuestSession | null = null

function normalizeUsername(value: string): string {
  return value.trim().replace(/^@+/, '')
}

function isValidUsername(value: string): boolean {
  return USERNAME_PATTERN.test(normalizeUsername(value))
}

export function extractXHandle(url: string): string {
  const match = url.trim().match(/(?:x\.com|twitter\.com)\/(?:intent\/(?:user|follow)\?screen_name=)?@?([A-Za-z0-9_]+)/i)
  if (!match) return ''
  const handle = match[1]
  const reserved = new Set(['intent', 'i', 'home', 'explore', 'search', 'share', 'hashtag', 'compose'])
  return reserved.has(handle.toLowerCase()) ? '' : handle
}

export function extractTweetId(url: string): string {
  return url.trim().match(/status(?:es)?\/(\d+)/i)?.[1] ?? url.trim().match(/tweet_id=(\d+)/i)?.[1] ?? ''
}

function tweetUrl(handle: string, tweetId: string): string {
  return `https://x.com/${handle}/status/${tweetId}`
}

function intentFollow(handle: string): string {
  return `https://x.com/intent/follow?screen_name=${encodeURIComponent(handle)}`
}

function intentLike(tweetId: string): string {
  return `https://x.com/intent/like?tweet_id=${encodeURIComponent(tweetId)}`
}

function intentRetweet(tweetId: string): string {
  return `https://x.com/intent/retweet?tweet_id=${encodeURIComponent(tweetId)}`
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function rejected(error: string, target?: XVerifyTarget): XVerifyResult {
  return { ok: false, verified: false, error, target }
}

function accepted(target: XVerifyTarget): XVerifyResult {
  return { ok: true, verified: true, target }
}

function buildTarget(handle: string, tweetId: string): XVerifyTarget {
  return {
    handle,
    tweetId: tweetId || undefined,
    tweetUrl: tweetId ? tweetUrl(handle, tweetId) : undefined,
    followUrl: intentFollow(handle),
    likeUrl: tweetId ? intentLike(tweetId) : `https://x.com/${handle}`,
    retweetUrl: tweetId ? intentRetweet(tweetId) : `https://x.com/${handle}`,
  }
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    return null
  }
}

async function getGuestToken(): Promise<string> {
  if (guestSession && guestSession.expiresAt > Date.now()) return guestSession.token

  const response = await fetch('https://api.twitter.com/1.1/guest/activate.json', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GUEST_BEARER}`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Accept: 'application/json',
    },
  })
  const payload = asRecord(await readJson(response))
  const token = typeof payload?.guest_token === 'string' ? payload.guest_token : ''
  if (!response.ok || !token) {
    throw new Error('Could not start an X verification session.')
  }
  guestSession = { token, expiresAt: Date.now() + 12 * 60 * 1000 }
  return token
}

function guestHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${GUEST_BEARER}`,
    'x-guest-token': token,
    'x-twitter-active-user': 'yes',
    'x-twitter-client-language': 'en',
    'User-Agent': 'Mozilla/5.0',
  }
}

async function guestGet(url: string): Promise<{ status: number; data: unknown }> {
  const token = await getGuestToken()
  const response = await fetch(url, { headers: guestHeaders(token) })
  if (response.status === 401 || response.status === 403) {
    guestSession = null
    const retryToken = await getGuestToken()
    const retry = await fetch(url, { headers: guestHeaders(retryToken) })
    return { status: retry.status, data: await readJson(retry) }
  }
  return { status: response.status, data: await readJson(response) }
}

function graphqlUrl(
  queryId: string,
  name: string,
  variables: Record<string, unknown>,
  features: Record<string, boolean>,
  fieldToggles?: Record<string, boolean>,
): string {
  const query = new URLSearchParams({
    variables: JSON.stringify(variables),
    features: JSON.stringify(features),
  })
  if (fieldToggles) query.set('fieldToggles', JSON.stringify(fieldToggles))
  return `https://x.com/i/api/graphql/${queryId}/${name}?${query.toString()}`
}

function walk(value: unknown, visit: (node: Record<string, unknown>) => void): void {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visit)
    return
  }
  const record = asRecord(value)
  if (!record) return
  visit(record)
  for (const item of Object.values(record)) walk(item, visit)
}

function unwrapTweet(node: Record<string, unknown>): Record<string, unknown> | null {
  if (node.__typename === 'Tweet') return node
  if (node.__typename === 'TweetWithVisibilityResults') {
    return asRecord(node.tweet)
  }
  return null
}

function tweetFromNode(node: Record<string, unknown>): TweetRecord | null {
  const tweet = unwrapTweet(node)
  if (!tweet) return null
  const legacy = asRecord(tweet.legacy) ?? {}
  const id =
    (typeof tweet.rest_id === 'string' && tweet.rest_id) ||
    (typeof legacy.id_str === 'string' && legacy.id_str) ||
    ''
  if (!id) return null

  const retweeted = asRecord(tweet.retweeted_status_result)
  const retweetedTweet = unwrapTweet(asRecord(retweeted?.result) ?? {}) 
  const retweetedLegacy = asRecord(retweetedTweet?.legacy) ?? {}
  const retweetedId =
    (typeof retweetedTweet?.rest_id === 'string' && retweetedTweet.rest_id) ||
    (typeof retweetedLegacy.id_str === 'string' && retweetedLegacy.id_str) ||
    (typeof legacy.retweeted_status_id_str === 'string' && legacy.retweeted_status_id_str) ||
    undefined

  return {
    id,
    userId: typeof legacy.user_id_str === 'string' ? legacy.user_id_str : '',
    quotedId: typeof legacy.quoted_status_id_str === 'string' ? legacy.quoted_status_id_str : undefined,
    retweetedId,
    replyToId:
      typeof legacy.in_reply_to_status_id_str === 'string' ? legacy.in_reply_to_status_id_str : undefined,
  }
}

function collectTweets(data: unknown): TweetRecord[] {
  const tweets: TweetRecord[] = []
  const seen = new Set<string>()
  walk(data, (node) => {
    const tweet = tweetFromNode(node)
    if (!tweet || seen.has(tweet.id)) return
    seen.add(tweet.id)
    tweets.push(tweet)
  })
  return tweets
}

function collectScreenNames(data: unknown): string[] {
  const names = new Set<string>()
  walk(data, (node) => {
    const core = asRecord(node.core)
    const legacy = asRecord(node.legacy)
    const screen =
      (typeof core?.screen_name === 'string' && core.screen_name) ||
      (typeof legacy?.screen_name === 'string' && legacy.screen_name) ||
      ''
    if (screen) names.add(screen.toLowerCase())
  })
  return [...names]
}

async function lookupUser(username: string): Promise<{ id: string; username: string } | null> {
  const url = graphqlUrl(
    USER_BY_SCREEN,
    'UserByScreenName',
    { screen_name: username },
    USER_FEATURES,
    { withPayments: false, withAuxiliaryUserLabels: true },
  )
  const { status, data } = await guestGet(url)
  if (status !== 200) return null
  const root = asRecord(asRecord(asRecord(asRecord(data)?.data)?.user)?.result)
  if (!root || root.__typename === 'UserUnavailable') return null
  const id = typeof root.rest_id === 'string' ? root.rest_id : ''
  const core = asRecord(root.core)
  const screen =
    (typeof core?.screen_name === 'string' && core.screen_name) || username
  return id ? { id, username: screen } : null
}

async function userTweets(userId: string): Promise<TweetRecord[]> {
  const url = graphqlUrl(
    USER_TWEETS,
    'UserTweets',
    {
      userId,
      count: 40,
      includePromotedContent: false,
      withQuickPromoteEligibilityTweetFields: false,
      withVoice: false,
    },
    TIMELINE_FEATURES,
    { withArticlePlainText: false },
  )
  const { status, data } = await guestGet(url)
  if (status !== 200) return []
  return collectTweets(data)
}

async function tweetExists(tweetId: string): Promise<boolean> {
  const url = graphqlUrl(
    TWEET_BY_ID,
    'TweetResultByRestId',
    {
      tweetId,
      withCommunity: false,
      includePromotedContent: false,
      withVoice: false,
    },
    TWEET_FEATURES,
    { withArticleRichContentState: true, withArticlePlainText: false },
  )
  const { status, data } = await guestGet(url)
  if (status !== 200) return false
  const result = asRecord(asRecord(asRecord(data)?.data)?.tweetResult)?.result
  const tweet = unwrapTweet(asRecord(result) ?? {})
  return Boolean(tweet)
}

async function officialGet(path: string, bearer: string): Promise<{ status: number; data: unknown }> {
  const response = await fetch(`https://api.twitter.com/2${path}`, {
    headers: { Authorization: `Bearer ${bearer}` },
  })
  return { status: response.status, data: await readJson(response) }
}

async function officialUserId(username: string, bearer: string): Promise<string> {
  const { status, data } = await officialGet(`/users/by/username/${encodeURIComponent(username)}`, bearer)
  if (status !== 200) return ''
  const id = asRecord(asRecord(data)?.data)?.id
  return typeof id === 'string' ? id : ''
}

async function officialFollowing(
  sourceId: string,
  targetId: string,
  bearer: string,
): Promise<boolean | null> {
  const { status, data } = await officialGet(`/users/${sourceId}/following/${targetId}`, bearer)
  if (status === 404) return false
  if (status !== 200) return null
  return asRecord(asRecord(data)?.data)?.following === true
}

async function officialPagedUsernames(path: string, bearer: string, match: string): Promise<boolean | null> {
  let cursor = ''
  for (let page = 0; page < 4; page += 1) {
    const query = new URLSearchParams({ max_results: '100', 'user.fields': 'username' })
    if (cursor) query.set('pagination_token', cursor)
    const { status, data } = await officialGet(`${path}?${query.toString()}`, bearer)
    if (status === 403 || status === 401) return null
    if (status !== 200) return null
    const payload = asRecord(data)
    const users = Array.isArray(payload?.data) ? payload.data : []
    for (const user of users) {
      const record = asRecord(user)
      const username = typeof record?.username === 'string' ? record.username : ''
      if (username.toLowerCase() === match) return true
    }
    const next = asRecord(payload?.meta)?.next_token
    if (typeof next !== 'string' || !next) break
    cursor = next
  }
  return false
}

async function checkFollowGuest(source: string, target: string): Promise<boolean | 'missing'> {
  const query = new URLSearchParams({
    source_screen_name: source,
    target_screen_name: target,
  })
  const { status, data } = await guestGet(
    `https://api.twitter.com/1.1/friendships/show.json?${query.toString()}`,
  )
  const payload = asRecord(data)
  const errors = Array.isArray(payload?.errors) ? payload.errors : []
  if (errors.some((error) => asRecord(error)?.code === 163)) return 'missing'
  if (status !== 200) return false
  return asRecord(asRecord(asRecord(payload)?.relationship)?.source)?.following === true
}

async function engagementListHasUser(
  queryIds: string[],
  name: string,
  tweetId: string,
  username: string,
): Promise<boolean | null> {
  for (const queryId of queryIds) {
    const url = graphqlUrl(
      queryId,
      name,
      { tweetId, count: 80, includePromotedContent: false },
      TIMELINE_FEATURES,
    )
    const { status, data } = await guestGet(url)
    if (status === 404 || status === 403) continue
    if (status !== 200) continue
    const names = collectScreenNames(data)
    return names.includes(username.toLowerCase())
  }
  return null
}

function tweetMatchesEngagement(tweets: TweetRecord[], tweetId: string, userId: string): {
  quoted: boolean
  retweeted: boolean
  replied: boolean
  nativeRepost: boolean
} {
  let quoted = false
  let retweeted = false
  let replied = false
  let nativeRepost = false
  for (const tweet of tweets) {
    if (tweet.quotedId === tweetId) quoted = true
    if (tweet.retweetedId === tweetId) retweeted = true
    if (tweet.replyToId === tweetId) replied = true
    if (tweet.id === tweetId && tweet.userId && tweet.userId !== userId) nativeRepost = true
  }
  return { quoted, retweeted, replied, nativeRepost }
}

function latestOriginalTweet(tweets: TweetRecord[], userId: string): string {
  for (const tweet of tweets) {
    if (tweet.userId && tweet.userId !== userId) continue
    if (tweet.retweetedId) continue
    if (tweet.replyToId) continue
    return tweet.id
  }
  return tweets.find((tweet) => !tweet.retweetedId && !tweet.replyToId)?.id ?? ''
}

export async function resolveXTarget(config: XVerifyConfig): Promise<XVerifyTarget> {
  const handle = extractXHandle(config.followUrl) || 'robinstrangers'
  const configuredTweet = extractTweetId(config.likeUrl) || extractTweetId(config.retweetUrl)
  if (configuredTweet) return buildTarget(handle, configuredTweet)

  const targetUser = await lookupUser(handle)
  if (!targetUser) return buildTarget(handle, '')
  const tweets = await userTweets(targetUser.id)
  return buildTarget(handle, latestOriginalTweet(tweets, targetUser.id))
}

async function verifyFollow(
  username: string,
  target: XVerifyTarget,
  officialBearer?: string,
): Promise<XVerifyResult> {
  const targetUser = await lookupUser(target.handle)
  if (!targetUser) {
    return rejected(`Strangers X account @${target.handle} was not found.`, target)
  }

  if (officialBearer) {
    const [sourceId, targetId] = await Promise.all([
      officialUserId(username, officialBearer),
      officialUserId(target.handle, officialBearer),
    ])
    if (!sourceId) return rejected(`X account @${username} was not found.`, target)
    if (!targetId) return rejected(`Strangers X account @${target.handle} was not found.`, target)
    const official = await officialFollowing(sourceId, targetId, officialBearer)
    if (official === true) return accepted(target)
    if (official === false) {
      return rejected(`Verification rejected. @${username} is not following @${target.handle}.`, target)
    }
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const following = await checkFollowGuest(username, target.handle)
    if (following === true) return accepted(target)
    if (following === 'missing') {
      return rejected(`X account @${username} was not found.`, target)
    }
    if (attempt < 2) await sleep(700)
  }

  return rejected(
    `Verification rejected. Follow @${target.handle} from @${username}, then try again.`,
    target,
  )
}

async function verifyLike(
  username: string,
  userId: string,
  tweets: TweetRecord[],
  target: XVerifyTarget,
  officialBearer?: string,
): Promise<XVerifyResult> {
  if (!target.tweetId) {
    return rejected(`The Strangers post to like is not available yet.`, target)
  }

  if (officialBearer) {
    const liked = await officialPagedUsernames(
      `/tweets/${target.tweetId}/liking_users`,
      officialBearer,
      username.toLowerCase(),
    )
    if (liked === true) return accepted(target)
    if (liked === false) {
      return rejected(
        `Verification rejected. Like the Strangers post from @${username}, then try again.`,
        target,
      )
    }
  }

  const listed = await engagementListHasUser(FAVORITERS_IDS, 'Favoriters', target.tweetId, username)
  if (listed === true) return accepted(target)

  const engagement = tweetMatchesEngagement(tweets, target.tweetId, userId)
  if (engagement.quoted || engagement.replied) return accepted(target)

  return rejected(
    `Verification rejected. Like the Strangers post from @${username}. If likes are private, reply to or quote the post, then try again.`,
    target,
  )
}

async function verifyRetweet(
  username: string,
  userId: string,
  tweets: TweetRecord[],
  target: XVerifyTarget,
  officialBearer?: string,
): Promise<XVerifyResult> {
  if (!target.tweetId) {
    return rejected(`The Strangers post to retweet is not available yet.`, target)
  }

  if (officialBearer) {
    const reposted = await officialPagedUsernames(
      `/tweets/${target.tweetId}/retweeted_by`,
      officialBearer,
      username.toLowerCase(),
    )
    if (reposted === true) return accepted(target)
    if (reposted === false) {
      return rejected(
        `Verification rejected. Retweet the Strangers post from @${username}, then try again.`,
        target,
      )
    }
  }

  const listed = await engagementListHasUser(RETWEETERS_IDS, 'Retweeters', target.tweetId, username)
  if (listed === true) return accepted(target)

  const engagement = tweetMatchesEngagement(tweets, target.tweetId, userId)
  if (engagement.retweeted || engagement.quoted || engagement.nativeRepost) return accepted(target)

  return rejected(
    `Verification rejected. Retweet or quote the Strangers post from @${username}, then try again.`,
    target,
  )
}

export async function verifyXRequest(
  input: XVerifyRequest,
  config: XVerifyConfig,
): Promise<XVerifyResult> {
  const username = normalizeUsername(input.username)
  if (!isValidUsername(username)) {
    return rejected('Enter a valid X username to verify.')
  }

  const target = await resolveXTarget(config)
  if (input.taskId !== 'follow' && target.tweetId) {
    const exists = await tweetExists(target.tweetId).catch(() => true)
    if (!exists && (extractTweetId(config.likeUrl) || extractTweetId(config.retweetUrl))) {
      return rejected('The configured Strangers post was not found on X.', target)
    }
  }

  const claimant = await lookupUser(username)
  if (!claimant && input.taskId !== 'follow') {
    return rejected(`X account @${username} was not found.`, target)
  }

  const tweets = claimant ? await userTweets(claimant.id) : []
  const officialBearer = config.officialBearer?.trim() || undefined

  if (input.taskId === 'follow') {
    return verifyFollow(username, target, officialBearer)
  }
  if (input.taskId === 'like') {
    return verifyLike(username, claimant?.id ?? '', tweets, target, officialBearer)
  }
  if (input.taskId === 'retweet') {
    return verifyRetweet(username, claimant?.id ?? '', tweets, target, officialBearer)
  }

  const follow = await verifyFollow(username, target, officialBearer)
  if (!follow.verified) return follow
  if (!target.tweetId) return accepted(target)
  const like = await verifyLike(username, claimant?.id ?? '', tweets, target, officialBearer)
  if (!like.verified) return like
  const retweet = await verifyRetweet(username, claimant?.id ?? '', tweets, target, officialBearer)
  if (!retweet.verified) return retweet
  return accepted(target)
}

function readEnv(name: string): string | undefined {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
  if (proc?.env && typeof proc.env[name] === 'string' && proc.env[name]) {
    return proc.env[name]
  }
  const deno = (globalThis as { Deno?: { env?: { get?: (key: string) => string | undefined } } }).Deno
  try {
    return deno?.env?.get?.(name)
  } catch {
    return undefined
  }
}

export function defaultXVerifyConfig(): XVerifyConfig {
  return {
    followUrl: readEnv('X_FOLLOW_URL') || 'https://x.com/robinstrangers',
    likeUrl: readEnv('X_LIKE_URL') || '',
    retweetUrl: readEnv('X_RETWEET_URL') || '',
    officialBearer: readEnv('X_BEARER_TOKEN') || readEnv('TWITTER_BEARER_TOKEN'),
  }
}
