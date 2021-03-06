var express = require('express');
var _ = require('lodash')._;
var fs = require('fs');
var Q = require('q');
var app = express();

//create a promise-compatible readfile method
var fs_readFile = Q.denodeify(fs.readFile);

app.locals._ = _;

app.set('views', __dirname+"/views");
app.set('view engine', 'jade');
app.use(express.static(__dirname, 'public'));

var team = [
	{name: 'Daniel Pollock', imgUrl: '/public/img/team/daniel.png', twitter: 'dpollock'},
	{name: 'Abby Sims', imgUrl: '/public/img/team/abby.png', twitter: 'abby_sims'},
	{name: 'James Climer', imgUrl: '/public/img/team/james.png', twitter: 'jaclimer'},
	{name: 'Paul Gower', imgUrl: '/public/img/team/paul.png', twitter: 'paulmgower'},
	{name: 'Kyle Neumeier', imgUrl: '/public/img/team/kyle.png', twitter: 'kneumei'},
	{name: 'Michael Collins', imgUrl: '/public/img/team/michael.png'},
	{name: 'Kimberly Harris', imgUrl: '/public/img/team/kimberly.png'},
	{name: 'Chris Steven', imgUrl: '/public/img/team/chris.png', twitter: 'chrissteven81'},
	//{name: 'Matt Shull', imgUrl: '/public/img/team/matt.png', twitter: 'themattshull'},
];


app.get("/programs/:year", function (req, res) {
	res.download("public/programs/program-" + req.param("year") + ".pdf", function (err) {
		if (err) {
			res.send(404);
		}
	});
});

app.get("/2014", function (req, res) {

	var speakers;

	fs_readFile('archive/2014/2014-speakers.json', 'utf8')
		.then(function(speakerData){
			speakers = JSON.parse(speakerData);
			return fs_readFile('archive/2014/2014-sponsors.json', 'utf8');
		}, console.error)
		.then(function(sponsorData){
			var sponsors = JSON.parse(sponsorData);
			res.render('2014', {speakers: speakers, sponsors: sponsors})
		}, console.error);
});

app.get('/speakers', function(req, res){
	res.render('speakers');
});

app.get('/sponsors', function(req, res){
	res.render('sponsors');
});

app.get('/', function(req, res){
	var sponsors;
	fs_readFile('sponsors.json', 'utf8')
		.then(function(sponsorData){
			sponsors = JSON.parse(sponsorData);
			return fs_readFile('speakers.json', 'utf8');
		})
		.then(function(speakerData){
			var speakers = JSON.parse(speakerData);
			res.render('index', {sponsors: sponsors, team: team, speakers:speakers});
		})
		.catch(function(e){
			console.log(e)
			res.render('500')
		})
});

var port = process.env.PORT;
if (!port) {
	port = 9990;
}
console.log("starting app on port " + port);
app.listen(port);
