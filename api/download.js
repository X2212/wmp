// Non-sebuf: redirect helper, stays as standalone Vercel function
export const config = { runtime: 'edge' };

const RELEASES_PAGE = 'https://www.worldmonitor.app/download';

const ALLOWED_PLATFORMS = new Set([
  'windows-exe',
  'windows-msi',
  'macos-arm64',
  'macos-x64',
  'linux-appimage',
  'linux-appimage-arm64',
]);

export default async function handler(req) {
  const url = new URL(req.url);
  const platform = url.searchParams.get('platform');
  const variant = (url.searchParams.get('variant') || '').toLowerCase();

  if (!platform || !ALLOWED_PLATFORMS.has(platform)) {
    return Response.redirect(RELEASES_PAGE, 302);
  }

  const dest = new URL('https://api.worldmonitor.app/api/download');
  dest.searchParams.set('platform', platform);
  if (variant) dest.searchParams.set('variant', variant);
    return new Response(null, {
      status: 302,
      headers: {
      Location: dest.toString(),
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60, stale-if-error=600',
      },
    });
}
