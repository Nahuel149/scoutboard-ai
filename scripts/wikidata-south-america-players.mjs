import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const endpoint = "https://query.wikidata.org/sparql";
const entitySearchEndpoint = "https://www.wikidata.org/w/api.php";
const englishWikipediaEndpoint = "https://en.wikipedia.org/w/api.php";
const userAgent = "ScoutBoardAI/0.1 (portfolio import; https://github.com/Nahuel149/scoutboard-ai)";
const defaultLimit = 50;

const southAmericaCountries = [
  "Q414", // Argentina
  "Q155", // Brazil
  "Q77", // Uruguay
  "Q298", // Chile
  "Q739", // Colombia
  "Q419", // Peru
  "Q736", // Ecuador
  "Q733", // Paraguay
  "Q750", // Bolivia
  "Q717", // Venezuela
  "Q734", // Guyana
  "Q730", // Suriname
];

const countryAliases = {
  argentina: "Q414",
  brazil: "Q155",
  brasil: "Q155",
  uruguay: "Q77",
  chile: "Q298",
  colombia: "Q739",
  peru: "Q419",
  ecuador: "Q736",
  paraguay: "Q733",
  bolivia: "Q750",
  venezuela: "Q717",
  guyana: "Q734",
  suriname: "Q730",
};

const countrySearchTerms = {
  Q414: ["Argentina footballer", "Argentine football player", "futbolista argentino"],
  Q155: ["Brazil footballer", "Brazilian football player", "futbolista brasileño"],
  Q77: ["Uruguay footballer", "Uruguayan football player", "futbolista uruguayo"],
  Q298: ["Chile footballer", "Chilean football player", "futbolista chileno"],
  Q739: ["Colombia footballer", "Colombian football player", "futbolista colombiano"],
  Q419: ["Peru footballer", "Peruvian football player", "futbolista peruano"],
  Q736: ["Ecuador footballer", "Ecuadorian football player", "futbolista ecuatoriano"],
  Q733: ["Paraguay footballer", "Paraguayan football player", "futbolista paraguayo"],
  Q750: ["Bolivia footballer", "Bolivian football player", "futbolista boliviano"],
  Q717: ["Venezuela footballer", "Venezuelan football player", "futbolista venezolano"],
  Q734: ["Guyana footballer", "Guyanese football player"],
  Q730: ["Suriname footballer", "Surinamese football player"],
};

const countryWikipediaCategories = {
  Q414: "Category:Argentine men's footballers",
  Q155: "Category:Brazilian men's footballers",
  Q77: "Category:Uruguayan men's footballers",
  Q298: "Category:Chilean men's footballers",
  Q739: "Category:Colombian men's footballers",
  Q419: "Category:Peruvian men's footballers",
  Q736: "Category:Ecuadorian men's footballers",
  Q733: "Category:Paraguayan men's footballers",
  Q750: "Category:Bolivian men's footballers",
  Q717: "Category:Venezuelan men's footballers",
  Q734: "Category:Guyanese footballers",
  Q730: "Category:Surinamese footballers",
};

const argentinaFirstDivision2026Clubs = [
  { id: "Q971490", name: "Club Atlético Aldosivi" },
  { id: "Q220621", name: "Asociación Atlética Argentinos Juniors" },
  { id: "Q757470", name: "Club Atlético Tucumán" },
  { id: "Q692646", name: "Club Atlético Banfield" },
  { id: "Q2469894", name: "Club Atlético Barracas Central" },
  { id: "Q59962", name: "Club Atlético Belgrano" },
  { id: "Q170703", name: "Club Atlético Boca Juniors" },
  { id: "Q5060684", name: "Club Atlético Central Córdoba" },
  { id: "Q1024338", name: "Club Social y Deportivo Defensa y Justicia" },
  { id: "Q4382304", name: "Club Deportivo Riestra" },
  { id: "Q214940", name: "Club Estudiantes de La Plata" },
  { id: "Q8206935", name: "Asociación Atlética Estudiantes" },
  { id: "Q18640", name: "Club de Gimnasia y Esgrima La Plata" },
  { id: "Q2707037", name: "Club Atlético Gimnasia y Esgrima" },
  { id: "Q327172", name: "Club Atlético Huracán" },
  { id: "Q214978", name: "Club Atlético Independiente" },
  { id: "Q2454482", name: "Club Sportivo Independiente Rivadavia" },
  { id: "Q1421829", name: "Instituto Atlético Central Córdoba" },
  { id: "Q324589", name: "Club Atlético Lanús" },
  { id: "Q221882", name: "Club Atlético Newell's Old Boys" },
  { id: "Q151907", name: "Club Atlético Platense" },
  { id: "Q276533", name: "Racing Club" },
  { id: "Q15799", name: "Club Atlético River Plate" },
  { id: "Q318307", name: "Club Atlético Rosario Central" },
  { id: "Q218282", name: "Club Atlético San Lorenzo de Almagro" },
  { id: "Q519966", name: "Club Atlético Sarmiento" },
  { id: "Q1022939", name: "Club Atlético Talleres" },
  { id: "Q80886", name: "Club Atlético Tigre" },
  { id: "Q80899", name: "Club Atlético Unión" },
  { id: "Q215163", name: "Club Atlético Vélez Sarsfield" },
];

