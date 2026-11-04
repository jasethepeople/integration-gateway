# A2A front door — integration-gateway-a2a

This fork adds an [A2A (Agent2Agent)](https://a2a-protocol.org)
protocol layer over the integration gateway. The gateway's engine —
registry, loader, shim, router — is unchanged. A2A replaces the
*invocation surface*: instead of calling REST endpoints or MCP tools,
agents delegate work to the gateway as an agent, using tasks with a
lifecycle. The vendor APIs underneath still get called by the
components; A2A is how agents hand the gateway work, not how the
gateway reaches vendors.

## Discovery

| Route | What it returns |
|---|---|
| `GET /.well-known/agent-card.json` | The gateway card: every registry component as one skill. Skill `id` **is** the gateway target (`external/<app>/<component>` / `native/<module>`). |
| `GET /a2a/apps/<app>/agent-card.json` | A per-app card (that app's skills only). |
| `npm run cards` | Offline generation of both into `cards/` (gateway card + `cards/apps/*.json`). `A2A_BASE_URL` sets the baked-in endpoint URL. Skills carry name/description from the registry scan; `inputSchema` enrichment is *not* included — the props schema lives in each component module's `def`, and harvesting it would mean importing all ~15k modules. |

## Invocation

`POST /a2a` — JSON-RPC 2.0. Supported methods: `message/send`,
`tasks/get`, `tasks/cancel`.

`message/send` expects a data part carrying the gateway's existing
`ExecuteRequest`:

```json
{
  "jsonrpc": "2.0", "id": 1, "method": "message/send",
  "params": { "message": {
    "kind": "message", "messageId": "m1", "role": "user",
    "parts": [{ "kind": "data", "data": {
      "target": "native/echo",
      "event": { "hello": "a2a" },
      "auth": { "api_key": "..." },
      "config": {}
    }}]
  }}
}
```

(`message.metadata.target` is accepted as a fallback.) The reply is
a Task: `completed` with an artifact holding the gateway's
`ExecuteResponse` (`ok`, `result`, `durationMs`, `attempts`), or
`failed` with the error in the same artifact. A message with no
addressable target returns an `input-required` task explaining the
expected shape — it never guesses.

## Honest limits (v1)

- **No streaming, no push notifications** — the card says so
  (`capabilities.streaming: false`). `message/send` executes to a
  final state inside the call.
- **Tasks are in memory.** `tasks/get` works for tasks this process
  created; a restart forgets them. Persistence is future work.
- **Auth passes through, unchanged.** The `auth` in the data part is
  handed to the component's runtime context exactly as
  `/api/v1/execute` does today. The A2A layer adds no auth of its
  own yet — run it behind the same controls you'd put in front of
  the REST API.
- The gateway card lists **all** skills (14k+). It's a large
  document; per-app cards are the practical discovery unit. A
  future version may paginate or filter the gateway card.
