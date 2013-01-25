/**
 * Module Name: Github 
 * Description: Retrieves interesting Github information
 */
var request = require('request'),
    _ = require('underscore')._;

var github = function(dbot) {
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
                repo = dbot.config.github.defaultrepo;
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
        },
        '~gstatus': function(event) {
            var reqUrl = "https://status.github.com/api/last-message.json";
            request(reqUrl, function(error,response,body){
                var data = JSON.parse(body);
                var str;
                switch(data["status"]){
                    case "good":
                        str = "\u000309Shit's good:";
                        break;
                    case "minor":
                        str = "\u000308Shit's touchy:";
                        break;
                    case "major":
                        str = "\u000304Shit's fucked:";
                        break;
                    default:
                        str = "https://status.github.com";
                        break;
                }
                event.reply(str);
                event.reply(data["body"]);
            });
        },
        '~milestone': function(event) {
            var repo = dbot.config.github.defaultrepo; 
            var reqUrl = "https://api.github.com/repos/";
            reqUrl += repo + "/milestones";

            request(reqUrl, function(error, response, body) {
                var data = JSON.parse(body);
                for (var section in data) {
                    var milestone = data[section];
                    if (milestone["title"] == event.params[1]){
                        var str = "Milestone " + milestone["title"];
                        var progress = milestone["closed_issues"] / (milestone["open_issues"] + milestone["closed_issues"]);
                        progress = Math.round(progress*100);
                        var bar = "[";
                        for (var i = 1; i < 10; i++) {
                            if  ((progress / (i*10)) > 1) {
                                bar += "█";
                            } else {
                                bar += " ";
                            }
                        }
                        bar += "]";
                        str += " is " + bar + progress + "% complete";

                        // in here 'cos I can't get the API working
                        var longurl = "http://github.com/" + repo + "/issues?milestone=" + milestone["number"];
                        request({method: 'POST', uri: 'http://git.io', form:{url: longurl}}, function(error, response, body){
                            event.reply(response.headers["location"]);
                        });
                    //    str += " https://github.com/" + repo + "/issues?milestone=" + milestone["number"];
                        event.reply(str);
                        break;
                    }
                }
           });
       }, 
    };
    this.commands = commands;

    this.on = 'PRIVMSG';
};

exports.fetch = function(dbot) {
    return new github(dbot);
};
