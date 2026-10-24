// Mirrored from PipedreamHQ/pipedream components/github/actions/get-repository/get-repository.mjs
// (see original.mjs). Adapted to the integration-gateway RuntimeContext:
//   this.github.$auth.oauth_access_token -> ctx.auth.access_token
//   this.github.getRepo(...) (axios via @pipedream/platform) -> ctx.http (fetch) against api.github.com
//   $.export("$summary", ...) -> ctx.log
// No @pipedream/* imports remain.
import type { IIntegrationComponent, RuntimeContext, Steps } from "../../../_types.ts";
import { assertOk, propsOf } from "../../../_helpers.ts";

interface GetRepositoryProps {
  repoFullname?: string;
}

const component: IIntegrationComponent = {
  def: {
    key: "github-get-repository",
    name: "Get Repository Info",
    description:
      "Get metadata for a single repository: description, default branch, visibility, topics, " +
      "star/fork/open-issue counts, your permission level, and timestamps. Provide the repository " +
      "as an `owner/repo` string (e.g. `PipedreamHQ/pipedream`).",
    version: "0.1.3",
    type: "action",
    propsSchema: {
      type: "object",
      properties: {
        repoFullname: {
          type: "string",
          description: "Repository as `owner/repo`, e.g. `PipedreamHQ/pipedream`",
        },
      },
      required: ["repoFullname"],
    },
  },

  async run(ctx: RuntimeContext, event: unknown, _steps: Steps): Promise<unknown> {
    const props = propsOf(event) as GetRepositoryProps;
    const repoFullname = props.repoFullname ?? ctx.config.repoFullname;
    if (typeof repoFullname !== "string" || !/^[^/\s]+\/[^/\s]+$/.test(repoFullname)) {
      throw new Error("repoFullname must be an `owner/repo` string");
    }

    // this.github._headers() -> Authorization from ctx.auth.access_token (optional for public repos)
    const headers: Record<string, string> = {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "integration-gateway",
    };
    if (ctx.auth.access_token) {
      headers["Authorization"] = `Bearer ${ctx.auth.access_token}`;
    }

    // GET /repos/{owner}/{repo}
    const res = await ctx.http(`https://api.github.com/repos/${repoFullname}`, { headers });
    await assertOk(res, `github.getRepo(${repoFullname})`);
    const repo = await res.json();

    // $.export("$summary", ...)
    ctx.log("info", `Successfully retrieved repository ${repoFullname}`);
    return repo;
  },
};

export default component;
