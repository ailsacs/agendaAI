const path = require("path");
const { webhookClient } = require("dialogflow-fulfillment");
const http = require("http");
const https = require("https");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const axios = require("axios");
const express = require("express");
const app = express();
const { dialogflowfulfillment } = require("dialogflow-fulfillment");
require("dotenv").config();
const { JWT } = require("google-auth-library");
const port = process.env.PORT || 1988;

http.createServer(app).listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({ 
    extended: true })
);
app.use(express.static("public"));


app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

let date = new Date();
let data = date.toLocaleString("pt-BR", {
  timeZone: "America/Sao_Paulo",
  hour: "numeric",
  hour12: false,
});



//Dados do ID da conta e agenda
const serviceAccountAuth = new google.auth.JWT({
  email: process.env.client_email,
  key: process.env.private_key,
  scopes: ["https:www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar("v3");
process.env.DEBUG = "dialogflow:*"; //enables lib debugging statements

const timeZone = "America/Sao_Paulo";
const timeZoneOffset = "-03:00";

//http://expressjs.com/en/starter/basic-routing.html

app.post("/escolavencersempre", function (request, response) {
  const agent = new webhookClient({
    request: request,
    response: response,
  });
});

const { WebhookClient } = require("dialogflow-fulfillment");
const intentMap = new Map();
intentMap.set("agendamento", agendamento);
intentMap.set("deafault Welcome intent", welcome);
/*app.post("/escolavencersempre", function (request, response) {
  webhookClient.handleRequest(request, response, intentMap);
});

/*

*/
//FUNÇÃO DE SALDAÇÃO AVANÇADA
function welcome(agent) {
    agent.add(
      "Olá!" +
        "\n" +
        "\n" +
        "Sou o Gregório, assistente de agendamento de materiais audio-visuais da Escola Vencer Sempre. " +
        "\n" +
        "\n" +
        "Para continuar, você deve fazer parte do grupo docente da instituição! Deseja realizar um agendamento?"
    );
}

//FUNÇÃO PARA ISERIR UNIQUE-ID
function uniqueID() {
  function chr4() {
    return Math.random().toString(16).slice(-6);
  }
  return chr4();
}

//PESQUISA CADASTRO
function consulta(agent) {
  const { name, emailid, job } = agent.parameters;
  const data = [
    {
      Nome: name,
      Email: emailid,
      job: job,
      ID: uniqueID()      
    }
  ];

  return axios
    .get("https://sheet.best/api/sheets/0c238072-da31-4de4-beca-0ec1fb8adb2e")
    .then((res) => {
      res.data.map((coluna) => {
        if (coluna.emailid === emailid)
          app.get.response.json({
            fulfillmentText:
              "muito bem " +
              coluna.nome +
              "\n" +
              "Para continuar digite *agendamento*.",
          });
      });
    });
}
//var response = JSON.parse(JSON.response);
app.post("/", express.json(), (request, response) => {
  let name = app.get.request.body.queryResult.parameters["nome"];
  let emailid = app.get.request.body.queryResult.parameters["email"];
  let job = app.get.request.body.quesryResult.parameters["jcargo"];
  let phone = app.get.request.body.queryResult.parameters["phone"];
  let item = app.get.request.body.queryResult.parameters["item"];
  let where = app.get.request.body.queryResult.parameters["where"];
  let dateTimeStart = app.get.request.body.queryResult.parameters["dateTimeStart"];
  let dateTimeEnd = app.get.request.body.queryResult.parameters["dateTimeEnd"];
});

function agendamento(agent) {
  const dateTimeStart = new Date(
    Date.parse(
      agent.parameters.dia.split("T")[0] +
        "T" +
        agent.parameters.dateTimeStart.split("T")[1].split("-")[0] +
        timeZoneOffset
    )
  );
  const dateTimeEnd = new Date(
    new Date(dateTimeStart).setHours(
      agent.parameters.dateTimeEnd.split("T")[1].split("-")[0] + timeZoneOffset
    )
  );
  const agendamento = dateTimeStart.toLocalString("pt-br", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    timeZone: timeZone,
  });
  const agenda_atual =
    "https://calendar.google.com/calendar/embed?src=f660b4d886e1702b71a01efdfb5e848ffab2b9c976e99c2f34c34f7bc053d51d%40group.calendar.google.com&ctz=America%2FSao_Paulo";
  const nossa_agenda = agenda_atual;

  //CHECK THE AVAILIBILITY OF THE TIME, AND AN APPOINTMENT IF THERE IS TIME ON THE CALENDAR
  return JSON.response
    .createCalendarEvent(
      app.get.dateTimeStart,
      app.get.dateTimeEnd,
      app.get.name,
      app.get.job,
      app.get.phone,
      app.get.where,
      app.get.item
    )

    .then(() => {
      agent.add(
        'ok, seu agendamento foi marcado para ${agendamento} Se estiver correto digite *ok!*.'
      );
    })
    .catch(() => {
      agent.add(
        "Ops, esse horário já foi reservad. Acesse o calendário para escolher outra agenda de uso. ${nossa_agenda} "
      );
    });
}

//MAPEAMENTO DAS INTENTS DO DIALOGFLOW
/*
intentMap.set("agendamento", agendamento);
intentMap.set("deafault Welcome intent", welcome);
process.agent.handRequest(intentMap);
*/

function creatCalendarEvent(
  dateTimeStart,
  dateTimeEnd,
  nome,
  job,
  phone,
  item,
  where
) {
  return new Promise((resolve, reject) => {
    calendar.events.list(
      {
        auth: serviceAccountAuth, //LIST EVENTS FOR TIME PREIOD
        calendarId: process.env.calendarId,
        timeMin: dateTimeStart.toISOString(),
        timeMax: dateTimeEnd.toISOString(),
      },
      (err, calendarResponse) => {
        //CHECK IF THER IS A EVENT ALREADY ON THE CALENDAR
        if (err || calendarResponse.data.items.length > 0) {
          reject(
            err ||
              new Error(
                "O tempo solicitado está em conflitocom outro compromisso"
              )
          );
        } else {
          //CREATE EVENT FOR THE REQUESTED TIME PERIOD
          calendar.events.insert({
            auth: serviceAccountAuth,
            calendarId: process.env.calendarId,
            resource: {
              sumary: {item} + " na " + {where} + "Agendado!",
              description: {job} + " " + {name} + " Telefone: " + {phone},
              start: { dateTime: dateTimeStart },
              end: { dataTime: dateTimeEnd },
            },
          });
        }
      }
    );
});
    
    
   

  fastify.listen(
    { port: process.env.PORT, host: "0.0.0.0" },
    function (err, address) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Your app is listening on ${address}`);
    }
);