const brazilFirstDivision2026Clubs = [
  { id: "Q506832", name: "Club Athletico Paranaense" },
  { id: "Q270995", name: "Clube Atlético Mineiro" },
  { id: "Q198032", name: "Esporte Clube Bahia" },
  { id: "Q80958", name: "Botafogo de Futebol e Regatas" },
  { id: "Q2536715", name: "Associação Chapecoense de Futebol" },
  { id: "Q35933", name: "Sport Club Corinthians Paulista" },
  { id: "Q478317", name: "Coritiba Foot Ball Club" },
  { id: "Q188277", name: "Cruzeiro Esporte Clube" },
  { id: "Q17479", name: "Clube de Regatas do Flamengo" },
  { id: "Q80987", name: "Fluminense Football Club" },
  { id: "Q221695", name: "Grêmio Foot-Ball Porto Alegrense" },
  { id: "Q80845", name: "Sport Club Internacional" },
  { id: "Q2622870", name: "Mirassol Futebol Clube" },
  { id: "Q80964", name: "Sociedade Esportiva Palmeiras" },
  { id: "Q541744", name: "Red Bull Bragantino" },
  { id: "Q2552872", name: "Clube do Remo" },
  { id: "Q80955", name: "Santos Futebol Clube" },
  { id: "Q38568", name: "São Paulo Futebol Clube" },
  { id: "Q5014111", name: "Club de Regatas Vasco da Gama" },
  { id: "Q274465", name: "Esporte Clube Vitória" },
];

const chileFirstDivision2026Clubs = [
  { id: "Q758689", name: "Audax Italiano" },
  { id: "Q642669", name: "Cobresal" },
  { id: "Q207373", name: "Club Social y Deportivo Colo Colo" },
  { id: "Q2407595", name: "Coquimbo Unido" },
  { id: "Q2317166", name: "Club Deportes Concepción" },
  { id: "Q642098", name: "Club Deportes La Serena" },
  { id: "Q105144613", name: "Club de Deportes Limache" },
  { id: "Q1103684", name: "Everton de Viña del Mar" },
  { id: "Q1023191", name: "Club Deportivo Huachipato" },
  { id: "Q2317539", name: "Club Deportivo Ñublense" },
  { id: "Q719722", name: "O'Higgins F.C." },
  { id: "Q719719", name: "Club Deportivo Palestino" },
  { id: "Q719383", name: "Unión La Calera" },
  { id: "Q427446", name: "Club Deportivo Universidad Católica" },
  { id: "Q737753", name: "Club Universidad de Chile" },
  { id: "Q721560", name: "Club Deportivo Universidad de Concepción" },
];

const uruguayFirstDivision2026Clubs = [
  { id: "Q568435", name: "Albion F.C." },
  { id: "Q1022910", name: "Boston River" },
  { id: "Q1053786", name: "Central Espanol F.C." },
  { id: "Q719344", name: "C.A. Cerro" },
  { id: "Q1055895", name: "Cerro Largo F.C." },
  { id: "Q584316", name: "Danubio F.C." },
  { id: "Q844238", name: "Defensor Sporting Club" },
  { id: "Q1023199", name: "Deportivo Maldonado" },
  { id: "Q217644", name: "Juventud de Las Piedras" },
  { id: "Q1131189", name: "Liverpool F.C. Montevideo" },
  { id: "Q48646", name: "Montevideo City Torque" },
  { id: "Q872702", name: "Montevideo Wanderers F.C." },
  { id: "Q499616", name: "Club Nacional de Football" },
  { id: "Q16320", name: "Club Atletico Penarol" },
  { id: "Q420106", name: "C.A. Progreso" },
  { id: "Q1417183", name: "Racing Club de Montevideo" },
];

const colombiaFirstDivision2026Clubs = [
  { id: "Q332833", name: "Aguilas Doradas" },
  { id: "Q952393", name: "Alianza F.C." },
  { id: "Q391987", name: "America de Cali" },
  { id: "Q757418", name: "Atletico Bucaramanga" },
  { id: "Q332605", name: "Atletico Nacional" },
  { id: "Q332863", name: "Boyaca Chico" },
  { id: "Q616380", name: "Cucuta Deportivo" },
  { id: "Q332532", name: "Deportes Tolima" },
  { id: "Q663400", name: "Deportivo Cali" },
  { id: "Q332858", name: "Deportivo Pasto" },
  { id: "Q515178", name: "Deportivo Pereira" },
  { id: "Q5472511", name: "Fortaleza F.C." },
  { id: "Q332527", name: "Independiente Medellin" },
  { id: "Q137324985", name: "Internacional de Bogota", playerSourceIds: ["Q332668"] },
  { id: "Q5924752", name: "Jaguares de Cordoba" },
  { id: "Q332524", name: "Junior de Barranquilla" },
  { id: "Q6661327", name: "Llaneros F.C." },
  { id: "Q391984", name: "Millonarios" },
  { id: "Q47533", name: "Once Caldas" },
  { id: "Q1424072", name: "Independiente Santa Fe" },
];

