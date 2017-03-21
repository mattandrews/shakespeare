var parseString = require('xml2js').parseString;
var fs = require('fs');
var util = require('util');
var _ = require('lodash');


var filename = './macbeth.xml';
var speakerToShow = 'MACBETH';

var cleanupLine = function (str) {
    str = _.replace(str, "\n", "");
    str = _.replace(str, "\'", "'");
    str = str.replace(/\s+/g, ' ').trim();
    return str;
};

fs.readFile(filename, 'utf8', function (err, data) {
    if (err) throw err;
    parseString(data, function (err, result) {
        var allSpeech = parseSpeech(result);
        var macbethSpeech = filterBySpeaker(allSpeech, speakerToShow).map(s => {
            var line = s.LINE[0];
            // some lines contain stage directions
            if (_.isObject(line)) { line = line._; }
            return cleanupLine(line);
        });
        logObj(macbethSpeech);
    });
});

var parseSpeech = function (playData) {
    var scenes = playData.PLAY.ACT.map(a => a.SCENE.map(s => s.SPEECH));
    var deep = _.flattenDeep(scenes);
    return deep;
};

var filterBySpeaker = function (speeches, speaker) {
    return speeches.filter(s => s.SPEAKER.indexOf(speaker) !== -1);
};

var logObj = function (obj) { console.log(util.inspect(obj, false, null)); };
