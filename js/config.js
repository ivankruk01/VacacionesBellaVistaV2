const BIN_ID = "6abd1918ffd5d160533f46f2";
const MASTER_KEY = "$2a$10$RBYWKS9nR5ypehogRtWvSu1/R1qEQAlA8VtN9iQUynH5fzC3czXUK";
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// CONFIGURACIÓN EMAILJS
const EMAILJS_PUBLIC_KEY = "lNrom6fz8aCfUhH_i";
const EMAILJS_TEMPLATE_ID = "template_ybyll0o";
const EMAILJS_SERVICE_ID = "service_nyvfvps";

const MES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];

const SEED = {
  u: 20, y: 2026,
  alertEmails: "",
  users: [{ u: "kruki", p: "", r: "admin" }],
  logs: [],
  d: ["Bella Vista"],
  o: [
    { n: "Bella Vista", d: "Bella Vista" },
    { n: "Hurlingham", d: "Bella Vista" },
    { n: "Jose C Paz", d: "Bella Vista" },
    { n: "Los Polvorines", d: "Bella Vista" },
    { n: "San Miguel", d: "Bella Vista" },
    { n: "Trujui", d: "Bella Vista" },
    { n: "Pilar", d: "Bella Vista" }
  ],
  t: [
    {"id":1,"n":"AVELLANEDA, PABLO SEBASTIAN","o":"Bella Vista","w":[]},
    {"id":2,"n":"BELMONTE, JAVIER LEANDRO","o":"Bella Vista","w":[]},
    {"id":3,"n":"CABRAL, CARLOS EZEQUIEL","o":"Bella Vista","w":["2026-07-20"]},
    {"id":4,"n":"RIVAROLA, RUBEN ALBERTO","o":"Hurlingham","w":["2026-04-06","2026-04-13"]},
    {"id":5,"n":"CUENCA, LUIS DAVID","o":"Hurlingham","w":["2026-07-20","2026-08-24"]},
    {"id":6,"n":"ESPOSITO, MATIAS ALEJANDRO","o":"Hurlingham","w":["2026-05-18","2026-07-13"]},
    {"id":7,"n":"FARIÑA, MATIAS","o":"Hurlingham","w":["2026-04-13","2026-04-20","2026-06-15","2026-08-31"]},
    {"id":8,"n":"SARRA, CRISTIAN DAMIAN","o":"Hurlingham","w":["2026-07-27"]},
    {"id":9,"n":"GALEANO, MAURICIO RAUL","o":"Hurlingham","w":["2026-04-13","2026-05-25","2026-07-27"]},
    {"id":10,"n":"DIAZ, ROBERTO MARTIN","o":"Jose C Paz","w":["2026-04-06","2026-04-13"]},
    {"id":11,"n":"DRAGHI, LUCIANO MARTIN","o":"Jose C Paz","w":[]},
    {"id":12,"n":"KRUPPA, ADRIAN MAXIMILIANO","o":"Jose C Paz","w":["2026-12-21"]},
    {"id":13,"n":"LARROSA, GONZALO EZEQUIEL","o":"Jose C Paz","w":[]},
    {"id":14,"n":"BENITEZ, MIGUEL","o":"Jose C Paz","w":[]},
    {"id":15,"n":"CREVATIN, ALEX LEONEL","o":"Jose C Paz","w":[]},
    {"id":16,"n":"D´AURIA, ENZO ALEJANDRO","o":"Jose C Paz","w":[]},
    {"id":17,"n":"CAROSIO, SEBASTIAN","o":"Jose C Paz","w":[]},
    {"id":18,"n":"NACHAR, CARLOS","o":"Los Polvorines","w":[]},
    {"id":19,"n":"STIBEL MARIO","o":"Los Polvorines","w":[]},
    {"id":20,"n":"SERRANO GERMAN","o":"Los Polvorines","w":[]},
    {"id":21,"n":"PAGANELLI, ARIEL HERNAN","o":"Los Polvorines","w":[]},
    {"id":22,"n":"NOVO, RODRIGO EZEQUIEL","o":"Los Polvorines","w":[]},
    {"id":23,"n":"MAIDANA, LUIS HORACIO","o":"Los Polvorines","w":["2026-04-06"]},
    {"id":24,"n":"ESVER, RAUL ISAAC","o":"San Miguel","w":["2026-04-06","2026-09-28"]},
    {"id":25,"n":"VAZQUEZ, ANDRES GABRIEL","o":"San Miguel","w":["2026-08-24"]},
    {"id":26,"n":"GALARZA, JORGE LUIS","o":"San Miguel","w":["2026-05-18","2026-06-15","2026-10-19"]},
    {"id":27,"n":"PALACIOS, MAURICIO","o":"San Miguel","w":["2026-04-13","2026-07-20","2026-09-21"]},
    {"id":28,"n":"ACOSTA, GUSTAVO ALEJANDRO","o":"San Miguel","w":["2026-08-03","2026-08-10","2026-08-17"]},
    {"id":29,"n":"MEDINA, CLAUDIO ANDRES","o":"San Miguel","w":["2026-06-08"]},
    {"id":30,"n":"TORRES, LEONARDO DANIEL","o":"San Miguel","w":["2026-10-05"]},
    {"id":31,"n":"PEREZ, FERNANDO GABRIEL","o":"San Miguel","w":["2026-03-23","2026-03-30","2026-05-25","2026-07-27"]},
    {"id":32,"n":"PAREDES, DIEGO NICASIO","o":"Trujui","w":["2026-04-06","2026-08-17"]},
    {"id":33,"n":"CAMIÑA, HORACIO","o":"Trujui","w":[]},
    {"id":34,"n":"PIRELLO, JULIO","o":"Trujui","w":[]},
    {"id":35,"n":"LESSERTESEUR, PABLO","o":"Trujui","w":[]},
    {"id":36,"n":"ALVAREZ, MATIAS","o":"Trujui","w":[]},
    {"id":37,"n":"VEISAGA, CARLOS MARTIN","o":"Trujui","w":[]},
    {"id":38,"n":"COMPTA, DIEGO CRISTIAN JORGE","o":"Trujui","w":[]},
    {"id":39,"n":"LASSALLE, PABLO","o":"Pilar","w":["2026-06-01","2026-06-08","2026-09-14"]},
    {"id":40,"n":"RAGES, MARCELO OMAR","o":"Pilar","w":["2026-04-06","2026-04-13","2026-08-10"]},
    {"id":41,"n":"MAIDANA, FACUNDO EMILIANO","o":"Pilar","w":["2026-05-04","2026-05-11","2026-09-21","2026-09-28"]},
    {"id":42,"n":"ANRIQUEZ, JAIRO","o":"Pilar","w":["2026-10-12"]},
    {"id":43,"n":"SERRANO, FELIPE","o":"Pilar","w":["2026-06-15","2026-07-13","2026-07-20"]},
    {"id":44,"n":"VAZQUEZ, MARTIN ALEJANDRO","o":"Pilar","w":["2026-05-25","2026-06-15","2026-10-26","2026-11-02"]},
    {"id":45,"n":"PAGANELLI, ARIEL HERNAN","o":"Pilar","w":["2026-07-27","2026-08-03"]}
  ]
};