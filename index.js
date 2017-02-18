'use strict'
var repos = ['angular/angular.js', 'emberjs/ember.js', 'facebook/react', 'vuejs/vue'] 
window.allData = [];

var addRow = (data) => {
  var tr = document.createElement("tr");
  tr.innerHTML = `<th>${data.name}</th><td>${data.name}</td><td>${data.name}</td><td>${data.name}</td>`
  var textnode = document.createTextNode("Water");    
  node.appendChild(textnode);                         
  document.getElementById("myList").appendChild(node);
}

var fetchCommitActivity = (repo) => {
  return fetch(`https://api.github.com/repos/${repo}/stats/commit_activity`, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/vnd.github.v3+json'
    })
  }).then((response) => {
    console.log(response.status)
    if (response.status === 200) {
      return response.json()
    } else if (response.status === 202) {
      return new Promise((resolve, reject) => {
        setTimeout(function(){ resolve() }, 100);
      }).then(() => {
        return fetchCommitActivity(repo)
      })
    }
  })
}

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
    return fetchCommitActivity(repo);
  }).then((commitData) => {
    currentRepoData['commits'] = commitData.reduce((totalCommits, week) => {
      return totalCommits + week.total;
    }, 0)
    window.allData.push(currentRepoData);
  })
}

Promise.all(repos.map(fetchRepo)).then(() => {
  console.log(window.allData)
})

