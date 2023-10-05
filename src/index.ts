import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";

export async function run() {
  const token = getInput("gh-token");
  
  const octokit = getOctokit(token);
  const pullRequest = context.payload.pull_request;

  try {
    if (!pullRequest) {
      throw new Error("This action can only be run on Pull Requests");
    }

    console.log(`##### Get pull data`)

    const pull = await octokit.rest.pulls.get({ 
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: pullRequest.number
    });

    console.log(`Hello ${pull.data.user?.name}`)

    console.log(`##### createReviewComment`)
    await octokit.rest.pulls.createReviewComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: pullRequest.number,
      body: `Hello ${pull.data.user?.name}`
    })

    console.log(`##### done`)

  } catch (error) {
    setFailed((error as Error)?.message ?? "Unknown error");
  }
}

run();