## Github 

Grabs interesting data from the GitHub API.

### Description

This module for [depressionbot](https://github.com/reality/depressionbot) takes some interesting information about Github and parses it in a pleasing manner.

### Configuration
#### defaultrepo
When repository information is lacking from the command, this repository will be used.
### Commands
#### ~repocount [user]
Returns the number of public Github repositories for the specified user.
#### ~milestone [milestone name]
Returns milestone progress for any given milestone, with a link to the milestone in question.
#### ~gstatus
Returns the [current status of Github](https://status.github.com), and a message explaining the current state of affairs.
### Dependencies
* ``npm install [request](https://github.com/mikeal/request/)``
