import { jsonResponse } from './_json-response.js';

export const config = { runtime: 'edge' };

export default async function handler() {
  const version =
    process.env.APP_VERSION
    || process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7)
    || 'unknown';

  return jsonResponse({
    version,
    tag: version === 'unknown' ? '' : `v${version}`,
    url: 'https://www.worldmonitor.app/download',
    prerelease: false,
  }, 200, {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60, stale-if-error=3600',
    'Access-Control-Allow-Origin': '*',
  });
}
