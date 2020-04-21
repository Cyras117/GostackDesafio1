const express = require("express");
const cors = require("cors");
const {uuid,isUuid} = require('uuidv4');

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function vid(request,response,next){
  const{id} = request.params;
  if(!isUuid(id)){
    return response.status(400).json({error:'Invalid ID'});
  }
  next();
}

app.get("/",(request,response)=>{
   return response.json('Home!');
});

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title,url,techs} = request.body;
  const repositorie = {
    id : uuid(),
    title,
    url,
    techs,
    likes:0
  }

  repositories.push(repositorie);

  return response.status(200).json(repositorie);
});

app.put("/repositories/:id", vid,(request, response) => {
    const {id} = request.params;
    const {title,url,techs} = request.body;

    const cindex = repositories.findIndex(r => r.id === id );
    if(cindex < 0 ){
      return response.status(400).json('{error:Repositorio nao encontrado');
    }

    const rep = {
      id,
      title,
      url,
      techs,
      likes: repositories[cindex].likes
    }

    repositories[cindex] = rep;

    return response.json(repositories[cindex]);

});

app.delete("/repositories/:id", vid,(request, response) => {
  const {id} = request.params;

  const rindex = repositories.findIndex(r => r.id === id);
  if(rindex < 0){
    return response.status(400).json('Repositorio Não encontrado');
  }
  repositories.splice(rindex,1);

  return response.status(204).send();
});

app.post("/repositories/:id/like",vid, (request, response) => {
    const {id} = request.params;
    
    const rid = repositories.findIndex(r => r.id === id);
    if(rid < 0){
      return response.status(400).json('Repositorio Não encontrado');
    }

    repositories[rid].likes += 1;

    return response.status(200).json(repositories[rid]);
});

module.exports = app;
