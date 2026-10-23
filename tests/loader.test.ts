import { describe, expect, it } from 'vitest';
import { Loader } from '../src/loader.js';
import { ROOT_DIR } from './helpers.js';

describe('loader', () => {
  it('discovers external github/slack actions and native modules', async () => {
    const loader = new Loader(ROOT_DIR);
    const scan = await loader.list();
    const targets = scan.components.map((c) => c.target);

    // >= 1 github or slack external action
    const externalActions = scan.components.filter(
      (c) => c.kind === 'external' && (c.app === 'github' || c.app === 'slack') && c.type === 'action',
    );
    expect(externalActions.length).toBeGreaterThanOrEqual(1);

    // >= 1 native module
    const natives = scan.components.filter((c) => c.kind === 'native');
    expect(natives.length).toBeGreaterThanOrEqual(1);

    // expected keys present
    expect(targets).toContain('external/github/get-repository');
    expect(targets).toContain('external/github/new-or-updated-issue');
    expect(targets).toContain('native/echo');
    expect(targets).toContain('native/transform');
    expect(targets).toContain('native/dispatcher-log');

    // every entry carries key/type metadata from component.json
    for (const c of scan.components) {
      expect(c.key).toBeTruthy();
      expect(['action', 'source']).toContain(c.type);
    }
  });

  it('loads an external action module (default export unwrapped, run() callable)', async () => {
    const loader = new Loader(ROOT_DIR);
    const comp = await loader.load('external/github/get-repository');
    expect(typeof comp.run).toBe('function');
    expect(comp.def.key).toBe('github-get-repository');
    expect(comp.def.type).toBe('action');
  });

  it('loads a native module by 2-part target', async () => {
    const loader = new Loader(ROOT_DIR);
    const comp = await loader.load('native/echo');
    expect(typeof comp.run).toBe('function');
    expect(comp.def.key).toBe('native_echo');
  });

  it('loads an external source module', async () => {
    const loader = new Loader(ROOT_DIR);
    const comp = await loader.load('external/slack/new-message-in-channels');
    expect(typeof comp.run).toBe('function');
    expect(comp.def.type).toBe('source');
  });

  it('rejects invalid targets', async () => {
    const loader = new Loader(ROOT_DIR);
    await expect(loader.load('../etc/passwd')).rejects.toThrow(/invalid target/);
    await expect(loader.load('external/../secrets/x')).rejects.toThrow(/invalid target/);
    await expect(loader.load('external/nope/nope')).rejects.toThrow(/not found/);
  });
});