const peruFirstDivision2026Clubs = [
  { id: "Q4807509", name: "Asociacion Deportiva Tarma" },
  { id: "Q509510", name: "Alianza Atletico" },
  { id: "Q572957", name: "Club Alianza Lima" },
  { id: "Q3288724", name: "Atletico Grau" },
  { id: "Q131583124", name: "FC Cajamarca" },
  { id: "Q602482", name: "Cienciano" },
  { id: "Q5151530", name: "Comerciantes Unidos" },
  { id: "Q602397", name: "Cusco F.C." },
  { id: "Q5136204", name: "Club Deportivo Garcilaso" },
  { id: "Q130467118", name: "Club Deportivo Moquegua" },
  { id: "Q123575473", name: "Juan Pablo II College" },
  { id: "Q23409530", name: "Club Deportivo Los Chankas" },
  { id: "Q602542", name: "FBC Melgar" },
  { id: "Q603060", name: "Sport Boys" },
  { id: "Q602987", name: "Sport Huancayo" },
  { id: "Q604581", name: "Club Sporting Cristal" },
  { id: "Q19066", name: "Club Universitario de Deportes" },
  { id: "Q971843", name: "Universidad Tecnica de Cajamarca" },
];

const ecuadorFirstDivision2026Clubs = [
  { id: "Q2476133", name: "Sociedad Deportiva Aucas" },
  { id: "Q248782", name: "Barcelona S.C." },
  { id: "Q5253709", name: "Delfin S.C." },
  { id: "Q248765", name: "Deportivo Cuenca" },
  { id: "Q249612", name: "Club Sport Emelec" },
  { id: "Q5136217", name: "Guayaquil City F.C." },
  { id: "Q249648", name: "Independiente del Valle" },
  { id: "Q249643", name: "LDU Quito" },
  { id: "Q109313809", name: "Leones F.C." },
  { id: "Q105484053", name: "Libertad F.C." },
  { id: "Q249636", name: "C.S.D. Macara" },
  { id: "Q2501106", name: "Manta F.C." },
  { id: "Q6034679", name: "Mushuc Runa S.C." },
  { id: "Q6052286", name: "Orense S.C." },
  { id: "Q332866", name: "Tecnico Universitario" },
  { id: "Q2308911", name: "Universidad Catolica del Ecuador" },
];

const paraguayFirstDivision2026Clubs = [
  { id: "Q1926287", name: "Club Sportivo 2 de Mayo" },
  { id: "Q914086", name: "Club Cerro Porteno" },
  { id: "Q605044", name: "Club Guarani" },
  { id: "Q848642", name: "Club Libertad" },
  { id: "Q603101", name: "Club Nacional" },
  { id: "Q604589", name: "Club Olimpia" },
  { id: "Q1637661", name: "Deportivo Recoleta" },
  { id: "Q603085", name: "Club Rubio Nu" },
  { id: "Q2980003", name: "Club Sportivo San Lorenzo" },
  { id: "Q15294976", name: "Sportivo Ameliano" },
  { id: "Q602515", name: "Sportivo Luqueno" },
  { id: "Q2980011", name: "Sportivo Trinidense" },
];

const boliviaFirstDivision2026Clubs = [
  { id: "Q4671099", name: "Academia del Balompie Boliviano" },
  { id: "Q1102942", name: "Club Always Ready" },
  { id: "Q127925", name: "Club Aurora" },
  { id: "Q94571", name: "Club Blooming" },
  { id: "Q128024", name: "Club Bolivar" },
  { id: "Q128049", name: "Club Deportivo Guabira" },
  { id: "Q111162309", name: "GV San Jose" },
  { id: "Q2018250", name: "Club Independiente Petrolero" },
  { id: "Q676897", name: "Nacional Potosi" },
  { id: "Q127923", name: "Oriente Petrolero" },
  { id: "Q131425581", name: "Real Oruro" },
  { id: "Q128022", name: "Club Real Potosi" },
  { id: "Q104605993", name: "Club Real Tomayapo" },
  { id: "Q123925120", name: "C.D. San Antonio Bulo Bulo" },
  { id: "Q128020", name: "The Strongest" },
  { id: "Q110123008", name: "F.C. Universitario de Vinto" },
];

const venezuelaFirstDivision2026Clubs = [
  { id: "Q17619991", name: "Academia Puerto Cabello" },
  { id: "Q27929084", name: "Anzoategui F.C." },
  { id: "Q1035297", name: "Carabobo F.C." },
  { id: "Q1130244", name: "Caracas F.C." },
  { id: "Q628860", name: "Deportivo La Guaira F.C." },
  { id: "Q178378", name: "Deportivo Tachira F.C." },
  { id: "Q786500", name: "Estudiantes de Merida F.C." },
  { id: "Q6012105", name: "Metropolitanos F.C." },
  { id: "Q1636856", name: "Monagas S.C." },
  { id: "Q1458264", name: "Portuguesa F.C." },
  { id: "Q116504962", name: "Deportivo Rayo Zuliano" },
  { id: "Q1879895", name: "Trujillanos F.C." },
  { id: "Q3076549", name: "Universidad Central de Venezuela F.C." },
  { id: "Q145885", name: "Zamora F.C." },
];

