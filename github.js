/**
 * Module Name: Github 
 * Description: Retrieves interesting Github information
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
			event.reply(event.params[1] + " has " + result.length + " public repositories.");
        //        event.reply(dbot.t('repocount',{'user': event.params[1], 'count' : result.length}));
            });
        },
        '~repo': function(event) {
            var repo = "";
            if (typeof event.params[1] == 'undefined') {
            //    repo = dbot.config.github.defaultrepo;
                repo = "reality/depressionbot";
            } else {
                repo = event.params[1];
            }

            var reqUrl = "https://api.github.com/";
            reqUrl += "repos/" + repo;

            request(reqUrl, function(error, response, body) {
                var data = JSON.parse(body);
                var str = "";
                str += data["name"] + " is a ";
                if (data["fork"] == true) {
                    str += "forked ";
                }
                str += data["language"];
                str += " repo with ";
                str += data["open_issues"] + " unresolved issues. ";
                str += "[" + data["forks"] + "F " + data["watchers"] + "W]";
                
                event.reply(str);
            });
        }
    };
    this.commands = commands;

    this.on = 'PRIVMSG';
};

exports.fetch = function(dbot) {
    return new github(dbot);
};
