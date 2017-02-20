'use strict'
var repos = ['angular/angular.js', 'emberjs/ember.js', 'facebook/react', 'vuejs/vue'] 
var allInfo = {
  'data': [],
  'checked': [],
  'sortedBy': '' 
};

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
    allInfo.data.push(currentRepoData);
  })
}

var displayFilters = (allInfo) => {
  allInfo.data.forEach((framework) => {
    var checkboxDiv = document.createElement("div");
    checkboxDiv.className = "checkbox"
    checkboxDiv.innerHTML = `<label><input type="checkbox" name="${framework.name}">${framework.name}</label>`                       
    document.getElementById("filter").appendChild(checkboxDiv);
  })
}

var displayData = (allInfo) => {
  var resultTbody = document.getElementById("results")
  var rows = document.getElementsByTagName("tr");
  
  while (rows.length) {
    resultTbody.removeChild(rows[0])
  }

  var headingTR = document.createElement("tr");
  headingTR.className = "heading-tr"
  headingTR.innerHTML = '<th></th><th id="commits">Commits in past year</th><th id="stars">Stars</th><th id="issues">Issues</th>'
  resultTbody.appendChild(headingTR);

  allInfo.data.forEach((framework) => {
    var tr = document.createElement("tr");
    tr.innerHTML = `<th>${framework.name}</th><td>${framework.commits}</td><td>${framework.stars}</td><td>${framework.issues}</td>`                       
    resultTbody.appendChild(tr);
  })
}

var initialize = () => {
  document.querySelectorAll(".heading-tr th").forEach((heading) => {
    heading.onclick = (e) => {
      allInfo.sortedBy = e.target.id
      console.log(allInfo)
      displayData(allInfo)
    }
  })

  document.querySelectorAll(".checkbox input").forEach((checkboxInput) => {
    checkboxInput.onchange = (e) => {
      var clickedOption = e.target.name;
      var index = allInfo.checked.indexOf(clickedOption)
      if (index === -1) {
        allInfo.checked.push(clickedOption)
      } else {
        allInfo.checked.splice(index, 1);
      }
      console.log(allInfo)
      displayData(allInfo)
    }
  })
}

Promise.all(repos.map(fetchRepo)).then(() => {
  displayData(allInfo)
  displayFilters(allInfo)
  initialize()
})








