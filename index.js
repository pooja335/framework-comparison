'use strict'
var repos = ['angular/angular.js', 'emberjs/ember.js', 'facebook/react', 'vuejs/vue'] 
var allData = [];

var fetchCommitActivity = (repo) => {
  return fetch(`https://api.github.com/repos/${repo}/stats/commit_activity?access_token=71e497341966b1d5e8f2651df3f475550baa7da5`, {
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
  return fetch(`https://api.github.com/repos/${repo}?access_token=71e497341966b1d5e8f2651df3f475550baa7da5`, {
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
    allData.push(currentRepoData);
  })
}

var displayData = (allData) => {
  var resultTbody = document.getElementById("results")
  var resultRows = document.getElementsByClassName("result-row");
  
  while (resultRows.length) {
    resultTbody.removeChild(resultRows[0])
  }

  allData.forEach((framework) => {
    var tr = document.createElement("tr");
    tr.className = "result-row"
    tr.innerHTML = `<th>${framework.name}</th><td>${framework.commits}</td><td>${framework.stars}</td><td>${framework.issues}</td>`                       
    resultTbody.appendChild(tr);
  })
}

Promise.all(repos.map(fetchRepo)).then(() => {
  displayData(allData)
})

document.getElementById("commits").onclick = (e) => {
  allData.sort((a, b) => {
    return (b.commits - a.commits)
  })
  displayData(allData)
}










