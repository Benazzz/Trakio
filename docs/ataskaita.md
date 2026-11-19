# Projektinio darbo „Trakio“ ataskaita

**Modulis:** T120B165 „Saityno taikomųjų programų projektavimas“
**Studentas:** Benas Subačius
**Dėstytojai:** Patrikas Armalis, doc. prakt. Simonas Baltulionis

---

## 1. Sprendžiamo uždavinio aprašymas

### 1.1. Sistemos paskirtis

„Trakio“ – tai sistema miesto slėpynių žaidimams organizuoti ir valdyti. Žaidimas vyksta realioje miesto zonoje: vieni žaidėjai slepiasi, kiti jų ieško, remdamiesi atsakymais į klausimus ir atliktomis užduotimis.

Sistemą sudaro dvi dalys: REST principais veikianti aplikacijų programavimo sąsaja (API) ir internetinė aplikacija, kuria naudojasi žaidėjai ir administratorius.

Registruotas naudotojas sukuria žaidimą ir tampa jo kūrėju: pasirenka žaidimo zoną (pvz., Kaunas – Senamiestis), didžiausią žaidėjų skaičių, laiką, per kurį besislepiantieji gali pasislėpti („head start“), ir nurodo, ar žaidimas viešas. Žaidimas vyksta raundais – kūrėjas juos kuria, pradeda ir baigia, fiksuoja raundo laiką ir kuris žaidėjas surado besislepiantįjį. Aktyvaus raundo metu žaidėjai kuria įvykius – klausimus (pvz., „Ar esi į šiaurę nuo manęs?“) ir užduotis (pvz., „Nusifotografuok prie Kauno pilies“), pasirinkdami juos iš zonai skirtų arba bendrų šablonų. Prie įvykio įrašomas atsakymas ir būsena (laukiama, atsakyta, atlikta).

Taikomosios srities objektai susieti hierarchiniu ryšiu vienas-su-daug:

**Žaidimas (Game) → Raundas (Round) → Įvykis (Event)**

Sistemoje yra trys naudotojų rolės:

| Rolė | Aprašymas |
|---|---|
| Svečias | Neprisijungęs naudotojas – registruojasi, prisijungia ir peržiūri žaidimų sąrašą. |
| Žaidėjas (`player`) | Prisijungęs naudotojas – kuria ir valdo savo žaidimus bei jų raundus, kuria ir redaguoja savo įvykius. |
| Administratorius (`admin`) | Valdo visų naudotojų žaidimus, raundus ir įvykius. |

### 1.2. Funkciniai reikalavimai

**Neprisijungęs naudotojas (svečias) gali:**

1. Užsiregistruoti (el. paštas, naudotojo vardas, slaptažodis).
2. Prisijungti.
3. Peržiūrėti žaidimų sąrašą:
   1. filtruoti žaidimus pagal būseną (laukiamasis, vyksta, baigtas);
   2. filtruoti tik viešus žaidimus;
   3. naršyti sąrašą puslapiais.

**Prisijungęs žaidėjas gali:**

1. Atsijungti.
2. Peržiūrėti žaidimų sąrašą (su filtrais ir puslapiavimu).
3. Peržiūrėti žaidimo informaciją: zoną, kūrėją, nustatymus, žaidėjų sąrašą ir raundus.
4. Sukurti žaidimą – nurodyti pavadinimą, zoną, didžiausią žaidėjų skaičių (2–20), „head start“ laiką ir viešumą.
5. Redaguoti savo žaidimą:
   1. keisti pavadinimą, žaidėjų skaičių, „head start“ laiką ir viešumą;
   2. užrakinti / atrakinti žaidimo laukiamąjį.
6. Ištrinti savo žaidimą (kartu su jo raundais ir įvykiais).
7. Sukurti naują raundą savo žaidime.
8. Redaguoti savo žaidimo raundą – keisti būseną (laukiantis, aktyvus, baigtas), pradžios ir pabaigos laiką, nurodyti, kuris žaidėjas surado besislepiantįjį.
9. Peržiūrėti raundo informaciją ir jo įvykių sąrašą.
10. Sukurti įvykį aktyviame raunde – pasirinkti klausimą arba užduotį iš žaidimo zonos ir bendrų šablonų.
11. Redaguoti savo sukurtą įvykį – keisti būseną (laukiama, atsakyta, atlikta), įrašyti atsakymą, nurodyti, kas jį išsprendė.

**Administratorius, be žaidėjo funkcijų, gali:**

1. Redaguoti ir šalinti bet kurio naudotojo žaidimus.
2. Kurti ir redaguoti raundus bet kuriame žaidime.
3. Šalinti raundus.
4. Redaguoti ir šalinti bet kurio naudotojo įvykius.

**Sistemos taisyklės:**

1. Užblokuotas naudotojas negali prisijungti ir atnaujinti žaidimo sesijos.
2. Žaidime vienu metu gali būti tik vienas aktyvus raundas.
3. Į baigtą žaidimą negalima pridėti naujo raundo.
4. Įvykius galima kurti tik aktyviame raunde.
5. Raundo pabaigos laikas negali būti ankstesnis už pradžios laiką.

## 2. Sistemos architektūra
 
Sistemos sudedamosios dalys:
 
