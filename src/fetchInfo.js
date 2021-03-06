'use strict'

var { accessToken } = require('./constants.js')

// fetch github activity for commits
var fetchCommitActivity = (repo) => {
  return fetch(`https://api.github.com/repos/${repo}/stats/commit_activity?access_token=${accessToken}`, {
    method: 'GET',
    headers: new Headers({
      Accept: 'application/vnd.github.v3+json'
    })
  }).then((response) => {
    if (response.status === 200) {
      return response.json()
    } else if (response.status === 202) {
      return new Promise((resolve) => {
        setTimeout(() => { resolve() }, 100)
      }).then(() => {
        return fetchCommitActivity(repo)
      })
    } else {
      throw new Error()
    }
  })
}

// fetch github activity for issues and stars
module.exports.fetchRepo = (repo) => {
  var currentRepoData = {}
  return fetch(`https://api.github.com/repos/${repo}?access_token=${accessToken}`, {
    method: 'GET',
    headers: new Headers({
      Accept: 'application/vnd.github.v3+json'
    })
  }).then((response) => {
    if (response.status === 200) {
      return response.json()
    } else {
      throw new Error()
    }
  }).then((repoData) => {
    currentRepoData = {
      name: repoData.name,
      stars: repoData.stargazers_count,
      issues: repoData.open_issues_count
    }
    return fetchCommitActivity(repo)
  }).then((commitData) => {
    currentRepoData.commits = commitData.reduce((totalCommits, week) => {
      return totalCommits + week.total
    }, 0)
    return currentRepoData
  })
}
