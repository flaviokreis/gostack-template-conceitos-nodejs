const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title 
      ? repositories.filter(repository => repository.title.includes(title))
      : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body; 

  const index = repositories.findIndex(repository => repository.id === id);

  if (index < 0) {
      return response.status(400).json({ "error": "Repository not found." });
  }

  const repository = repositories[index];
  
  const newRepository = { ...repository, title, url, techs };

  repositories[index] = newRepository;

  return response.json(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repository => repository.id === id);

  if (index < 0) {
      return response.status(400).json({ "error": "Repository not found." });
  }

  repositories.splice(index, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repository => repository.id === id);

  if (index < 0) {
      return response.status(400).json({ "error": "Project not found." });
  }

  const repository = repositories[index];
  
  const likes = repository.likes + 1;
  const newRepository = { ...repository, likes };

  repositories[index] = newRepository;

  return response.json(newRepository);
});

module.exports = app;