- **Kliento pusė (Front-End)** – React.js biblioteka, pasirinkta dėl komponentinės architektūros, plačios ekosistemos ir asmeninės patirties su ja. Projektas sukurtas su Vite. Naudojamos bibliotekos: React Router (navigacija tarp puslapių), Axios (HTTP užklausos ir automatinis žetonų atnaujinimas per interceptor'ius), jwt-decode (naudotojo rolės nuskaitymas iš žetono), lucide-react (SVG ikonos). Prisijungusio naudotojo būsena saugoma React Context.
- **Serverio pusė (Back-End)** – Node.js su Express.js karkasu, pasirinkta dėl paprasto REST API kūrimo, didelės ekosistemos ir tos pačios programavimo kalbos (JavaScript) kliento ir serverio pusėse. Užklausų duomenys validuojami Zod bibliotekos schemomis, autentifikacijai naudojami JWT žetonai (jsonwebtoken), slaptažodžiai saugomi maišos pavidalu (bcrypt), o su duomenų baze dirbama per node-postgres (pg) parametrizuotomis SQL užklausomis.
- **Duomenų bazė** – PostgreSQL, talpinama Supabase platformoje. Pasirinkta dėl reliacinės duomenų struktūros tinkamumo hierarchiniams objektų ryšiams ir patogios nemokamos debesijos infrastruktūros.
1 pav. pavaizduota sistemos diegimo diagrama. Sistemos talpinimui naudojamos trys atskiros debesijos platformos: Vercel, Render ir Supabase. Internetinė aplikacija (React) statinio turinio pavidalu talpinama Vercel platformoje ir pasiekiama per HTTPS protokolą. Žaidimų, raundų, įvykių ir naudotojų duomenis valdo serverio pusės API, diegiamas Render platformoje ir pasiekiamas per HTTPS protokolą. API vykdo duomenų mainus su Supabase platformoje talpinama duomenų baze per TCP/IP protokolą.
 
![Sistemos „Trakio“ diegimo diagrama](deployment_diagram.png)
 *1 pav. Sistemos „Trakio“ diegimo diagrama*
 ## 3. Naudotojo sąsajos projektas
 
Prieš realizaciją buvo suprojektuoti žemo detalumo (low-fidelity) naudotojo sąsajos langų wireframe'ai. Jie apibrėžia langų struktūrą: elementų išdėstymą, naršymą ir formų laukus, tačiau neapibrėžia spalvų, šriftų ir paveikslėlių. Žemiau pateikiami kiekvieno lango wireframe'as ir jį atitinkančios realizacijos ekranvaizdis.
 
Visuose desktop languose naudojamas tas pats išdėstymas: viršuje – header'is su logotipu ir navigacija, viduryje – turinys, apačioje – footer'is. Kūrimo, redagavimo ir trynimo veiksmai atliekami modaliniuose languose, o apie veiksmų rezultatą naudotojas informuojamas trumpais pranešimais (toast).
 
### 3.1. Žaidimų sąrašas
 
Pagrindinis sistemos langas. Rodomas žaidimų sąrašas kortelėmis su būsenos žyma; sąrašą galima filtruoti pagal būseną ir viešumą bei naršyti puslapiais. Prisijungusiam naudotojui rodomas mygtukas „New game“.
 
![Žaidimų sąrašo wireframe](wireframes/01-games.png) 
*2 pav. Žaidimų sąrašo wireframe*
 
![Žaidimų sąrašo realizacija](screenshots/01-games.png) 
*3 pav. Žaidimų sąrašo realizacija*
 
### 3.2. Žaidimo informacija ir raundai
 
Rodoma žaidimo informacija (zona, kūrėjas, nustatymai, žaidėjai) ir žaidimo raundų lentelė. Mygtukai „Edit“ ir „Delete“ rodomi tik žaidimo kūrėjui ir administratoriui; raundų trynimo mygtukas – tik administratoriui.
 
![Žaidimo informacijos wireframe](wireframes/02-game-details.png) 
*4 pav. Žaidimo informacijos wireframe*
 
![Žaidimo informacijos realizacija](screenshots/02-game-details.png) 
*5 pav. Žaidimo informacijos realizacija*
 
### 3.3. Raundo informacija ir įvykiai
 
Rodoma raundo informacija ir jame sukurti įvykiai – klausimai ir užduotys su būsena ir atsakymu. Naują įvykį galima sukurti tik aktyviame raunde.
 
![Raundo informacijos wireframe](wireframes/03-round-details.png) 
*6 pav. Raundo informacijos wireframe*
 
![Raundo informacijos realizacija](screenshots/03-round-details.png) 
*7 pav. Raundo informacijos realizacija*
 
### 3.4. Žaidimo kūrimo ir redagavimo modalinis langas
 
Ta pati forma naudojama žaidimui kurti ir redaguoti. Formoje naudojami skirtingų tipų įvesties elementai: teksto laukas, išskleidžiamasis sąrašas (zona), skaičių laukai ir žymimieji langeliai. Serverio grąžinamos klaidos rodomos formos viršuje.
 
![Žaidimo formos wireframe](wireframes/04-game-modal.png) 
*8 pav. Žaidimo kūrimo formos wireframe*
 
![Žaidimo formos realizacija](screenshots/04-game-modal.png) 
*9 pav. Žaidimo kūrimo formos realizacija*
 
### 3.5. Ištrynimo patvirtinimo langas
 
Prieš ištrinant žaidimą, raundą ar įvykį, naudotojo prašoma patvirtinti veiksmą modaliniame lange.
 
![Ištrynimo patvirtinimo wireframe](wireframes/05-delete-modal.png) 
*10 pav. Ištrynimo patvirtinimo wireframe*
 
![Ištrynimo patvirtinimo realizacija](screenshots/05-delete-modal.png) 
*11 pav. Ištrynimo patvirtinimo realizacija*
 
### 3.6. Prisijungimas
 
![Prisijungimo lango wireframe](wireframes/06-login.png) 
*12 pav. Prisijungimo lango wireframe*
 
![Prisijungimo lango realizacija](screenshots/06-login.png) 
*13 pav. Prisijungimo lango realizacija*
 
### 3.7. Registracija
 
Po sėkmingos registracijos naudotojas automatiškai prijungiamas ir nukreipiamas į žaidimų sąrašą.
 
![Registracijos lango wireframe](wireframes/07-register.png) 
*14 pav. Registracijos lango wireframe*
 
![Registracijos lango realizacija](screenshots/07-register.png) 
*15 pav. Registracijos lango realizacija*
 
### 3.8. Mobilus vaizdas
 
Kai ekrano plotis mažesnis nei 768 px, navigacija paslepiama po „hamburger“ mygtuku, o žaidimų kortelės išdėstomos vienu stulpeliu.
 
| Wireframe | Realizacija |
|---|---|
| ![Mobilaus sąrašo wireframe](wireframes/08-mobile-games.png) | ![Mobilaus sąrašo realizacija](screenshots/08-mobile-games.png) |
| *16 pav. Žaidimų sąrašas (mobilus) – wireframe* | *17 pav. Žaidimų sąrašas (mobilus) – realizacija* |
| ![Mobilaus meniu wireframe](wireframes/09-mobile-menu.png) | ![Mobilaus meniu realizacija](screenshots/09-mobile-menu.png) |
| *18 pav. Išskleistas meniu (mobilus) – wireframe* | *19 pav. Išskleistas meniu (mobilus) – realizacija* |

## 4. API specifikacija
 
Pilna API specifikacija pateikta OpenAPI 3.0 formatu atskirame faile [`api-spec.yaml`](api-spec.yaml). Ją galima peržiūrėti interaktyviai, įkėlus failą į [Swagger Editor](https://editor.swagger.io/). Žemiau pateikiami bendri API principai ir kiekvieno metodo atsako kodai bei panaudojimo pavyzdžiai.
 
### 4.1. Bendra informacija
 
| | |
|---|---|
| Bazinis adresas | `https://trakio-we64.onrender.com` |
| Duomenų formatas | `application/json` (užklausos ir atsakymai) |
| Autentifikacija | JWT, antraštė `Authorization: Bearer <accessToken>` |
| Metodų skaičius | 21 (4 autentifikacijos, po 5 kiekvienam taikomosios srities objektui, 2 žinynai) |
 
URI sudaromi laikantis REST principų – resursai įvardijami daiktavardžiais, o veiksmą nusako HTTP metodas. Raundai ir įvykiai pasiekiami tik per tėvinį resursą, todėl URI atspindi objektų hierarchiją, pvz. `GET /games/1/rounds/1/events` grąžina konkretaus žaidimo konkretaus raundo įvykius. Žaidimų sąrašas palaiko puslapiavimą (`page`, `limit`) ir filtravimą (`status`, `is_public`). Žaidimų, raundų ir įvykių atsakymuose pateikiamos hypermedia nuorodos (`_links`) į susijusius resursus.
 
**Autentifikacija.** Prisijungus (`POST /auth/login`) grąžinami du žetonai:
 
- `accessToken` – JWT, pasirašytas HS256 algoritmu, galioja 15 min. Jame saugomas naudotojo ID (`sub`) ir rolė (`role`);
- `refreshToken` – atsitiktinė eilutė, galioja 7 dienas. Duomenų bazėje saugoma tik jos SHA-256 maiša.
Pasibaigus prieigos žetono galiojimui, klientas kviečia `POST /auth/refresh` ir gauna naują žetonų porą, o senas atnaujinimo žetonas atšaukiamas (rotacija). Atsijungiant (`POST /auth/logout`) atnaujinimo žetonas atšaukiamas.
 
**Klaidų formatas.** Visos klaidos grąžinamos JSON objektu su lauku `error`. Validacijos klaidos papildomai turi `details` masyvą su kiekvieno netinkamo lauko aprašu:
 
```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "too_small",
      "path": ["password"],
      "message": "Too small: expected string to have >=8 characters"
    }
  ]
}
```
 
**Naudojami atsako kodai:**
 
| Kodas | Reikšmė |
|---|---|
| 200 OK | Užklausa įvykdyta, grąžinamas resursas |
| 201 Created | Resursas sukurtas |
| 204 No Content | Resursas ištrintas arba naudotojas atsijungė (atsakymo kūno nėra) |
| 400 Bad Request | Neteisingas ID, užklausos parametrai, sugadintas JSON arba validacijos klaida |
| 401 Unauthorized | Nėra prieigos žetono, jis negalioja arba neteisingi prisijungimo duomenys |
| 403 Forbidden | Naudotojas neturi teisės atlikti veiksmo arba yra užblokuotas |
| 404 Not Found | Resursas arba maršrutas nerastas |
| 409 Conflict | Resursas jau egzistuoja (užimtas el. paštas, antras aktyvus raundas) |
| 422 Unprocessable Entity | Užklausa teisinga, bet pažeidžia verslo taisyklę arba duomenų bazės apribojimą |
 
### 4.2. Metodų sąrašas
 
| Metodas | URI | Aprašymas |
|---|---|---|
| POST | `/auth/register` | Registruoti naudotoją |
| POST | `/auth/login` | Prisijungti |
| POST | `/auth/refresh` | Atnaujinti žetonus |
| POST | `/auth/logout` | Atsijungti |
| GET | `/games` | Žaidimų sąrašas |
| POST | `/games` | Sukurti žaidimą |
| GET | `/games/{gameId}` | Žaidimo informacija |
| PUT | `/games/{gameId}` | Atnaujinti žaidimą |
| DELETE | `/games/{gameId}` | Ištrinti žaidimą |
| GET | `/games/{gameId}/rounds` | Raundų sąrašas |
| POST | `/games/{gameId}/rounds` | Sukurti raundą |
| GET | `/games/{gameId}/rounds/{roundId}` | Raundo informacija |
| PUT | `/games/{gameId}/rounds/{roundId}` | Atnaujinti raundą |
| DELETE | `/games/{gameId}/rounds/{roundId}` | Ištrinti raundą |
| GET | `/games/{gameId}/rounds/{roundId}/events` | Įvykių sąrašas |
| POST | `/games/{gameId}/rounds/{roundId}/events` | Sukurti įvykį |
| GET | `/games/{gameId}/rounds/{roundId}/events/{eventId}` | Įvykio informacija |
| PUT | `/games/{gameId}/rounds/{roundId}/events/{eventId}` | Atnaujinti įvykį |
| DELETE | `/games/{gameId}/rounds/{roundId}/events/{eventId}` | Ištrinti įvykį |
| GET | `/zones` | Zonų sąrašas |
| GET | `/event-templates` | Įvykių šablonų sąrašas |
 
### 4.3. Autentifikacija
 
#### 4.3.1. `POST /auth/register` – Registruoti naują naudotoją
 
**Teisės:** Viešas metodas.
 
| Kodas | Reikšmė |
|---|---|
| 201 | Naudotojas sukurtas |
| 400 | Užklausos kūnas neatitinka schemos arba JSON sugadintas |
| 409 | El. paštas arba naudotojo vardas jau užimtas |
 
**Užklausa:**
 
```http
POST /auth/register HTTP/1.1
Content-Type: application/json
 
{
  "email": "jonas@trakio.lt",
  "username": "jonas_v",
  "password": "Slaptazodis123"
}
```
 
**Atsakymas:**
 
```http
HTTP/1.1 201 Created
Content-Type: application/json
 
{
  "id": 10,
  "email": "jonas@trakio.lt",
  "username": "jonas_v",
  "role": "player",
  "is_blocked": false,
  "avatar_url": null,
  "created_at": "2026-11-19T17:40:12.481Z"
}
```
 
#### 4.3.2. `POST /auth/login` – Prisijungti
 
**Teisės:** Viešas metodas.
 
| Kodas | Reikšmė |
|---|---|
| 200 | Prisijungta, grąžinami žetonai |
| 400 | Užklausos kūnas neatitinka schemos arba JSON sugadintas |
| 401 | Neteisingas el. paštas arba slaptažodis |
| 403 | Naudotojas užblokuotas |
 
**Užklausa:**
 
```http
POST /auth/login HTTP/1.1
Content-Type: application/json
 
{
  "email": "tomas@trakio.lt",
  "password": "Trakio123!"
}
```
 
**Atsakymas:**
 
```http
HTTP/1.1 200 OK
Content-Type: application/json
 
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwicm9sZSI6InBsYXllciIsImlhdCI6MTc5NTEwOTYwMCwiZXhwIjoxNzk1MTEwNTAwfQ.4dQ0sKk8vYV2m9c1oH1JmW3Kc6u7Qx0pT2bY5nE8rZs",
  "refreshToken": "3f9c2a7e1b4d8f60a5c9e2d7b1f3a8c4e6d0b2a9f7c5e3d1b8a6f4c2e0d9b7a5"
}
```
 
#### 4.3.3. `POST /auth/refresh` – Atnaujinti žetonus
 
Pateiktas atnaujinimo žetonas atšaukiamas ir išduodama nauja žetonų pora.
 
**Teisės:** Viešas metodas.
 
| Kodas | Reikšmė |
|---|---|
| 200 | Nauja žetonų pora |
| 400 | Užklausos kūnas neatitinka schemos arba JSON sugadintas |
| 401 | Atnaujinimo žetonas neteisingas, atšauktas arba nebegalioja |
| 403 | Naudotojas užblokuotas |
 
**Užklausa:**
 
```http
POST /auth/refresh HTTP/1.1
Content-Type: application/json
 
{
  "refreshToken": "3f9c2a7e1b4d8f60a5c9e2d7b1f3a8c4e6d0b2a9f7c5e3d1b8a6f4c2e0d9b7a5"
}
```
 
**Atsakymas:**
 
```http
HTTP/1.1 200 OK
Content-Type: application/json
 
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwicm9sZSI6InBsYXllciIsImlhdCI6MTc5NTExMDUwMCwiZXhwIjoxNzk1MTExNDAwfQ.Jd8kq2Vn0mXc5bT7yR1wP9sL3hA6fE4uZ0oN2iG8vKs",
  "refreshToken": "9a1e5c3b7d2f4a6e8c0b9d1f3a5c7e2b4d6f8a0c1e3b5d7f9a2c4e6b8d0f1a3c"
}
```
 
#### 4.3.4. `POST /auth/logout` – Atsijungti
 
Atšaukia pateiktą atnaujinimo žetoną.
 
**Teisės:** Viešas metodas.
 
| Kodas | Reikšmė |
|---|---|
| 204 | Atsijungta (atsakymo kūno nėra) |
| 400 | Užklausos kūnas neatitinka schemos arba JSON sugadintas |
| 401 | Atnaujinimo žetonas neteisingas arba jau atšauktas |
 
**Užklausa:**
 
```http
POST /auth/logout HTTP/1.1
Content-Type: application/json
 
{
  "refreshToken": "9a1e5c3b7d2f4a6e8c0b9d1f3a5c7e2b4d6f8a0c1e3b5d7f9a2c4e6b8d0f1a3c"
}
```
 
**Atsakymas:**
 
```http
HTTP/1.1 204 No Content
```
 
 
### 4.4. Žaidimai
 
#### 4.4.1. `GET /games` – Žaidimų sąrašas (puslapiavimas ir filtravimas)
 
**Teisės:** Viešas metodas.
 
| Kodas | Reikšmė |
|---|---|
| 200 | Žaidimų puslapis |
| 400 | Neteisingi puslapiavimo arba filtrų parametrai |
 
**Užklausa:**
 
```http
GET /games?status=active&page=1&limit=10 HTTP/1.1
```
 
**Atsakymas:**
 
```http
HTTP/1.1 200 OK
Content-Type: application/json
 
{
  "data": [
    {
      "id": 3,
      "name": "Žaliakalnio iššūkis",
      "created_by": 4,
      "zone_id": 3,
      "status": "active",
      "is_public": true,
      "is_locked": true,
      "max_players": 8,
      "head_start_min": 30,
      "created_at": "2026-10-17T18:00:00.000Z",
      "started_at": "2026-10-18T10:00:00.000Z",
      "ended_at": null,
      "_links": {
        "self": {
          "href": "/games/3"
        },
        "rounds": {
          "href": "/games/3/rounds"
        }
      }
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 1
}
```
 
#### 4.4.2. `POST /games` – Sukurti žaidimą
 
Kūrėju tampa prisijungęs naudotojas.
 
**Teisės:** Bet kuris prisijungęs naudotojas.
 
| Kodas | Reikšmė |
|---|---|
| 201 | Žaidimas sukurtas |
| 400 | Užklausos kūnas neatitinka schemos arba JSON sugadintas |
| 401 | Nėra prieigos žetono arba jis negalioja |
| 422 | Nurodyta zona neegzistuoja |
 
**Užklausa:**
 
```http
POST /games HTTP/1.1
Authorization: Bearer <accessToken>
Content-Type: application/json
 
{
  "name": "Vakaras Ąžuolyne",
  "zone_id": 4,
  "is_public": true,
  "max_players": 6,
  "head_start_min": 15
}
```
 
**Atsakymas:**
 
```http
HTTP/1.1 201 Created
Content-Type: application/json
 
{
  "id": 7,
  "name": "Vakaras Ąžuolyne",
  "created_by": 2,
  "zone_id": 4,
  "status": "lobby",
  "is_public": true,
  "is_locked": false,
  "max_players": 6,
  "head_start_min": 15,
  "created_at": "2026-11-19T17:45:03.112Z",
  "started_at": null,
  "ended_at": null,
  "_links": {
    "self": {
      "href": "/games/7"
    },
    "rounds": {
      "href": "/games/7/rounds"
    }
  }
}
```
 
#### 4.4.3. `GET /games/{gameId}` – Žaidimo informacija
 
Resursas sudaromas iš kelių esybių: žaidimo, zonos, kūrėjo ir žaidėjų sąrašo.
 
**Teisės:** Bet kuris prisijungęs naudotojas.
 
| Kodas | Reikšmė |
|---|---|
| 200 | Žaidimas su zona, kūrėju ir žaidėjais |
| 400 | Neteisingas žaidimo ID |
| 401 | Nėra prieigos žetono arba jis negalioja |
| 404 | Žaidimas nerastas |
 
**Užklausa:**
 
```http
GET /games/1 HTTP/1.1
Authorization: Bearer <accessToken>
```
 
**Atsakymas:**
 
```http
HTTP/1.1 200 OK
Content-Type: application/json
 
{
  "id": 1,
  "name": "Senamiesčio slėpynės",
  "created_by": 2,
  "zone_id": 1,
  "status": "finished",
  "is_public": true,
  "is_locked": true,
  "max_players": 6,
  "head_start_min": 15,
  "created_at": "2026-10-03T17:00:00.000Z",
  "started_at": "2026-10-04T11:00:00.000Z",
  "ended_at": "2026-10-04T14:20:00.000Z",
  "zone": {
    "id": 1,
    "name": "Senamiestis",
    "city": "Kaunas"
  },
  "creator": {
    "id": 2,
    "username": "tomas_k"
  },
  "players": [
    {
      "id": 2,
      "username": "tomas_k"
    },
    {
      "id": 3,
      "username": "ieva.p"
    },
    {
      "id": 4,
      "username": "mantas_r"
    }
  ],
  "_links": {
    "self": {
      "href": "/games/1"
    },
    "rounds": {
      "href": "/games/1/rounds"
    }
  }
}
```
 
#### 4.4.4. `PUT /games/{gameId}` – Atnaujinti žaidimą
 
Reikalingi visi laukai. Zonos po sukūrimo keisti negalima.
 
**Teisės:** Žaidimo kūrėjas arba administratorius.
 
| Kodas | Reikšmė |
|---|---|
| 200 | Žaidimas atnaujintas |
| 400 | Neteisingas ID arba validacijos klaida |
| 401 | Nėra prieigos žetono arba jis negalioja |
| 403 | Naudotojas nėra žaidimo kūrėjas ar administratorius |
| 404 | Žaidimas nerastas |
 
**Užklausa:**
 
```http
PUT /games/7 HTTP/1.1
Authorization: Bearer <accessToken>
Content-Type: application/json
 
{
  "name": "Vakaras Ąžuolyne",
  "is_public": true,
  "is_locked": true,
  "max_players": 8,
  "head_start_min": 20
}
```
 
**Atsakymas:**
 
```http
HTTP/1.1 200 OK
Content-Type: application/json
 
{
  "id": 7,
  "name": "Vakaras Ąžuolyne",
  "created_by": 2,
  "zone_id": 4,
  "status": "lobby",
  "is_public": true,
  "is_locked": true,
  "max_players": 8,
  "head_start_min": 20,
  "created_at": "2026-11-19T17:45:03.112Z",
  "started_at": null,
  "ended_at": null,
  "_links": {
    "self": {
      "href": "/games/7"
    },
    "rounds": {
      "href": "/games/7/rounds"
    }
  }
}
```
 
#### 4.4.5. `DELETE /games/{gameId}` – Ištrinti žaidimą
 
Kartu ištrinami žaidimo raundai ir įvykiai.
 
**Teisės:** Žaidimo kūrėjas arba administratorius.
 
| Kodas | Reikšmė |
|---|---|
| 204 | Žaidimas ištrintas (atsakymo kūno nėra) |
| 400 | Neteisingas žaidimo ID |
| 401 | Nėra prieigos žetono arba jis negalioja |
| 403 | Naudotojas nėra žaidimo kūrėjas ar administratorius |
| 404 | Žaidimas nerastas |
 
**Užklausa:**
 
```http
DELETE /games/7 HTTP/1.1
Authorization: Bearer <accessToken>
```
 
**Atsakymas:**
 
```http
HTTP/1.1 204 No Content
```
 
 
### 4.5. Raundai
 
#### 4.5.1. `GET /games/{gameId}/rounds` – Žaidimo raundų sąrašas
 
**Teisės:** Bet kuris prisijungęs naudotojas.
 
| Kodas | Reikšmė |
|---|---|
| 200 | Raundai, surikiuoti pagal numerį |
| 400 | Neteisingas žaidimo ID |
| 401 | Nėra prieigos žetono arba jis negalioja |
| 404 | Žaidimas nerastas |
 
**Užklausa:**
 
```http
GET /games/1/rounds HTTP/1.1
Authorization: Bearer <accessToken>
```
 
**Atsakymas:**
 
```http
HTTP/1.1 200 OK
Content-Type: application/json
 
[
  {
    "id": 1,
    "game_id": 1,
    "found_by": 1,
    "round_number": 1,
    "status": "finished",
    "started_at": "2026-10-04T11:00:00.000Z",
    "ended_at": "2026-10-04T11:52:00.000Z",
    "_links": {
      "self": {
        "href": "/games/1/rounds/1"
      },
      "game": {
        "href": "/games/1"
      },
      "events": {
        "href": "/games/1/rounds/1/events"
      }
    }
  }
]
```
 
#### 4.5.2. `POST /games/{gameId}/rounds` – Sukurti raundą
 
Užklausos kūnas nereikalingas – raundo numeris priskiriamas automatiškai, būsena – `pending`.
 
**Teisės:** Žaidimo kūrėjas arba administratorius.
 
| Kodas | Reikšmė |
|---|---|
| 201 | Raundas sukurtas |
| 400 | Neteisingas žaidimo ID |
| 401 | Nėra prieigos žetono arba jis negalioja |
| 403 | Naudotojas nėra žaidimo kūrėjas ar administratorius |
| 404 | Žaidimas nerastas |
| 422 | Žaidimas jau baigtas |
 
**Užklausa:**
 
```http
POST /games/4/rounds HTTP/1.1
Authorization: Bearer <accessToken>
```
 
**Atsakymas:**
 
```http
HTTP/1.1 201 Created
Content-Type: application/json
 
{
  "id": 14,
  "game_id": 4,
  "found_by": null,
  "round_number": 1,
  "status": "pending",
  "started_at": null,
  "ended_at": null,
  "_links": {
    "self": {
      "href": "/games/4/rounds/14"
    },
    "game": {
      "href": "/games/4"
    },
    "events": {
      "href": "/games/4/rounds/14/events"
    }
  }
}
```
 
#### 4.5.3. `GET /games/{gameId}/rounds/{roundId}` – Raundo informacija
 
**Teisės:** Bet kuris prisijungęs naudotojas.
 
| Kodas | Reikšmė |
|---|---|
| 200 | Raundas |
| 400 | Neteisingas žaidimo, raundo arba įvykio ID |
| 401 | Nėra prieigos žetono arba jis negalioja |
| 404 | Žaidimas arba raundas nerastas |
 
**Užklausa:**
 
```http
GET /games/1/rounds/1 HTTP/1.1
Authorization: Bearer <accessToken>
```
 
**Atsakymas:**
 
```http
HTTP/1.1 200 OK
Content-Type: application/json
 
{
  "id": 1,
  "game_id": 1,
  "found_by": 1,
  "round_number": 1,
  "status": "finished",
  "started_at": "2026-10-04T11:00:00.000Z",
  "ended_at": "2026-10-04T11:52:00.000Z",
  "_links": {
    "self": {
      "href": "/games/1/rounds/1"
    },
    "game": {
      "href": "/games/1"
    },
    "events": {
      "href": "/games/1/rounds/1/events"
    }
  }
}
```
 
#### 4.5.4. `PUT /games/{gameId}/rounds/{roundId}` – Atnaujinti raundą
 
Reikalingi visi laukai. Žaidime vienu metu gali būti tik vienas aktyvus raundas; pabaigos laikas negali būti ankstesnis už pradžios.
 
**Teisės:** Žaidimo kūrėjas arba administratorius.
 
| Kodas | Reikšmė |
|---|---|
| 200 | Raundas atnaujintas |
| 400 | Neteisingas ID arba validacijos klaida |
| 401 | Nėra prieigos žetono arba jis negalioja |
| 403 | Naudotojas nėra žaidimo kūrėjas ar administratorius |
| 404 | Žaidimas arba raundas nerastas |
| 409 | Žaidime jau yra aktyvus raundas |
| 422 | Pažeistas apribojimas (pabaiga ankstesnė už pradžią) arba nurodytas naudotojas neegzistuoja |
 
**Užklausa:**
 
```http
PUT /games/4/rounds/14 HTTP/1.1
Authorization: Bearer <accessToken>
Content-Type: application/json
 
{
  "status": "active",
  "started_at": "2026-11-20T15:00:00.000Z",
  "ended_at": null,
  "found_by": null
}
```
 
**Atsakymas:**
 
```http
HTTP/1.1 200 OK
Content-Type: application/json
 
{
  "id": 14,
  "game_id": 4,
  "found_by": null,
  "round_number": 1,
  "status": "active",
  "started_at": "2026-11-20T15:00:00.000Z",
  "ended_at": null,
  "_links": {
    "self": {
      "href": "/games/4/rounds/14"
    },
    "game": {
      "href": "/games/4"
    },
    "events": {
      "href": "/games/4/rounds/14/events"
    }
  }
}
```
 
#### 4.5.5. `DELETE /games/{gameId}/rounds/{roundId}` – Ištrinti raundą
 
Kartu ištrinami raundo įvykiai.
 
**Teisės:** Tik administratorius.
 
| Kodas | Reikšmė |
|---|---|
| 204 | Raundas ištrintas (atsakymo kūno nėra) |
| 400 | Neteisingas žaidimo, raundo arba įvykio ID |
| 401 | Nėra prieigos žetono arba jis negalioja |
| 403 | Veiksmas leidžiamas tik administratoriui |
| 404 | Žaidimas arba raundas nerastas |
 
**Užklausa:**
 
```http
DELETE /games/4/rounds/14 HTTP/1.1
Authorization: Bearer <accessToken>
```
 
**Atsakymas:**
 
```http
HTTP/1.1 204 No Content
```
 
 
### 4.6. Įvykiai
 
#### 4.6.1. `GET /games/{gameId}/rounds/{roundId}/events` – Raundo įvykių sąrašas
 
**Teisės:** Bet kuris prisijungęs naudotojas.
 
| Kodas | Reikšmė |
|---|---|
| 200 | Įvykiai, surikiuoti pagal sukūrimo laiką |
| 400 | Neteisingas žaidimo, raundo arba įvykio ID |
| 401 | Nėra prieigos žetono arba jis negalioja |
| 404 | Žaidimas arba raundas nerastas |
 
**Užklausa:**
 
```http
GET /games/1/rounds/1/events HTTP/1.1
Authorization: Bearer <accessToken>
```
 
**Atsakymas:**
 
```http
HTTP/1.1 200 OK
Content-Type: application/json
 
[
  {
    "id": 1,
    "round_id": 1,
    "template_id": 1,
    "created_by": 2,
    "resolved_by": 3,
    "status": "answered",
    "answer": "Taip",
    "created_at": "2026-10-04T11:20:00.000Z",
    "resolved_at": "2026-10-04T11:21:00.000Z",
    "_links": {
      "self": {
        "href": "/games/1/rounds/1/events/1"
      },
      "round": {
        "href": "/games/1/rounds/1"
      }
    }
  }
]
```
 
#### 4.6.2. `POST /games/{gameId}/rounds/{roundId}/events` – Sukurti įvykį
 
Įvykio autoriumi tampa prisijungęs naudotojas. Įvykį galima kurti tik aktyviame raunde.
 
**Teisės:** Bet kuris prisijungęs naudotojas.
 
| Kodas | Reikšmė |
|---|---|
| 201 | Įvykis sukurtas |
| 400 | Neteisingas ID arba validacijos klaida |
| 401 | Nėra prieigos žetono arba jis negalioja |
| 404 | Žaidimas arba raundas nerastas |
| 422 | Raundas neaktyvus arba šablonas neegzistuoja |
 
**Užklausa:**
 
```http
POST /games/3/rounds/8/events HTTP/1.1
Authorization: Bearer <accessToken>
Content-Type: application/json
 
{
  "template_id": 3
}
```
 
**Atsakymas:**
 
```http
HTTP/1.1 201 Created
Content-Type: application/json
 
{
  "id": 21,
  "round_id": 8,
  "template_id": 3,
  "created_by": 2,
  "resolved_by": null,
  "status": "pending",
  "answer": null,
  "created_at": "2026-11-19T17:50:41.903Z",
  "resolved_at": null,
  "_links": {
    "self": {
      "href": "/games/3/rounds/8/events/21"
    },
    "round": {
      "href": "/games/3/rounds/8"
    }
  }
}
```
 
#### 4.6.3. `GET /games/{gameId}/rounds/{roundId}/events/{eventId}` – Įvykio informacija
 
**Teisės:** Bet kuris prisijungęs naudotojas.
 
| Kodas | Reikšmė |
|---|---|
| 200 | Įvykis |
| 400 | Neteisingas žaidimo, raundo arba įvykio ID |
| 401 | Nėra prieigos žetono arba jis negalioja |
| 404 | Žaidimas, raundas arba įvykis nerastas |
 
**Užklausa:**
 
```http
GET /games/1/rounds/1/events/2 HTTP/1.1
Authorization: Bearer <accessToken>
```
 
**Atsakymas:**
 
```http
HTTP/1.1 200 OK
Content-Type: application/json
 
{
  "id": 2,
  "round_id": 1,
  "template_id": 8,
  "created_by": 3,
  "resolved_by": 5,
  "status": "completed",
  "answer": "Nuotrauka su pilies bokštu",
  "created_at": "2026-10-04T11:25:00.000Z",
  "resolved_at": "2026-10-04T11:40:00.000Z",
  "_links": {
    "self": {
      "href": "/games/1/rounds/1/events/2"
    },
    "round": {
      "href": "/games/1/rounds/1"
    }
  }
}
```
 
#### 4.6.4. `PUT /games/{gameId}/rounds/{roundId}/events/{eventId}` – Atnaujinti įvykį
 
Reikalingi visi laukai. `resolved_at` turi būti `null` tada ir tik tada, kai būsena `pending`.
 
**Teisės:** Įvykio autorius arba administratorius.
 
| Kodas | Reikšmė |
|---|---|
| 200 | Įvykis atnaujintas |
| 400 | Neteisingas ID arba validacijos klaida |
| 401 | Nėra prieigos žetono arba jis negalioja |
| 403 | Naudotojas nėra įvykio autorius ar administratorius |
| 404 | Žaidimas, raundas arba įvykis nerastas |
| 422 | Būsena nesuderinama su `resolved_at` arba nurodytas naudotojas neegzistuoja |
 
**Užklausa:**
 
```http
PUT /games/3/rounds/8/events/21 HTTP/1.1
Authorization: Bearer <accessToken>
Content-Type: application/json
 
{
  "status": "answered",
  "answer": "Ne, esu toliau",
  "resolved_by": 4,
  "resolved_at": "2026-11-19T17:55:00.000Z"
}
```
 
**Atsakymas:**
 
```http
HTTP/1.1 200 OK
Content-Type: application/json
 
{
  "id": 21,
  "round_id": 8,
  "template_id": 3,
  "created_by": 2,
  "resolved_by": 4,
  "status": "answered",
  "answer": "Ne, esu toliau",
  "created_at": "2026-11-19T17:50:41.903Z",
  "resolved_at": "2026-11-19T17:55:00.000Z",
  "_links": {
    "self": {
      "href": "/games/3/rounds/8/events/21"
    },
    "round": {
      "href": "/games/3/rounds/8"
    }
  }
}
```
 
#### 4.6.5. `DELETE /games/{gameId}/rounds/{roundId}/events/{eventId}` – Ištrinti įvykį
 
 
**Teisės:** Tik administratorius.
 
| Kodas | Reikšmė |
|---|---|
| 204 | Įvykis ištrintas (atsakymo kūno nėra) |
| 400 | Neteisingas žaidimo, raundo arba įvykio ID |
| 401 | Nėra prieigos žetono arba jis negalioja |
| 403 | Veiksmas leidžiamas tik administratoriui |
| 404 | Žaidimas, raundas arba įvykis nerastas |
 
**Užklausa:**
 
```http
DELETE /games/3/rounds/8/events/21 HTTP/1.1
Authorization: Bearer <accessToken>
```
 
**Atsakymas:**
 
```http
HTTP/1.1 204 No Content
```
 
 
### 4.7. Žinynai
 
#### 4.7.1. `GET /zones` – Zonų sąrašas
 
Naudojamas renkantis zoną kuriant žaidimą.
 
**Teisės:** Viešas metodas.
 
| Kodas | Reikšmė |
|---|---|
| 200 | Zonos, surikiuotos pagal miestą ir pavadinimą |
 
**Užklausa:**
 
```http
GET /zones HTTP/1.1
```
 
**Atsakymas:**
 
```http
HTTP/1.1 200 OK
Content-Type: application/json
 
[
  {
    "id": 4,
    "city": "Kaunas",
    "name": "Ąžuolynas"
  },
  {
    "id": 2,
    "city": "Kaunas",
    "name": "Naujamiestis"
  },
  {
    "id": 1,
    "city": "Kaunas",
    "name": "Senamiestis"
  }
]
```
 
#### 4.7.2. `GET /event-templates` – Įvykių šablonų sąrašas
 
Su `zoneId` grąžinami nurodytos zonos ir bendri (`zone_id = null`) šablonai; be parametro – visi šablonai.
 
**Teisės:** Viešas metodas.
 
| Kodas | Reikšmė |
|---|---|
| 200 | Šablonai, surikiuoti pagal tipą ir pavadinimą |
| 400 | Neteisingas zoneId |
 
**Užklausa:**
 
```http
GET /event-templates?zoneId=1 HTTP/1.1
```
 
**Atsakymas:**
 
```http
HTTP/1.1 200 OK
Content-Type: application/json
 
[
  {
    "id": 1,
    "type": "question",
    "name": "Ar esi į šiaurę nuo manęs?",
    "description": "Taip/Ne klausimas. Atmeta pusę zonos.",
    "zone_id": null
  },
  {
    "id": 8,
    "type": "task",
    "name": "Nusifotografuok prie Kauno pilies",
    "description": "Nuotraukoje turi matytis pilies bokštas.",
    "zone_id": 1
  }
]
```
# 5. Išvados
 
1. Hierarchiniai URL (`/games/{gameId}/rounds/{roundId}/events`) leido teises tikrinti per tėvinį resursą – pavyzdžiui, raundus valdo tas, kas sukūrė žaidimą. Tačiau dėl to kiekvienas kontroleris turi patikrinti visą grandinę (žaidimas → raundas → įvykis), kad grąžintų 404 būtent tam objektui, kurio nėra.
2. Duomenys tikrinami dviem lygiais: Zod schemos tikrina užklausos formą, o duomenų bazės apribojimai – taisykles, kurių schema nemato (vienas aktyvus raundas žaidime, pabaigos laikas ne ankstesnis už pradžią). Klaidų apdorojimas šiuos pažeidimus paverčia 409 ir 422 kodais, todėl API į neteisingus duomenis neatsako 500.
3. Teisės tikrinamos ir naudotojo sąsajoje, ir serveryje, tačiau jų paskirtis skiriasi. Sąsajoje paslėpti mygtukai yra tik patogumas naudotojui – per Postman tą patį `DELETE` metodą galima iškviesti tiesiogiai, todėl tikroji apsauga yra serveryje, kuris grąžina 403.
4. Sistema įdiegta trijose debesijos platformose: duomenų bazė – Supabase, API – Render, naudotojo sąsaja – Vercel. Render nepalaiko IPv6, todėl prie Supabase teko jungtis per Session pooler, o Vercel prireikė nukreipimo taisyklės, kad atnaujinus puslapį vienpuslapė aplikacija nebūtų grąžinama kaip 404. Nemokami planai tinka prototipui, tačiau po neaktyvumo Supabase projektas sustabdomas, o Render paslauga „užmiega“.
5. Komponentų pakartotinis naudojimas sumažino kodo kiekį: ta pati forma naudojama žaidimui kurti ir redaguoti, o vienas modalinio lango komponentas – visiems kūrimo, redagavimo ir trynimo veiksmams. Todėl pakeitimas formoje iškart galioja abiem atvejams, o visi modaliniai langai atrodo ir elgiasi vienodai.
6. Wireframe'ų projektavimas prieš realizaciją padėjo susidėlioti puslapių struktūrą ir maršrutus. Išvada – API ir naudotojo sąsają verta projektuoti kartu.
7. Autentifikacijai naudojami du žetonai: trumpalaikis prieigos žetonas (15 min.) riboja žalą, jei jis būtų pavogtas, o atnaujinimo žetonas (7 d.) leidžia naudotojui neprisijungti iš naujo. Atnaujinimo žetonas duomenų bazėje saugomas tik kaip maiša ir kiekvieną kartą keičiamas nauju (rotacija). Rotacija sukėlė problemą kliento pusėje: kai kelios užklausos vienu metu gaudavo 401, kiekviena bandydavo atnaujinti žetoną, o antrasis bandymas su jau atšauktu žetonu nutraukdavo sesiją. Problema išspręsta užtikrinus, kad vienu metu vyktų tik viena atnaujinimo užklausa, kurios rezultato laukia visos kitos.