/**
 * generate-agent-cards — offline Agent Card generation.
 *
 * Walks the registry once (Loader.list, filesystem-only), enriches
 * each skill with the component's propsSchema where component.json
 * provides one, and writes:
 *
 *   cards/agent-card.json          the gateway card (all skills)
 *   cards/apps/<app>.json          one card per app
 *
 * Skills carry the name/description/type harvested from each
 * component's component.json by the loader's filesystem scan.
 * Run: npm run cards   (tsx scripts/generate-agent-cards.ts)
 * The base URL baked into cards comes from A2A_BASE_URL
 * (default http://localhost:3000/a2a).
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Loader } from '../src/loader.js';
import { buildAppCards, buildGatewayCard } from '../src/a2a/card.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const baseUrl = process.env.A2A_BASE_URL ?? 'http://localhost:3000/a2a';

async function main(): Promise<void> {
  const loader = new Loader(ROOT_DIR);
  const scan = await loader.list();
  console.log(`scanned ${scan.components.length} components in ${scan.scannedDirs} dirs`);

  // Note: skills are NOT enriched with propsSchema here. That schema
  // lives in each component module's `def`, not in component.json —
  // harvesting it would mean importing all ~15k modules, which is
  // exactly what the filesystem-only scan exists to avoid. Cards
  // carry name/description/type from component.json; input schemas
  // are a possible future per-app enrichment at load time.

  const outDir = path.join(ROOT_DIR, 'cards');
  const appsDir = path.join(outDir, 'apps');
  await mkdir(appsDir, { recursive: true });

  const gateway = buildGatewayCard(scan, baseUrl);
  await writeFile(path.join(outDir, 'agent-card.json'), JSON.stringify(gateway, null, 2) + '\n');

  const appCards = buildAppCards(scan, () => baseUrl);
  for (const [app, card] of appCards) {
    await writeFile(path.join(appsDir, `${app}.json`), JSON.stringify(card, null, 2) + '\n');
  }
  console.log(`wrote gateway card (${gateway.skills.length} skills) + ${appCards.size} app cards to cards/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
