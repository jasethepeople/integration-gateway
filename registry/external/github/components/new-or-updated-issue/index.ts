// Mirrored from PipedreamHQ/pipedream components/github/sources/new-or-updated-issue/new-or-updated-issue.mjs
// (see original.mjs). The upstream source supports both webhook (instant) and polling modes;
// this mirror implements the polling mode against the public REST API:
//   this.github.$auth.oauth_access_token -> ctx.auth.access_token (optional for public repos)
//   this.github.getRepositoryLatestIssues(...) (axios) -> ctx.http GET /repos/{owner}/{repo}/issues?state=all&sort=updated
//   $.interface.timer -> the gateway scheduler invoking run() periodically
//   dedupe: "unique" via $.service.db -> ctx.store cursor of last seen (id, updated_at)
//   $emit(item, {summary, id, ts}) -> ctx.emit("github.<topic>", CanonicalEvent)
// No @pipedream/* imports remain.
import type { IIntegrationComponent, RuntimeContext, Steps } from "../../../_types.ts";
import { assertOk, canonicalEvent, propsOf } from "../../../_helpers.ts";

interface SourceProps {
  repoFullname?: string;
}

interface GithubIssue {
  id: number;
  number: number;
  title: string;
  updated_at: string;
  pull_request?: unknown;
  [k: string]: unknown;
}

const component: IIntegrationComponent = {
  def: {
    key: "github-new-or-updated-issue",
    name: "New or Updated Issue",
    description: "Emit new events when an issue is created or updated (polling)",
    version: "1.1.13",
    type: "source",
    propsSchema: {
      type: "object",
      properties: {
        repoFullname: { type: "string", description: "Repository as `owner/repo`" },
      },
      required: ["repoFullname"],
    },
  },

  async run(ctx: RuntimeContext, event: unknown, _steps: Steps): Promise<unknown> {
    const props = propsOf(event) as SourceProps;
    const repoFullname = props.repoFullname ?? ctx.config.repoFullname;
    if (typeof repoFullname !== "string" || !/^[^/\s]+\/[^/\s]+$/.test(repoFullname)) {
      throw new Error("repoFullname must be an `owner/repo` string");
    }

    const headers: Record<string, string> = {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "integration-gateway",
    };
    if (ctx.auth.access_token) {
      headers["Authorization"] = `Bearer ${ctx.auth.access_token}`;
    }

    // GET /repos/{owner}/{repo}/issues?state=all&sort=updated&direction=desc&per_page=100
    const url =
      `https://api.github.com/repos/${repoFullname}/issues` +
      `?state=all&sort=updated&direction=desc&per_page=100`;
    const res = await ctx.http(url, { headers });
    await assertOk(res, `github.listIssues(${repoFullname})`);
    const issues = ((await res.json()) as GithubIssue[]).filter((i) => !i.pull_request);

    // Dedupe ("unique") via ctx.store: remember the latest updated_at cursor per repo.
    const storeKey = `lastUpdatedAt:${repoFullname}`;
    const lastUpdatedAt = await ctx.store.get<string>(storeKey);

    const fresh = issues
      .filter((i) => !lastUpdatedAt || i.updated_at > lastUpdatedAt)
      .sort((a, b) => a.updated_at.localeCompare(b.updated_at)); // oldest first

    for (const issue of fresh) {
      const action = issue.created_at === issue.updated_at ? "opened" : "updated";
      // $emit(item, { summary: `Issue ${action}: "${item.title}"`, ... })
      const summary = `Issue ${action}: "${issue.title}"`;
      ctx.log("info", summary, { number: issue.number });
      await ctx.emit(
        "github.new_or_updated_issue",
        canonicalEvent(
          this.def.key,
          "github.new_or_updated_issue",
          issue as unknown as Record<string, unknown>,
          { summary, dedupeId: `${issue.id}:${issue.updated_at}` },
        ),
      );
    }

    if (fresh.length > 0) {
      await ctx.store.set(storeKey, fresh[fresh.length - 1].updated_at);
    } else if (!lastUpdatedAt && issues.length > 0) {
      // First poll with nothing to emit (empty fresh set cannot happen here, but be safe):
      await ctx.store.set(storeKey, issues[0].updated_at);
    }

    return { emitted: fresh.length, total: issues.length };
  },
};

export default component;