const argentinaSecondDivision2026Clubs = [
  { id: "Q2351223", name: "Acassuso" },
  { id: "Q5772949", name: "Club Agropecuario Argentino" },
  { id: "Q646088", name: "All Boys" },
  { id: "Q1102935", name: "Club Almagro" },
  { id: "Q1102931", name: "Club Almirante Brown" },
  { id: "Q1022904", name: "Club Atletico Atlanta" },
  { id: "Q59839", name: "Atletico de Rafaela" },
  { id: "Q3384346", name: "Central Norte" },
  { id: "Q853053", name: "Chacarita Juniors" },
  { id: "Q3781627", name: "Chaco For Ever" },
  { id: "Q1102967", name: "Club Ciudad de Bolivar" },
  { id: "Q2057734", name: "Club Atletico Colegiales" },
  { id: "Q80897", name: "Club Atletico Colon" },
  { id: "Q2979817", name: "Defensores de Belgrano" },
  { id: "Q919761", name: "Deportivo Madryn" },
  { id: "Q3775566", name: "Deportivo Maipu" },
  { id: "Q2318771", name: "Deportivo Moron" },
  { id: "Q2333719", name: "Estudiantes de Buenos Aires" },
  { id: "Q5136249", name: "Club Ferrocarril Midland" },
  { id: "Q910444", name: "Ferro Carril Oeste" },
  { id: "Q1022923", name: "Gimnasia y Esgrima de Jujuy" },
  { id: "Q2759870", name: "Gimnasia y Tiro" },
  { id: "Q80882", name: "Godoy Cruz Antonio Tomba" },
  { id: "Q5773135", name: "Club Atletico Guemes" },
  { id: "Q2317584", name: "Club Atletico Los Andes" },
  { id: "Q5487437", name: "Club Atletico Mitre" },
  { id: "Q744555", name: "Club Atletico Nueva Chicago" },
  { id: "Q1773830", name: "Club Atletico Patronato" },
  { id: "Q775966", name: "Quilmes Atletico Club" },
  { id: "Q632805", name: "Racing de Cordoba" },
  { id: "Q80921", name: "San Martin de San Juan" },
  { id: "Q1022938", name: "San Martin de Tucuman" },
  { id: "Q972701", name: "Club Atletico San Miguel" },
  { id: "Q2979822", name: "Club Atletico San Telmo" },
  { id: "Q2778591", name: "Club Atletico Temperley" },
  { id: "Q2979984", name: "Club Tristan Suarez" },
];

const brazilSecondDivision2026Clubs = [
  { id: "Q338285", name: "America Futebol Clube" },
  { id: "Q9636189", name: "Athletic Club" },
  { id: "Q198034", name: "Atletico Clube Goianiense" },
  { id: "Q374069", name: "Avai Futebol Clube" },
  { id: "Q2332493", name: "Botafogo Futebol Clube" },
  { id: "Q1052219", name: "Ceara Sporting Club" },
  { id: "Q1024264", name: "Clube de Regatas Brasil" },
  { id: "Q598834", name: "Criciuma Esporte Clube" },
  { id: "Q2945011", name: "Cuiaba Esporte Clube" },
  { id: "Q188841", name: "Fortaleza Esporte Clube" },
  { id: "Q816779", name: "Goias Esporte Clube" },
  { id: "Q910453", name: "Esporte Clube Juventude" },
  { id: "Q1633430", name: "Londrina Esporte Clube" },
  { id: "Q73971", name: "Clube Nautico Capibaribe" },
  { id: "Q4115694", name: "Gremio Esportivo Novorizontino" },
  { id: "Q2580083", name: "Operario Ferroviario Esporte Clube" },
  { id: "Q219120", name: "Associacao Atletica Ponte Preta" },
  { id: "Q557103", name: "Sao Bernardo Futebol Clube" },
  { id: "Q219098", name: "Sport Club do Recife" },
  { id: "Q1513287", name: "Vila Nova Futebol Clube" },
];

