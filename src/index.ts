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

    const pull = await octokit.rest.pulls.get({ 
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: pullRequest.number
    });

    const commits = await octokit.rest.pulls.listCommits({ 
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: pullRequest.number
    });

    console.log('#############', commits.data[0].sha)

    await octokit.rest.pulls.createReviewComment({
      ...context.repo,
      pull_number: pullRequest.number,
      body: `Hello ${pull.data.user?.id}`,
      commit_id: commits.data[0].sha,
      path: '',
      position: 0,
      in_reply_to: 0,
      line: 0,
      subject_type: ''
    })

  } catch (error) {
    setFailed((error as Error)?.message ?? "Unknown error");
  }
}

run();