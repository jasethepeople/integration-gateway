import type { RegistryEntry, RegistryScan } from '../loader.js';
import type { AgentCard, AgentSkill } from './types.js';

export const A2A_PROTOCOL_VERSION = '0.3.0';

/** One registry component becomes one A2A skill. The skill id is the
 *  gateway target itself ("external/<app>/<component>"), so a client
 *  that discovers a skill already knows how to invoke it. */
export function skillFromEntry(
  entry: RegistryEntry,
  inputSchema?: Record<string, unknown>,
): AgentSkill {
  const skill: AgentSkill = {
    id: entry.target,
    name: entry.name ?? entry.key,
    description: entry.description ?? '',
    tags: [entry.kind, entry.app, entry.type ?? 'action'].filter(
      (t): t is string => typeof t === 'string' && t.length > 0,
    ),
    inputModes: ['application/json'],
    outputModes: ['application/json'],
  };
  if (inputSchema) skill.inputSchema = inputSchema;
  return skill;
}

function baseCard(url: string, name: string, description: string, skills: AgentSkill[]): AgentCard {
  return {
    protocolVersion: A2A_PROTOCOL_VERSION,
    name,
    description,
    url,
    version: '0.2.0',
    capabilities: {
      streaming: false,
      pushNotifications: false,
      stateTransitionHistory: false,
    },
    defaultInputModes: ['application/json'],
    defaultOutputModes: ['application/json'],
    skills,
  };
}

/** The gateway-wide card: every component in the registry as a skill. */
export function buildGatewayCard(
  scan: RegistryScan,
  url: string,
  schemas?: Map<string, Record<string, unknown>>,
): AgentCard {
  return baseCard(
    url,
    'integration-gateway-a2a',
    'A2A front door over the integration gateway registry: every mirrored ' +
      'app action is a delegable skill, executed by the gateway loader.',
    scan.components.map((c) => skillFromEntry(c, schemas?.get(c.target))),
  );
}

/** One card per app (skills = that app's components). Returns a map
 *  keyed by app name ("external/<app>" targets group under <app>). */
export function buildAppCards(
  scan: RegistryScan,
  urlForApp: (app: string) => string,
  schemas?: Map<string, Record<string, unknown>>,
): Map<string, AgentCard> {
  const byApp = new Map<string, RegistryEntry[]>();
  for (const entry of scan.components) {
    const list = byApp.get(entry.app) ?? [];
    list.push(entry);
    byApp.set(entry.app, list);
  }
  const cards = new Map<string, AgentCard>();
  for (const [app, entries] of byApp) {
    cards.set(
      app,
      baseCard(
        urlForApp(app),
        `${app} (via integration-gateway-a2a)`,
        `A2A agent card for the "${app}" integration: ${entries.length} skill(s) ` +
          'delegated to the gateway loader.',
        entries.map((c) => skillFromEntry(c, schemas?.get(c.target))),
      ),
    );
  }
  return cards;
}
