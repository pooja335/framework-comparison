'use strict'

var repos = ['angular/angular.js', 'emberjs/ember.js', 'facebook/react', 'vuejs/vue']
var columnTitles = {
  commits: 'Commits in Past Year',
  stars: 'Stars',
  issues: 'Open Issues'
}
var allInfo = {
  data: [],
  checked: [],
  sortedBy: ''
}
var refreshTimer = null;

var fetchCommitActivity = (repo) => {
  return fetch(`https://api.github.com/repos/${repo}/stats/commit_activity?access_token=71e497341966b1d5e8f2651df3f475550baa7da5`, {
    method: 'GET',
    headers: new Headers({
      Accept: 'application/vnd.github.v3+json'
    })
  }).then((response) => {
    console.log(response.status)
    if (response.status === 200) {
      return response.json()
    } else if (response.status === 202) {
      return new Promise((resolve) => {
        setTimeout(() => { resolve() }, 100)
      }).then(() => {
        return fetchCommitActivity(repo)
      })
    } else {
      throw 'error'
    }
  })
}

var fetchRepo = (repo) => {
  var currentRepoData = {}
  return fetch(`https://api.github.com/repos/${repo}?access_token=71e497341966b1d5e8f2651df3f475550baa7da5`, {
    method: 'GET',
    headers: new Headers({
      Accept: 'application/vnd.github.v3+json'
    })
  }).then((response) => {
    console.log(response.status)
    if (response.status === 200) {
      return response.json()
    } else {
      throw 'error'
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

var addHeaderColumn = (headingTR, columnId) => {
  var headingTH = document.createElement('th')
  headingTH.innerHTML = `<i id="${columnId}" class="fa ${(allInfo.sortedBy === columnId ? "fa-sort-desc" : "fa-sort")}"></i>&nbsp${columnTitles[columnId]}`
  headingTR.appendChild(headingTH)
}

var displayData = () => {
  var resultTbody = document.getElementById('results')
  var rows = document.getElementsByTagName('tr')

  while (rows.length) {
    resultTbody.removeChild(rows[0])
  }

  var headingTR = document.createElement('tr')
  headingTR.className = 'heading-tr'
  headingTR.innerHTML = '<th>Framework</th>'
  addHeaderColumn(headingTR, 'commits')
  addHeaderColumn(headingTR, 'stars')
  addHeaderColumn(headingTR, 'issues')
  resultTbody.appendChild(headingTR)

  var filteredSortedData = allInfo.data.filter((framework) => {
    return (allInfo.checked.indexOf(framework.name) > -1)
  })

  filteredSortedData.sort((a, b) => {
    return (b[allInfo.sortedBy] - a[allInfo.sortedBy])
  })

  filteredSortedData.forEach((framework) => {
    var tr = document.createElement('tr')
    tr.innerHTML = `<th>${framework.name}</th><td>${framework.commits}</td><td>${framework.stars}</td><td>${framework.issues}</td>`
    resultTbody.appendChild(tr)
  })
}

var displayRefreshTime = () => {
  var refreshTimeText = document.getElementById('refresh-time')
  refreshTimeText.innerHTML = (`<em>Last refresh time: ${(new Date(Date.now())).toLocaleTimeString()} <i class="fa fa-refresh"></i></em>`);
}

var displayFilters = () => {
  var frameworkNames = repos.map((repo) => (repo.split('/')[1]))
  frameworkNames.forEach((name) => {
    allInfo.checked.push(name)
    var checkboxDiv = document.createElement('div')
    checkboxDiv.className = 'checkbox'
    checkboxDiv.innerHTML = `<label><input type="checkbox" checked name="${name}">${name}</label>`
    document.getElementById('filter').appendChild(checkboxDiv)
  })
}

var initialize = () => {
  displayFilters()

  document.getElementById('results').onclick = (e) => {
    if (e.target.id === 'commits' || e.target.id === 'stars' || e.target.id === 'issues') {
      allInfo.sortedBy = e.target.id
      displayData()
    }
  }

  document.querySelectorAll('.checkbox input').forEach((checkboxInput) => {
    checkboxInput.onchange = (e) => {
      var clickedOption = e.target.name
      var index = allInfo.checked.indexOf(clickedOption)
      if (index === -1) {
        allInfo.checked.push(clickedOption)
      } else {
        allInfo.checked.splice(index, 1)
      }
      displayData()
    }
  })

  document.getElementById('refresh-time').onclick = (e) => {
    if (e.target.className === "fa fa-refresh") {
      poll(true)
    }
  }
}

var poll = (manualRefresh=false) => {
  var errorAlert = document.getElementById('error-alert')
  if (refreshTimer) {
    clearTimeout(refreshTimer)
  }
  Promise.all(repos.map(fetchRepo)).then((allRepoData) => {
    allInfo.data = allRepoData
    displayData()
    displayRefreshTime()
    errorAlert.classList.add('hidden')
    refreshTimer = setTimeout(poll, 10000)
  }).catch(() => {
    refreshTimer = setTimeout(poll, 10000)
    if (manualRefresh) {
      errorAlert.classList.remove('hidden')
    }
  })
}

initialize()
poll(true)

