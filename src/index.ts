import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";

export async function run() {
  const token = getInput("gh-token");
  
  const octokit = getOctokit(token);
  const pullRequest = context.payload.pull_request;
  console.log('Hello');
  try {
    if (!pullRequest) {
      throw new Error("This action can only be run on Pull Requests");
    }

    const pull = await octokit.rest.pulls.get({ 
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: pullRequest.number
    });

    console.log('---->', JSON.stringify(pull.data.user || {}))

    await octokit.rest.issues.createComment({
      ...context.repo,
      issue_number: pullRequest.number,
      body: `Hello ${pull.data.user?.id}`,
    })

  } catch (error) {
    setFailed((error as Error)?.message ?? "Unknown error");
  }
}

run();
