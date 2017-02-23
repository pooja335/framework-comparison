# Framework Comparison

## Summary
This app evaluates new client-side Javascript frameworks by comparing the number of commits in the past year, stars, and open issues for each framework. The frameworks currently being evaluated are Angular, Ember, React, and Vue. This app has been tested in Chrome version 56. 

## Approach
### Metrics
- Commits - The number of commits in the past year is the most obvious indication of recent development activity. I found this to be a more useful metric than forks or pull requests, which are two other indicators of development activity, because it shows actual development within the repository, not just potential development. Often, repositories are forked and not changed, and pull requests are submitted and not accepted, so commits seemed like a more accurate measure of actual changes. 

- Stars - The number of stars that a repository has shows how many people have found it useful or are interested in it, which is a good indication of community support. A higher number of stars (and therefore users) often means that a repository will also have more answered questions and examples available. 

- Issues - Issues in a GitHub repository are primarily questions from the community, bugs, and feature requests. Therefore, a large number of issues in a repository indicates that many people are using it, but also, there is a possibility that it has many bugs and/or is confusing to use (hence many questions). Either way, this is a useful metric to have when evaluating which framework to use, especially when viewed in conjunction with the number of stars. However, the issues of a repository should be looked at more closely (how many bugs, how quickly are questions answered, etc.) before choosing a framework. 

### UI
This app was written using vanilla Javascript and no external Javascript libraries. Therefore, the metrics are displayed in a table rather than a chart. While a chart could have shown a visualization of the data, a table seemed sufficient for comparing this data, due to the sorting and filtering functionality, without requiring a library. 

### Polling
I initially did not want to poll the GitHub API every few seconds, but instead listen for changes to the repositories and only redisplay the table when a change occurred. However, the GitHub API only allows you to set up webhooks and listen for events on repositories for which you are an owner/admin. Therefore, I decided to poll the repository every 10 seconds (but this is a parameter in constants.js). 