const currentLeagueScopes = {
  "argentina-first-division-current": {
    clubs: argentinaFirstDivision2026Clubs,
    importScope: "argentina-first-division-current-players",
    leagueSeason: "Liga Profesional 2026",
    leagueSeasonSource: "https://www.ligaprofesional.ar/clubes",
    queryPurpose: "Argentina Primera División current squad import spike",
    outputLabel: "current Argentina first-division player-club rows",
    oldestPlausibleBirthDate: "1981-01-01",
  },
  "brazil-first-division-current": {
    clubs: brazilFirstDivision2026Clubs,
    importScope: "brazil-first-division-current-players",
    leagueSeason: "Campeonato Brasileiro Série A 2026",
    leagueSeasonSource: "https://www.cbf.com.br/futebol-brasileiro/times/campeonato-brasileiro/serie-a/2026",
    queryPurpose: "Brazil Série A current squad import spike",
    outputLabel: "current Brazil first-division player-club rows",
    oldestPlausibleBirthDate: "1981-01-01",
  },
  "chile-first-division-current": {
    clubs: chileFirstDivision2026Clubs,
    importScope: "chile-first-division-current-players",
    leagueSeason: "Liga de Primera 2026",
    leagueSeasonSource: "https://www.campeonatochileno.cl/competition/liga-de-primera/",
    queryPurpose: "Chile Liga de Primera current squad import spike",
    outputLabel: "current Chile first-division player-club rows",
    oldestPlausibleBirthDate: "1981-01-01",
  },
  "uruguay-first-division-current": {
    clubs: uruguayFirstDivision2026Clubs,
    importScope: "uruguay-first-division-current-players",
    leagueSeason: "Liga AUF Uruguaya 2026",
    leagueSeasonSource: "https://es.wikipedia.org/wiki/Campeonato_Uruguayo_de_Primera_Divisi%C3%B3n_2026",
    queryPurpose: "Uruguay Primera Division current squad import spike",
    outputLabel: "current Uruguay first-division player-club rows",
    oldestPlausibleBirthDate: "1981-01-01",
  },
  "colombia-first-division-current": {
    clubs: colombiaFirstDivision2026Clubs,
    importScope: "colombia-first-division-current-players",
    leagueSeason: "Liga DIMAYOR 2026",
    leagueSeasonSource: "https://en.wikipedia.org/wiki/2026_Liga_DIMAYOR",
    queryPurpose: "Colombia Liga DIMAYOR current squad import spike",
    outputLabel: "current Colombia first-division player-club rows",
    oldestPlausibleBirthDate: "1981-01-01",
  },
  "peru-first-division-current": {
    clubs: peruFirstDivision2026Clubs,
    importScope: "peru-first-division-current-players",
    leagueSeason: "Liga 1 2026",
    leagueSeasonSource: "https://en.wikipedia.org/wiki/2026_Liga_1_(Peru)",
    queryPurpose: "Peru Liga 1 current squad import spike",
    outputLabel: "current Peru first-division player-club rows",
    oldestPlausibleBirthDate: "1981-01-01",
  },
  "ecuador-first-division-current": {
    clubs: ecuadorFirstDivision2026Clubs,
    importScope: "ecuador-first-division-current-players",
    leagueSeason: "LigaPro Serie A 2026",
    leagueSeasonSource: "https://en.wikipedia.org/wiki/2026_LigaPro_Serie_A",
    queryPurpose: "Ecuador LigaPro Serie A current squad import spike",
    outputLabel: "current Ecuador first-division player-club rows",
    oldestPlausibleBirthDate: "1981-01-01",
  },
  "paraguay-first-division-current": {
    clubs: paraguayFirstDivision2026Clubs,
    importScope: "paraguay-first-division-current-players",
    leagueSeason: "Copa de Primera 2026",
    leagueSeasonSource: "https://en.wikipedia.org/wiki/2026_Copa_de_Primera",
    queryPurpose: "Paraguay Copa de Primera current squad import spike",
    outputLabel: "current Paraguay first-division player-club rows",
    oldestPlausibleBirthDate: "1981-01-01",
  },
  "bolivia-first-division-current": {
    clubs: boliviaFirstDivision2026Clubs,
    importScope: "bolivia-first-division-current-players",
    leagueSeason: "FBF Division Profesional 2026",
    leagueSeasonSource: "https://en.wikipedia.org/wiki/2026_FBF_Divisi%C3%B3n_Profesional",
    queryPurpose: "Bolivia Division Profesional current squad import spike",
    outputLabel: "current Bolivia first-division player-club rows",
    oldestPlausibleBirthDate: "1981-01-01",
  },
  "venezuela-first-division-current": {
    clubs: venezuelaFirstDivision2026Clubs,
    importScope: "venezuela-first-division-current-players",
    leagueSeason: "Liga FUTVE 2026",
    leagueSeasonSource: "https://es.wikipedia.org/wiki/Primera_Divisi%C3%B3n_de_Venezuela_2026",
    queryPurpose: "Venezuela Liga FUTVE current squad import spike",
    outputLabel: "current Venezuela first-division player-club rows",
    oldestPlausibleBirthDate: "1981-01-01",
  },
  "argentina-second-division-current": {
    clubs: argentinaSecondDivision2026Clubs,
    importScope: "argentina-second-division-current-players",
    leagueSeason: "Primera Nacional 2026",
    leagueSeasonSource: "https://en.wikipedia.org/wiki/2026_Primera_Nacional",
    queryPurpose: "Argentina Primera Nacional current squad import spike",
    outputLabel: "current Argentina second-division player-club rows",
    oldestPlausibleBirthDate: "1981-01-01",
  },
  "brazil-second-division-current": {
    clubs: brazilSecondDivision2026Clubs,
    importScope: "brazil-second-division-current-players",
    leagueSeason: "Campeonato Brasileiro Serie B 2026",
    leagueSeasonSource: "https://en.wikipedia.org/wiki/2026_Campeonato_Brasileiro_S%C3%A9rie_B",
    queryPurpose: "Brazil Serie B current squad import spike",
    outputLabel: "current Brazil second-division player-club rows",
    oldestPlausibleBirthDate: "1981-01-01",
  },
};

function getLimit() {
  const raw = process.argv.find((arg) => arg.startsWith("--limit="))?.split("=")[1];
  const value = raw ? Number.parseInt(raw, 10) : defaultLimit;

  if (!Number.isFinite(value) || value < 1 || value > 5000) {
    throw new Error("Use --limit with a number between 1 and 5000.");
  }

  return value;
}

