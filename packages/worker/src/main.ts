/// <reference types="@fastly/js-compute" />

import { env } from 'fastly:env';
import { SecretStore } from 'fastly:secret-store';

import queryString from 'query-string';

addEventListener('fetch', (event) => event.respondWith(handleRequest(event)));

async function handleRequest(event: FetchEvent) {
  // Log service version
  console.log(
    'FASTLY_SERVICE_VERSION:',
    env('FASTLY_SERVICE_VERSION') || 'local'
  );

  // Get the client request.
  const req = event.request;

  // Filter requests that have unexpected methods.
  if (!['GET'].includes(req.method)) {
    return new Response('This method is not allowed', {
      status: 405,
    });
  }

  const url = new URL(req.url);

  if (url.pathname == '/') {
    const [, params] = url.href.split('?');
    const parsedParams = queryString.parse(decodeURIComponent(params));

    const secrets = new SecretStore('secrets');
    const slackWebhook = await secrets.get('SLACK_WEBHOOK');

    // TODO env vars
    await fetch(slackWebhook.plaintext(), {
      method: 'POST',
      body: JSON.stringify({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*New error security-ui error*',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Stack error:*\n' + '```' + parsedParams.stack + '```',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '<https://github.com/fastly/issues/new|Create Github Issue>',
            },
          },
        ],
      }),
      backend: 'backend_a',
    });

    return new Response('ok', {
      status: 200,
      headers: new Headers({ 'Content-Type': 'text/html; charset=utf-8' }),
    });
  }

  // Catch all other requests and return a 404.
  return new Response('The page you requested could not be found', {
    status: 404,
  });
}
