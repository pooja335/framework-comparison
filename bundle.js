(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  repos: ['angular/angular.js', 'emberjs/ember.js', 'facebook/react', 'vuejs/vue'],
  accessToken: '71e497341966b1d5e8f2651df3f475550baa7da5',
  pollingFrequency: 10000
}

},{}],2:[function(require,module,exports){
'use strict'

// display commits, stars, and issues for selected repositories
module.exports.displayData = (allInfo) => {
  var headings = [
    {
      id: 'commits',
      title: 'Commits in Past Year'
    },
    {
      id: 'stars',
      title: 'Stars'
    },
    {
      id: 'issues',
      title: 'Open Issues'
    }
  ]

  var filteredSortedData = allInfo.data.filter((framework) => {
    return (allInfo.checked.indexOf(framework.name) > -1)
  })

  filteredSortedData.sort((a, b) => {
    return (b[allInfo.sortedBy] - a[allInfo.sortedBy])
  })

  var resultTbody = document.getElementById('results')
  var resultHTML = '<tr class="heading-row"><th>Framework</th>'
  headings.forEach((heading) => {
    resultHTML += `<th>
                    <i id="${heading.id}" class="fa ${(allInfo.sortedBy === heading.id ? 'fa-sort-desc' : 'fa-sort')}"></i>
                    &nbsp${heading.title}
                  </th>`
  })
  resultHTML += '</tr>'

  filteredSortedData.forEach((framework) => {
    resultHTML += `<tr>
                    <th>${framework.name}</th>
                    <td>${framework.commits}</td>
                    <td>${framework.stars}</td>
                    <td>${framework.issues}</td>
                  </tr>`
  })

  resultTbody.innerHTML = resultHTML
}

module.exports.displayRefreshTime = () => {
  document.getElementById('refresh-time').innerHTML = (new Date()).toLocaleTimeString()
}

// display filtering checkboxes in panel on left of page
module.exports.displayFilters = (repos, allInfo) => {
  var frameworkNames = repos.map((repo) => (repo.split('/')[1]))
  var filterPanelBody = document.getElementById('filter')
  var filterPanelHTML = ''
  frameworkNames.forEach((name) => {
    allInfo.checked.push(name)
    filterPanelHTML += `<div class="checkbox"><label><input type="checkbox" checked name="${name}">${name}</label></div>`
  })
  filterPanelBody.innerHTML = filterPanelHTML
}

},{}],3:[function(require,module,exports){
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

},{"./constants.js":1}],4:[function(require,module,exports){
'use strict'

var { displayData, displayRefreshTime, displayFilters } = require('./display.js')
var { fetchRepo } = require('./fetchInfo.js')
var { repos, pollingFrequency } = require('./constants.js')

var allInfo = {
  data: [],
  checked: [],
  sortedBy: ''
}
var refreshTimer = null

// fetches data periodically and redisplays data
var poll = (manualRefresh = false) => {
  var errorAlert = document.getElementById('error-alert')
  if (refreshTimer) {
    clearTimeout(refreshTimer)
  }

  Promise.all(repos.map(fetchRepo)).then((allRepoData) => {
    allInfo.data = allRepoData
    displayData(allInfo)
    displayRefreshTime()
    errorAlert.classList.add('hidden')
    refreshTimer = setTimeout(poll, pollingFrequency)
  }).catch(() => {
    refreshTimer = setTimeout(poll, pollingFrequency)
    if (manualRefresh) {
      errorAlert.classList.remove('hidden')
    }
  })
}

// calls display functions initially and binds event handlers
var initialize = () => {
  displayFilters(repos, allInfo)

  document.getElementById('results').onclick = (e) => {
    if (e.target.id === 'commits' || e.target.id === 'stars' || e.target.id === 'issues') {
      allInfo.sortedBy = e.target.id
      displayData(allInfo)
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
      displayData(allInfo)
    }
  })

  document.getElementById('refresh-icon').onclick = () => {
    poll(true)
  }

  poll(true)
}

initialize()

},{"./constants.js":1,"./display.js":2,"./fetchInfo.js":3}]},{},[4]);
