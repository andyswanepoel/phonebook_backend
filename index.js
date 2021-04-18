const { request, response } = require('express');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express()

app.use(express.json());
app.use(cors());

// Create new token named 'body'
// Returns stringified request body
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`));

let persons = [
	{
		id: 0,
		name: "Arto Hellas",
		number: "040-123456"
	},
	{
		id: 1,
		name: "Ada Lovelace",
		number: "39-44-5325235"
	},
	{
		id: 2,
		name: "Dan Abramov",
		number: "12-43-234345"
	},
	{
		id: 3,
		name: "Mary Poppendick",
		number: "39-24-543654"
	}
]

app.get("/", (request, response) => {
	response.send("<h1>Phonebook App</h1>");
})

app.get("/info", (request, response) => {
	const body = `<p>Phone book has info for ${persons.length} people.</p>
	<p>${new Date()}</p>`
	response.send(body);
})

app.get("/api/persons", (request, response) => {
	response.json(persons);
})

function generateId(max) {
	return Math.floor(Math.random() * Math.floor(max));
  }

app.post("/api/persons", (request, response) => {
	const body = request.body;

	if (!body.name) {
		return response.status(400).json({
			error: 'name is  missing'
		})
	}

	if (!body.number) {
		return response.status(400).json({
			error: 'number is  missing'
		})
	}

	if (persons.find(p => p.name === body.name)) {
		return response.status(400).json({
			error: `Entry already exists from ${body.name}`
		})
	}

	const person = {
		id: generateId(5000),
		name: body.name,
		number: body.number
 	}

	persons = persons.concat(person);

	response.json(person)
})

app.get("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find(p => p.id === id);
	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
})

app.delete("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter(p => p.id !== id);

	response.status(204).end();
})

const PORT = process.env.PORT || 3001;
app.listen(PORT), () => {
	console.log(`Server is running on ${PORT}`);
};