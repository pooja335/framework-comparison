'use strict'

module.exports.displayData = (allInfo) => {
  var resultTbody = document.getElementById('results')
  var resultHTML = '<tr class="heading-row"><th>Framework</th>'

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

  resultHTML += headings.reduce((accumulator, val) => {
    return accumulator + `<th><i id="${val.id}" class="fa ${(allInfo.sortedBy === val.id ? 'fa-sort-desc' : 'fa-sort')}"></i>&nbsp${val.title}</th>`
  }, '')
  resultHTML += '</tr>'

  var filteredSortedData = allInfo.data.filter((framework) => {
    return (allInfo.checked.indexOf(framework.name) > -1)
  })

  filteredSortedData.sort((a, b) => {
    return (b[allInfo.sortedBy] - a[allInfo.sortedBy])
  })

  filteredSortedData.forEach((framework) => {
    resultHTML += `<tr><th>${framework.name}</th><td>${framework.commits}</td><td>${framework.stars}</td><td>${framework.issues}</td></tr>`
  })
  resultTbody.innerHTML = resultHTML
}

module.exports.displayRefreshTime = () => {
  var refreshTimeText = document.getElementById('refresh-time')
  refreshTimeText.innerHTML = (`<em>Last refresh time: ${(new Date(Date.now())).toLocaleTimeString()} <i id="refresh-icon" class="fa fa-refresh"></i></em>`)
}

module.exports.displayFilters = (repos, allInfo) => {
  var frameworkNames = repos.map((repo) => (repo.split('/')[1]))
  frameworkNames.forEach((name) => {
    allInfo.checked.push(name)
    var checkboxDiv = document.createElement('div')
    checkboxDiv.className = 'checkbox'
    checkboxDiv.innerHTML = `<label><input type="checkbox" checked name="${name}">${name}</label>`
    document.getElementById('filter').appendChild(checkboxDiv)
  })
}
