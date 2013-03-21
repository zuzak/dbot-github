/**
 * Module Name: Github 
 * Description: Retrieves interesting Github information
 */
var request = require('request'),
    _ = require('underscore')._,
    exec = require('child_process').exec;

var github = function(dbot) {
    var commands = {
        '~repocount': function(event) {
            if(_.isUndefined(event.params[1])) {
                return;
            }
            var reqUrl = "https://api.github.com/users/" + event.params[1] + "/repos";
            request(reqUrl, function(error, response, body) {
                if(response.statusCode == "200") {
                    var result = JSON.parse(body);
                    if(!_.isUndefined(result.length)) {
                        event.reply(dbot.t("repocount",{"user": event.params[1], "count": result.length}));
                        return;
                    }
                }

                event.reply(dbot.t("usernotfound"));
           });
        },
        '~repo': function(event) {
            var repo = event.params[1];
            if (typeof repo == 'undefined') {
                repo = dbot.config.github.defaultrepo;
            }

            var reqUrl = "https://api.github.com/";
            reqUrl += "repos/" + repo;
            request(reqUrl, function(error, response, body) {

                var data = JSON.parse(body);
                if(!(_.has(data, "fork") && _.has(data, "open_issues") && _.has(data, "forks") && _.has(data, "watchers"))) {
                    event.reply(dbot.t("reponotfound"));
                    return;
                }
                if (data["fork"] == true) {
                   event.reply(dbot.t("forkedrepo",data)); 
                } else {
                    event.reply(dbot.t("unforkedrepo",data));
                }
                // TODO: move this shizz into an api call
                var longurl = "http://github.com/" + repo;
                request({method: 'POST', uri: 'http://git.io', form:{url: longurl}}, function(error, response, body){
                    event.reply(dbot.t('location')+" "+response.headers["location"]);
                });
            });
        }, 
        '~gstatus': function(event) {
            var reqUrl = "https://status.github.com/api/last-message.json";
            request(reqUrl, function(error,response,body){
                var data = JSON.parse(body);
                event.reply(dbot.t("status"+data["status"]));
                event.reply(data["body"]);
            });
        },
        '~milestone': function(event) {
            var repo = dbot.config.github.defaultrepo; 
            var name = event.params[1];
            if (event.params[2]){
                repo = name;
                name = event.params[2];
            }
            var reqUrl = "https://api.github.com/repos/";
            reqUrl += repo + "/milestones";

            request(reqUrl, function(error, response, body) {
                var data = JSON.parse(body);
                for (var section in data) {
                    var milestone = data[section];
                    if (milestone["title"] == name){
                        var str = "Milestone " + milestone["title"];
                        var progress = milestone["closed_issues"] / (milestone["open_issues"] + milestone["closed_issues"]);
                        progress = Math.round(progress*100);
                        var bar = "[";
                        for (var i = 10; i < 100; i += 10) {
                            if  ((progress/i) > 1) {
                                bar += "█";
                            } else {
                                bar += " ";
                            }
                        }
                        bar += "]";
                        str += " is " + bar + progress + "% complete";

                        var longurl = "http://github.com/" + repo + "/issues?milestone=" + milestone["number"];
                        request({method: 'POST', uri: 'http://git.io', form:{url: longurl}}, function(error, response, body){
                            event.reply(response.headers["location"]);
                        });
                        event.reply(str);
                        break;
                    }
                }
           });
        }, 
        '~repocount': function(event) {
        // TODO: add handling for non existent user
            var reqUrl = "https://api.github.com/users/" + event.params[1] + "/repos";
            request(reqUrl, function(error, response, body) {
            var result = JSON.parse(body);
			event.reply(event.params[1] + " has " + result.length + " public repositories.");
            });
        },
        '~issue': function(event) {
            var repo;
            var issue;
            if (isNaN(event.params[1]) && event.params[1]){ // if ~issue foo/bar
                repo = event.params[1];
                issue = event.params[2];
            } else {
                repo = dbot.config.github.defaultrepo;
                issue = event.params[1];
            }

            if (!issue) { // issue is undefined
                issue = "";
            } else {
                issue = "/" + issue; // got to be a better way
            }
            
            var reqUrl = "https://api.github.com/repos/" + repo + "/issues" + issue + "?sort=" + dbot.config.github.sortorder;
            console.log(reqUrl);
            request(reqUrl, function(error,response, body) {
                if (response.statusCode == "200") {
                    var data = JSON.parse(body);
                    if (issue == ""){
                        data = data[0];
                        console.log(data);
                    }
                    if (_.isUndefined(data)) {
                        event.reply(dbot.t('issuenotfound'));
                        return
                    }
                    if (data["pull_request"]["html_url"] != null){
                        console.log(data["pull_request"]["html_url"]);
                        data["pull_request"] = " with code";
                    } else {
                        data["pull_request"] = "";
                    }
                    if (data["state"]=="open") {
                        data["state"] = "\u000303" + data["state"];
                    } else {
                        data["state"] = "\u000304" + data["state"];
                    }
                    var labels = "";
                    for (var i=0; i < data["labels"].length; i++) { // for-in doesn't like me
                        var color = "\u0003" + (parseInt(data["labels"][i]["color"],16) % 15);
                        labels += " " + color + data["labels"][i]["name"];
                    }
                    data["label"] = labels;
                    event.reply(dbot.t("issue",data));
                    event.reply(data["html_url"]);
                } else {
                    event.reply(dbot.t("issuenotfound"));
                }
            });
       },
       '~commits': function(event) {
            exec("git rev-list --all | wc -l", function(error, stdout, stderr) {
                stdout = stdout.trim();
                request("http://numbersapi.com/" + stdout + "?fragment&default=XXX", function(error, response, body){
                    if (body != "XXX"){
                        event.reply(dbot.t("commitcountfun",{"fact": body, "count": stdout}));
                    } else {
                        // nothing fun about the number, let's try the year
                        request("http://numbersapi.com/" + stdout + "/year?fragment&default=XXX", function(error, response, body){
                            if (body != "XXX"){
                                event.reply(dbot.t("commitcountyear",{"fact": body, "count": stdout}));
                            } else {
                                event.reply(dbot.t("commitcountboring",{"count": stdout}));
                            }
                        });
                    }
               });
            });
        }
    };
    this.commands = commands;

    this.on = 'PRIVMSG';
};

exports.fetch = function(dbot) {
    return new github(dbot);
};
