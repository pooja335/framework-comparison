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
