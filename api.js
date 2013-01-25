var request = require('request'),
    _ = require('underscore')._;

var api = function(dbot) {
    return {
        'shortenURI': function(link) {
            request({method: 'POST', uri: 'http://git.io',  form:{url: link}}, function(error, response, body){
                shortened = response.headers["location"];
            });
            return shortened;
        }
    };
};

exports.fetch = function(dbot) {
    return api(dbot);
};
