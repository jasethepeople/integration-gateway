// Mirrored from PipedreamHQ/pipedream components/github/actions/create-issue/create-issue.mjs
// (see original.mjs). Adapted to the integration-gateway RuntimeContext:
//   this.github.$auth.oauth_access_token -> ctx.auth.access_token
//   this.github.createIssue(...) (axios via @pipedream/platform) -> ctx.http POST to api.github.com
//   $.export("$summary", ...) -> ctx.log
// No @pipedream/* imports remain.
import type { IIntegrationComponent, RuntimeContext, Steps } from "../../../_types.ts";
import { assertOk, propsOf } from "../../../_helpers.ts";

interface CreateIssueProps {
  repoFullname?: string;
  title?: string;
  body?: string;
  labels?: string[];
  assignees?: string[];
  milestoneNumber?: number;
}

const component: IIntegrationComponent = {
  def: {
    key: "github-create-issue",
    name: "Create Issue",
    description:
      "Create a new issue in a repository, optionally with labels, assignees, and a milestone. " +
      "Provide the repository as an `owner/repo` string.",
    version: "0.4.3",
    type: "action",
    propsSchema: {
      type: "object",
      properties: {
        repoFullname: { type: "string", description: "Repository as `owner/repo`" },
        title: { type: "string", description: "The title of the issue." },
        body: { type: "string", description: "Issue body (GitHub-flavored Markdown)." },
        labels: { type: "array", items: { type: "string" } },
        assignees: { type: "array", items: { type: "string" } },
        milestoneNumber: { type: "integer" },
      },
      required: ["repoFullname", "title"],
    },
  },

  async run(ctx: RuntimeContext, event: unknown, _steps: Steps): Promise<unknown> {
    const props = propsOf(event) as CreateIssueProps;
    const repoFullname = props.repoFullname ?? ctx.config.repoFullname;
    if (typeof repoFullname !== "string" || !/^[^/\s]+\/[^/\s]+$/.test(repoFullname)) {
      throw new Error("repoFullname must be an `owner/repo` string");
    }
    if (!props.title) throw new Error("title is required");
    if (!ctx.auth.access_token) throw new Error("auth.access_token is required to create issues");

    // { title, body, labels, assignees, milestone } — same body shape as upstream
    const data = {
      title: props.title,
      body: props.body,
      labels: props.labels,
      assignees: props.assignees,
      milestone: props.milestoneNumber,
    };

    // POST /repos/{owner}/{repo}/issues
    const res = await ctx.http(`https://api.github.com/repos/${repoFullname}/issues`, {
      method: "POST",
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${ctx.auth.access_token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "integration-gateway",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    await assertOk(res, `github.createIssue(${repoFullname})`);
    const response = (await res.json()) as { number?: number; title?: string };

    // $.export("$summary", ...)
    ctx.log("info", `Successfully created issue #${response.number}: ${response.title}`);
    return response;
  },
};

export default component;
