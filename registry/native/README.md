# Native modules — mapping contract

This directory holds first-class native plugins for integration-gateway. Each
module lives in its own folder with:

- `component.json` — `{ key, name, description, type: "action" | "source", version }`
- `index.ts` — default-exports an `IIntegrationComponent` (`{ def, run(ctx, event, steps) }`)

Interface contracts (`RuntimeContext`, `IIntegrationComponent`, `CanonicalEvent`)
are re-declared in `_types.ts` EXACTLY as specified in `SPEC.md` § "Interface
contracts"; they merge structurally with `src/types.ts`.

## CanonicalEvent

All events crossing the internal bus use the canonical envelope
(see `schemas/canonical-event.schema.json`):

```json
{
  "id": "uuid",
  "source": "component key that produced the event",
  "topic": "<app>.<event-type>",
  "timestamp": "ISO8601",
  "data": { "…payload…" },
  "meta": { "…provenance…" }
}
```

## External raw output → CanonicalEvent

When an external (mirrored Pipedream) component produces raw output, it becomes
a CanonicalEvent by these conventions:

| CanonicalEvent field | Rule |
| -------------------- | ---- |
| `id`        | Fresh `uuid` (`node:crypto.randomUUID()`). |
| `source`    | The producing component's key, e.g. `github_new_issue` or `native_transform`. |
| `topic`     | `"<app>.<event-type>"` — lowercase, dot-namespaced, e.g. `github.new_issue`. This is also the bus topic passed to `ctx.emit(topic, event)`. |
| `timestamp` | ISO8601 creation time (`new Date().toISOString()`). |
| `data`      | The raw external payload, verbatim (object). |
| `meta`      | Optional provenance: which module transformed it, the mapping config used, upstream ids, cursor values, etc. |

`native_transform` is the reference implementation of this mapping: it accepts
`{ payload, mapping: { source, topic } }`, wraps the payload into a
CanonicalEvent, emits it via `ctx.emit(topic, event)`, and returns the event.

## Modules

- **echo** (`native_echo`) — passthrough action returning `{ echo: event }`; smoke-test target.
- **transform** (`native_transform`) — external→native mapping; builds + emits a CanonicalEvent.
- **dispatcher-log** (`native_dispatcher_log`) — appends the received event as JSONL to `logs/native-events.jsonl`; returns `{ written: true, path }`. Proves native I/O.

## Adding a native module

1. `mkdir registry/native/<module>`
2. Add `component.json` with a unique `key` (`native_<module>`).
3. Add `index.ts` implementing `IIntegrationComponent` against `_types.ts`.
4. The loader discovers it as target `native/<module>`.
