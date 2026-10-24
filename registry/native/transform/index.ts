import { randomUUID } from 'node:crypto';
import type {
  CanonicalEvent,
  IIntegrationComponent,
  RuntimeContext,
  Steps,
} from '../_types.js';

export interface TransformMapping {
  /** component key that produced the raw payload (becomes event.source) */
  source: string;
  /** bus topic, convention "<app>.<event-type>" (becomes event.topic) */
  topic: string;
}

export interface TransformInput {
  /** raw payload as received from an external component */
  payload: Record<string, unknown>;
  /** mapping config */
  mapping: TransformMapping;
}

const component: IIntegrationComponent = {
  def: {
    key: 'native_transform',
    name: 'Native Transform',
    description:
      'Maps a raw external payload plus a mapping config into a CanonicalEvent and emits it to the local event bus.',
    type: 'action',
    version: '1.0.0',
    propsSchema: {
      type: 'object',
      required: ['payload', 'mapping'],
      properties: {
        payload: { type: 'object' },
        mapping: {
          type: 'object',
          required: ['source', 'topic'],
          properties: {
            source: { type: 'string' },
            topic: { type: 'string' },
          },
        },
      },
    },
  },
  async run(
    ctx: RuntimeContext,
    event: unknown,
    _steps: Steps,
  ): Promise<CanonicalEvent> {
    const input = (event ?? {}) as Partial<TransformInput>;
    const payload: Record<string, unknown> =
      input.payload && typeof input.payload === 'object'
        ? input.payload
        : {};
    const mapping = input.mapping ?? { source: 'unknown', topic: 'unknown.raw' };

    const canonical: CanonicalEvent = {
      id: randomUUID(),
      source: mapping.source,
      topic: mapping.topic,
      timestamp: new Date().toISOString(),
      data: payload,
      meta: {
        transformedBy: 'native_transform',
        mapping,
      },
    };

    await ctx.emit(canonical.topic, canonical);
    ctx.log('info', 'native_transform emitted CanonicalEvent', {
      id: canonical.id,
      topic: canonical.topic,
    });
    return canonical;
  },
}

export default component;
