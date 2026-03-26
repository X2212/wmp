import { strict as assert } from 'node:assert';
import test from 'node:test';
import handler from '../api/download.js';

const RELEASES_PAGE = 'https://www.worldmonitor.app/download';

test('matches full variant for dotted World.Monitor AppImage asset names', async () => {
  const response = await handler(
    new Request('https://worldmonitor.app/api/download?platform=linux-appimage&variant=full')
  );
  assert.equal(response.status, 302);
  assert.equal(
    response.headers.get('location'),
    'https://api.worldmonitor.app/api/download?platform=linux-appimage&variant=full'
  );
});

test('passes through tech variant', async () => {
  const response = await handler(
    new Request('https://worldmonitor.app/api/download?platform=linux-appimage&variant=tech')
  );
  assert.equal(response.status, 302);
  assert.equal(
    response.headers.get('location'),
    'https://api.worldmonitor.app/api/download?platform=linux-appimage&variant=tech'
  );
});

test('falls back to release page when platform is missing', async () => {
  const response = await handler(new Request('https://worldmonitor.app/api/download'));
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('location'), RELEASES_PAGE);
});

test('falls back to release page when platform is invalid', async () => {
  const response = await handler(new Request('https://worldmonitor.app/api/download?platform=wat'));
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('location'), RELEASES_PAGE);
});
