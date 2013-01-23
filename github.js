/**
 * Module Name: Link
 * Description: Stores recent channel links, with commands to retrieve
 * information about links.
 */
var request = require('request'),
    _ = require('underscore')._;

var github = function(dbot) {
	var baseURI = "http://api.github.com/";
    var commands = {
        '~repocount': function(event) {
			// TODO: add handling for non existent user
            var reqUrl = "https://api.github.com/users/" + event.params[1] + "/repos";
            request(reqUrl, function(error, response, body) {
                var result = JSON.parse(body);
				event.reply(dbot.t('repocount',{'user': event.params[1], 'count' : result.length}
            });
        }
    };
    this.commands = commands;

    this.on = 'PRIVMSG';
};

exports.fetch = function(dbot) {
    return new github(dbot);
};
