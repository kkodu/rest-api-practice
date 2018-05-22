var express = require('express')
var fs = require('fs')
var bodyParser = require('body-parser')

var recipes = require('./recipes.json')
var error = require('./error.json')

var app = express()
var port = 3000

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
	console.log('request message: ' + req.method + ' ' + req.hostname + ' ' + req.url)
	res.sendFile(__dirname + '/index.html')
})

app.get('/recipes', function (req, res) {
	console.log('request message: ' + req.method + ' ' + req.hostname + ' ' + req.url)
	fs.readFile(__dirname + '/recipes.json', 'utf8', function (err, data) {
		if (err) {
			console.log(err)
		} else {
			data = JSON.parse(data)
			res.json(data)
		}
	})
})

app.get('/recipes/:food', function (req, res) {
	console.log('request message: ' + req.method + ' ' + req.hostname + ' ' + req.url)
	var food = req.params.food

	fs.readFile(__dirname + '/recipes.json', 'utf8', function (err, data) {
		if (err) {
			console.log(err)
		} else {
			data = JSON.parse(data)
			var recipe = data.find(function (rcp) {
				return rcp.food === food
			})
			if (recipe) {
				res.json(recipe)
			} else {
				res.json(error)
			} 
		}
	})
})

app.post('/recipes', function (req, res) {
	console.log('request message: ' + req.method + ' ' + req.hostname + ' ' + req.url)
	var recipe = req.body.data
	
	fs.readFile(__dirname + '/recipes.json', 'utf8', function (err, data) {
		if (err) {
			console.log(err)
		} else {
			data = JSON.parse(data)
			data.push(recipe)
			var json = JSON.stringify(data)
			fs.writeFile(__dirname + '/recipes.json', json, 'utf8', function (err) {
				if (err) console.log(err)
				res.json(recipe)
			})
		}
	})
})

app.put('/recipes/:food', function (req, res) {
	console.log('request message: ' + req.method + ' ' + req.hostname + ' ' + req.url)
	var index = req.params.food
	var recipe = req.body.data
	
	fs.readFile(__dirname + '/recipes.json', 'utf8', function (err, data) {
		if (err) {
			console.log(err)
		} else {
			data = JSON.parse(data)
			data[index] = recipe
			var json = JSON.stringify(data)
			fs.writeFile(__dirname + '/recipes.json', json, 'utf8', function (err) {
				if (err) console.log(err)
				res.json(recipe)
			})
		}
	})
})

app.delete('/recipes/:food', function (req, res) {
	console.log('request message: ' + req.method + ' ' + req.hostname + ' ' + req.url)
	var index = req.params.food

	fs.readFile(__dirname + '/recipes.json', 'utf8', function (err, data) {
		if (err) {
			console.log(err)
		} else {
			data = JSON.parse(data)
			var recipe = data[index]
			data.splice(index, 1)
			var json = JSON.stringify(data)
			fs.writeFile(__dirname + '/recipes.json', json, 'utf8', function (err) {
				if (err) console.log(err)
				res.json(recipe)
			})
		}
	})
})

app.listen(port, function () {
	console.log('Server listening port at ' + port)
})
	

