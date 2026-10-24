import { appendFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import type { IIntegrationComponent } from '../_types.js';

const DEFAULT_PATH = 'logs/native-events.jsonl';

const component: IIntegrationComponent = {
  def: {
    key: 'native_dispatcher_log',
    name: 'Native Dispatcher Log',
    description:
      'Appends the received event as a JSONL line to logs/native-events.jsonl (proves native I/O).',
    type: 'action',
    version: '1.0.0',
    propsSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description:
            'Optional override for the JSONL output path (default logs/native-events.jsonl).',
        },
        event: {
          description:
            'Event to persist (defaults to the whole incoming event).',
        },
      },
    },
  },
  async run(ctx, event, _steps) {
    const input = (event ?? {}) as { path?: string; event?: unknown };
    const relPath =
      typeof input.path === 'string' && input.path.length > 0
        ? input.path
        : DEFAULT_PATH;
    const outPath = resolve(process.cwd(), relPath);
    const record = 'event' in input ? input.event : event;

    await mkdir(dirname(outPath), { recursive: true });
    await appendFile(outPath, JSON.stringify(record) + '\n', 'utf8');

    ctx.log('info', 'native_dispatcher_log wrote event', { path: outPath });
    return { written: true, path: outPath };
  },
};

export default component;
