import test from 'node:test';
import assert from 'node:assert/strict';
import { submitEnquiry, WEB3FORMS_ACCESS_KEY } from '../../lib/web3forms.ts';
const data = { name: 'SIWOM Test', email: 'test@example.com', company: 'Test', interest: 'logistics', message: 'Automated test; no external request.' };
test('sends supplied key and required fields; accepts only confirmed success', async () => {
  const ok = await submitEnquiry(data, async (url, options) => {
    assert.equal(url, 'https://api.web3forms.com/submit');
    const body = JSON.parse(options.body);
    assert.equal(body.access_key, WEB3FORMS_ACCESS_KEY);
    for (const key of ['name','email','message']) assert.equal(body[key], data[key]);
    return Response.json({success: true});
  });
  assert.equal(ok, true);
});
for (const [name, response] of [
  ['provider rejection with HTTP 200', () => Response.json({success:false})],
  ['HTTP error even with success payload', () => Response.json({success:true},{status:500})],
  ['malformed payload', () => new Response('not json')],
  ['missing confirmation', () => Response.json({})],
]) test(name, async () => assert.equal(await submitEnquiry(data, async () => response()), false));
test('network failures propagate for the route to handle', async () => {
  await assert.rejects(submitEnquiry(data, async () => { throw new Error('offline'); }), /offline/);
});
