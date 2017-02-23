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