function getOutputPath() {
  const raw = process.argv.find((arg) => arg.startsWith("--out="))?.split("=")[1];
  return resolve(raw ?? "data/imported/south-america-players.sample.json");
}

function getScope() {
  return process.argv.find((arg) => arg.startsWith("--scope="))?.split("=")[1] ?? "south-america-country";
}

function getCountryIds() {
  const raw = process.argv.find((arg) => arg.startsWith("--country="))?.split("=")[1];

  if (!raw) {
    return southAmericaCountries;
  }

  const normalized = raw.trim().toLowerCase();
  const id = countryAliases[normalized] ?? raw.trim();

  if (!/^Q\d+$/.test(id)) {
    throw new Error(`Unknown country "${raw}". Use a supported name or a Wikidata QID.`);
  }

  return [id];
}

function buildQuery(limit, countryIds) {
  const countryValues = countryIds.map((id) => `wd:${id}`).join(" ");

  return `
SELECT ?player ?playerLabel ?playerDescription ?country ?countryLabel ?birthDate ?positionLabel ?teamLabel WHERE {
  VALUES ?country { ${countryValues} }
  ?player wdt:P106 wd:Q937857;
          wdt:P27 ?country.
  OPTIONAL { ?player wdt:P569 ?birthDate. }
  OPTIONAL { ?player wdt:P413 ?position. }
  OPTIONAL { ?player wdt:P54 ?team. }
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "en,es,ja".
  }
}
ORDER BY ?countryLabel ?playerLabel
LIMIT ${limit}
`;
}

function value(binding, key) {
  return binding[key]?.value ?? null;
}

function normalizeRows(bindings) {
  const seen = new Set();

  return bindings
    .map((binding) => {
      const wikidataUrl = value(binding, "player");
      const id = wikidataUrl?.split("/").pop();

      return {
        id: id ? `wikidata-${id}` : null,
        wikidataId: id,
        name: value(binding, "playerLabel"),
        description: value(binding, "playerDescription"),
        nationality: value(binding, "countryLabel"),
        birthDate: value(binding, "birthDate")?.slice(0, 10) ?? null,
        position: value(binding, "positionLabel"),
        currentOrFormerTeam: value(binding, "teamLabel"),
        sourceUrl: wikidataUrl,
        sourceName: "Wikidata",
        sourceLicense: "CC0",
        importedAt: new Date().toISOString(),
        importScope: "south-america-footballers",
        reviewStatus: "needs_manual_review",
      };
    })
    .filter((row) => {
      if (!row.wikidataId || seen.has(row.wikidataId)) {
        return false;
      }

      seen.add(row.wikidataId);
      return true;
    });
}

function normalizeCurrentLeagueEntity(entity, club, importScope) {
  const positionId = claimValue(entity, "P413");

  return {
    id: `wikidata-${entity.id}`,
    wikidataId: entity.id,
    name: label(entity, "en") ?? label(entity, "es") ?? label(entity, "ja") ?? entity.id,
    nameEs: label(entity, "es"),
    nameJa: label(entity, "ja"),
    description: description(entity, "en") ?? description(entity, "es") ?? description(entity, "ja") ?? null,
    descriptionEs: description(entity, "es"),
    descriptionJa: description(entity, "ja"),
    nationality: claimValue(entity, "P27"),
    birthDate: claimValue(entity, "P569"),
    position: positionId,
    positionName: null,
    positionNameEs: null,
    positionNameJa: null,
    currentClub: club.id,
    currentClubName: club.name,
    currentClubNameEs: club.name,
    currentClubNameJa: null,
    currentClubPlayerSourceIds: club.playerSourceIds ?? [],
    sourceUrl: `https://www.wikidata.org/wiki/${entity.id}`,
    sourceName: "Wikidata",
    sourceLicense: "CC0",
    importedAt: new Date().toISOString(),
    importScope,
    currentnessRule: "P54 club membership statement without P582 end-time qualifier",
    reviewStatus: "needs_manual_review",
  };
}

