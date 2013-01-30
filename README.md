## Github 

Grabs interesting data from the GitHub API.

### Description

This module for [depressionbot](https://github.com/reality/depressionbot) takes some interesting information about Github and parses it in a pleasing manner.

### Configuration
#### defaultrepo
When repository information is lacking from the command, this repository will be used.
### Commands
#### ~commits
Returns the number of commits in the repository of the current depressionbot instance.
#### ~gstatus
Returns the [current status of Github](https://status.github.com), and a message explaining the current state of affairs.
#### ~issue [id]
Gives information about the issue specified, from the default repository.
#### ~milestone [milestone name]
Returns milestone progress for any given milestone, with a link to the milestone in question.
#### ~repo <repo name>
Returns information about the repo given as a parameter. The repo should be specified as ``user/name``; for example, ``twitter/snowflake``.
#### ~repocount [user]
Returns the number of public Github repositories for the specified user.
### Dependencies
* [request](https://github.com/mikeal/request/):``$ npm install request``
