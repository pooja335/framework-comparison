'use strict'
var repos = ['angular/angular.js', 'emberjs/ember.js', 'facebook/react', 'vuejs/vue'] 
var allData = [];

var fetchRepo = (repo) => {
  var currentRepoData = {};
  fetch(`https://api.github.com/repos/${repo}`, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/vnd.github.v3+json'
    })
  }).then((response) => {
    if (response.status === 200) {
      return response.json()
    }
  }).then((repoData) => {
    currentRepoData = {
      'name': repoData.name,
      'stars': repoData.stargazers_count,
      'issues': repoData.open_issues_count
    }
  })
}

repos.forEach((repo) => fetchRepo(repo));