async function fetchWikidataPlayers(limit, countryIds) {
  const params = new URLSearchParams({
    query: buildQuery(limit, countryIds),
    format: "json",
  });

  const response = await fetch(`${endpoint}?${params.toString()}`, {
    headers: {
      Accept: "application/sparql-results+json",
      "User-Agent": userAgent,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Wikidata request failed: HTTP ${response.status}\n${body.slice(0, 500)}`);
  }

  return response.json();
}

async function fetchCurrentLeaguePlayers(limit, leagueConfig) {
  const rows = [];
  const seen = new Set();

  for (const club of leagueConfig.clubs) {
    if (rows.length >= limit) {
      break;
    }

    const teamClaimIds = [club.id, ...(club.playerSourceIds ?? [])];
    const candidateIds = [
      ...new Set(
        (
          await Promise.all(
            teamClaimIds.map((clubId) =>
              fetchCurrentClubPlayerCandidateIds(clubId, Math.min(150, limit - rows.length)),
            ),
          )
        ).flat(),
      ),
    ];
    const entities = await fetchEntities(candidateIds);

    for (const entity of entities) {
      if (
        !hasClaim(entity, "P106", "Q937857") ||
        !teamClaimIds.some((clubId) => hasCurrentTeamClaim(entity, clubId)) ||
        !hasPlausibleActiveBirthDate(entity, leagueConfig.oldestPlausibleBirthDate)
      ) {
        continue;
      }

      const row = normalizeCurrentLeagueEntity(entity, club, leagueConfig.importScope);
      const dedupeKey = `${row.wikidataId}-${row.currentClub}`;

      if (seen.has(dedupeKey)) {
        continue;
      }

      seen.add(dedupeKey);
      rows.push(row);
    }
  }

  return rows;
}

async function fetchCurrentClubPlayerCandidateIds(clubId, limit) {
  const query = `
SELECT ?player WHERE {
  ?player wdt:P54 wd:${clubId};
          wdt:P106 wd:Q937857.
}
ORDER BY ?player
LIMIT ${limit}
`;
  const params = new URLSearchParams({
    query,
    format: "json",
  });

  const response = await fetch(`${endpoint}?${params.toString()}`, {
    headers: {
      Accept: "application/sparql-results+json",
      "User-Agent": userAgent,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Wikidata player candidate request failed for ${clubId}: HTTP ${response.status}\n${body.slice(0, 500)}`);
  }

  const data = await response.json();

  return (
    data.results?.bindings
      ?.map((binding) => value(binding, "player")?.split("/").pop())
      .filter(Boolean) ?? []
  );
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": userAgent,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Wikidata API request failed: HTTP ${response.status}\n${body.slice(0, 500)}`);
  }

  return response.json();
}

async function fetchCategoryPageIds(categoryTitle, limit) {
  const pageIds = [];
  let cmcontinue = null;

  while (pageIds.length < limit) {
    const params = new URLSearchParams({
      action: "query",
      list: "categorymembers",
      cmtitle: categoryTitle,
      cmnamespace: "0",
      cmlimit: String(Math.min(50, limit - pageIds.length)),
      format: "json",
    });

    if (cmcontinue) {
      params.set("cmcontinue", cmcontinue);
    }

    const data = await fetchJson(`${englishWikipediaEndpoint}?${params.toString()}`);
    pageIds.push(...(data.query?.categorymembers?.map((page) => page.pageid) ?? []));

    cmcontinue = data.continue?.cmcontinue ?? null;

    if (!cmcontinue) {
      break;
    }
  }

  return pageIds;
}

async function fetchWikidataIdsForPages(pageIds) {
  if (pageIds.length === 0) {
    return [];
  }

  const ids = [];

  for (let index = 0; index < pageIds.length; index += 50) {
    const chunk = pageIds.slice(index, index + 50);
    const params = new URLSearchParams({
      action: "query",
      pageids: chunk.join("|"),
      prop: "pageprops",
      format: "json",
    });
    const data = await fetchJson(`${englishWikipediaEndpoint}?${params.toString()}`);
    const pages = Object.values(data.query?.pages ?? {});

    for (const page of pages) {
      const wikibaseItem = page.pageprops?.wikibase_item;

      if (wikibaseItem) {
        ids.push(wikibaseItem);
      }
    }
  }

  return ids;
}

async function searchEntityIds(searchTerm, limit) {
  const params = new URLSearchParams({
    action: "wbsearchentities",
    search: searchTerm,
    language: "en",
    uselang: "en",
    format: "json",
    limit: String(Math.min(limit, 50)),
  });
  const data = await fetchJson(`${entitySearchEndpoint}?${params.toString()}`);

  return data.search?.map((item) => item.id).filter(Boolean) ?? [];
}

function claimValue(entity, property) {
  const claim = entity.claims?.[property]?.[0];
  const value = claim?.mainsnak?.datavalue?.value;

  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (value.time) {
    return value.time.replace(/^\+/, "").slice(0, 10);
  }

  if (value.id) {
    return value.id;
  }

  return null;
}

function label(entity, language) {
  return entity.labels?.[language]?.value ?? null;
}

function description(entity, language) {
  return entity.descriptions?.[language]?.value ?? null;
}

function hasClaim(entity, property, id) {
  return entity.claims?.[property]?.some((claim) => claim.mainsnak?.datavalue?.value?.id === id) ?? false;
}

function hasCurrentTeamClaim(entity, clubId) {
  return (
    entity.claims?.P54?.some((claim) => {
      const teamId = claim.mainsnak?.datavalue?.value?.id;
      const hasEndTime = Boolean(claim.qualifiers?.P582?.length);

      return teamId === clubId && !hasEndTime;
    }) ?? false
  );
}

function hasPlausibleActiveBirthDate(entity, oldestPlausibleBirthDate) {
  const birthDate = claimValue(entity, "P569");

  if (!birthDate) {
    return true;
  }

  return birthDate >= oldestPlausibleBirthDate;
}

