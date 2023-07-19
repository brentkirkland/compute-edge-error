# EdgeError

The following is an example how you would to use Fastly's Compute@Edge to report errors to your slack.

## Requirements

- Node v16

## Setup

1. Copy `fastly.toml.example` to `fastly.toml`

2. Be sure to activate Slack Incoming Webhooks. Define which channel you want to post to.

3. Copy the Slack's generated webhook url to `fastly.toml` to the value of of `SLACK_WEBOOK` within `secrete_stores.secrets`.

## Install

```
pnpm i
```

## Run

```

npx nx run-many -t build
npx nx run-many -t serve

```

Visit `https://localhost:4200` to throw some errors. Watch them be posted to your slack.