async function fetchEntities(ids) {
  if (ids.length === 0) {
    return [];
  }

  const chunks = [];

  for (let index = 0; index < ids.length; index += 50) {
    chunks.push(ids.slice(index, index + 50));
  }

  const entities = [];

  for (const chunk of chunks) {
    const params = new URLSearchParams({
      action: "wbgetentities",
      ids: chunk.join("|"),
      props: "labels|descriptions|claims",
      languages: "en|es|ja",
      format: "json",
    });
    const data = await fetchJson(`${entitySearchEndpoint}?${params.toString()}`);
    entities.push(...Object.values(data.entities ?? {}));
  }

  return entities;
}

async function fetchWikidataPlayersViaEntityApi(limit, countryIds) {
  const candidateIds = new Set();

  for (const countryId of countryIds) {
    const category = countryWikipediaCategories[countryId];

    if (category) {
      const pageIds = await fetchCategoryPageIds(category, limit * 2);
      const wikidataIds = await fetchWikidataIdsForPages(pageIds);
      wikidataIds.forEach((id) => candidateIds.add(id));
    }

    const terms = countrySearchTerms[countryId] ?? [`${countryId} footballer`];

    for (const term of terms) {
      const ids = await searchEntityIds(term, limit);
      ids.forEach((id) => candidateIds.add(id));

      if (candidateIds.size >= limit * 3) {
        break;
      }
    }
  }

  const entities = await fetchEntities([...candidateIds]);
  const rows = [];

  for (const entity of entities) {
    if (!hasClaim(entity, "P106", "Q937857")) {
      continue;
    }

    const countryId = claimValue(entity, "P27");

    if (!countryIds.includes(countryId)) {
      continue;
    }

    rows.push({
      id: `wikidata-${entity.id}`,
      wikidataId: entity.id,
      name: label(entity, "en") ?? label(entity, "es") ?? label(entity, "ja") ?? entity.id,
      nameEs: label(entity, "es"),
      nameJa: label(entity, "ja"),
      description:
        description(entity, "en") ?? description(entity, "es") ?? description(entity, "ja") ?? null,
      descriptionEs: description(entity, "es"),
      descriptionJa: description(entity, "ja"),
      nationality: countryId,
      birthDate: claimValue(entity, "P569"),
      position: claimValue(entity, "P413"),
      currentOrFormerTeam: claimValue(entity, "P54"),
      sourceUrl: `https://www.wikidata.org/wiki/${entity.id}`,
      sourceName: "Wikidata",
      sourceLicense: "CC0",
      importedAt: new Date().toISOString(),
      importScope: "south-america-footballers",
      reviewStatus: "needs_manual_review",
    });

    if (rows.length >= limit) {
      break;
    }
  }

  return rows;
}

async function main() {
  const limit = getLimit();
  const scope = getScope();
  const countryIds = getCountryIds();
  const outputPath = getOutputPath();
  let rows = [];
  let accessMethod = "Wikidata entity API";

  const currentLeagueConfig = currentLeagueScopes[scope];

  if (currentLeagueConfig) {
    rows = await fetchCurrentLeaguePlayers(limit, currentLeagueConfig);
    const clubsWithRows = new Set(rows.map((row) => row.currentClub));
    const clubsWithoutRows = currentLeagueConfig.clubs.filter((club) => !clubsWithRows.has(club.id));

    const output = {
      source: {
        name: "Wikidata",
        endpoint,
        accessMethod: "Wikidata Query Service SPARQL",
        license: "CC0",
        queryPurpose: currentLeagueConfig.queryPurpose,
        leagueSeasonSource: currentLeagueConfig.leagueSeasonSource,
        leagueSeason: currentLeagueConfig.leagueSeason,
        clubCount: currentLeagueConfig.clubs.length,
        clubs: currentLeagueConfig.clubs,
        clubsWithRows: clubsWithRows.size,
        clubsWithoutRows,
        currentnessRule: "P54 club membership statement without P582 end-time qualifier",
        oldestPlausibleBirthDate: currentLeagueConfig.oldestPlausibleBirthDate,
        importedAt: new Date().toISOString(),
        limit,
      },
      reviewNote:
        "Rows are intended to represent current first-division squad members, based on Wikidata team membership statements with no end date and a conservative birth-date guard. Squads and Wikidata claims can lag real transfers, so every row needs manual review before public display.",
      players: rows,
    };

    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

    console.log(`Imported ${rows.length} ${currentLeagueConfig.outputLabel} from Wikidata.`);
    console.log(`Wrote ${outputPath}`);
    return;
  }

  try {
    rows = await fetchWikidataPlayersViaEntityApi(limit, countryIds);
  } catch (error) {
    console.warn(`Entity API path failed, trying SPARQL fallback: ${error.message}`);
    accessMethod = "Wikidata Query Service SPARQL";
    const data = await fetchWikidataPlayers(limit, countryIds);
    rows = normalizeRows(data.results.bindings);
  }

  const output = {
    source: {
      name: "Wikidata",
      endpoint: accessMethod === "Wikidata entity API" ? entitySearchEndpoint : endpoint,
      accessMethod,
      license: "CC0",
      queryPurpose: "South America footballer identity import spike",
      countryIds,
      importedAt: new Date().toISOString(),
      limit,
    },
    reviewNote:
      "Imported rows are not final scouting data. Check each row for current club accuracy, duplicates, and source confidence before displaying publicly.",
    players: rows,
  };

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  console.log(`Imported ${rows.length} players from Wikidata.`);
  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
