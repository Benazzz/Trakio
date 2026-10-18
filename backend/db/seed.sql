-- Trakio seed duomenys (Kaunas)
-- Paleisti iškart po schema.sql (schema išvalo ir sukuria lenteles iš naujo).
-- Visų naudotojų slaptažodis: Trakio123!
-- Koordinatės apytikslės.

-- ============ USERS ============
INSERT INTO users (id, email, username, password_hash, role, is_blocked, created_at, deleted_at)
OVERRIDING SYSTEM VALUE VALUES
  (1, 'admin@trakio.lt',  'admin',     '$2b$10$6W7sRG/F.DOssPn4WB/NjeCX.h5rcy/D2lOhpZAmlScWFHL08Awi.', 'admin',  false, '2026-09-20 10:00+03', NULL),
  (2, 'tomas@trakio.lt',  'tomas_k',   '$2b$10$6W7sRG/F.DOssPn4WB/NjeCX.h5rcy/D2lOhpZAmlScWFHL08Awi.', 'player', false, '2026-09-22 18:30+03', NULL),
  (3, 'ieva@trakio.lt',   'ieva.p',    '$2b$10$6W7sRG/F.DOssPn4WB/NjeCX.h5rcy/D2lOhpZAmlScWFHL08Awi.', 'player', false, '2026-09-23 12:10+03', NULL),
  (4, 'mantas@trakio.lt', 'mantas_r',  '$2b$10$6W7sRG/F.DOssPn4WB/NjeCX.h5rcy/D2lOhpZAmlScWFHL08Awi.', 'player', false, '2026-09-25 20:45+03', NULL),
  (5, 'greta@trakio.lt',  'greta_v',   '$2b$10$6W7sRG/F.DOssPn4WB/NjeCX.h5rcy/D2lOhpZAmlScWFHL08Awi.', 'player', false, '2026-09-28 09:15+03', NULL),
  (6, 'lukas@trakio.lt',  'lukas_s',   '$2b$10$6W7sRG/F.DOssPn4WB/NjeCX.h5rcy/D2lOhpZAmlScWFHL08Awi.', 'player', false, '2026-10-01 16:00+03', NULL),
  (7, 'rugile@trakio.lt', 'rugile_m',  '$2b$10$6W7sRG/F.DOssPn4WB/NjeCX.h5rcy/D2lOhpZAmlScWFHL08Awi.', 'player', false, '2026-10-02 19:20+03', NULL),
  -- užblokuotas naudotojas (admin funkcionalumui)
  (8, 'domas@trakio.lt',  'domas_b',   '$2b$10$6W7sRG/F.DOssPn4WB/NjeCX.h5rcy/D2lOhpZAmlScWFHL08Awi.', 'player', true,  '2026-10-03 11:00+03', NULL),
  -- soft-deleted naudotojas, žaidęs 1 žaidime
  (9, 'paulius@trakio.lt','paulius_j', '$2b$10$6W7sRG/F.DOssPn4WB/NjeCX.h5rcy/D2lOhpZAmlScWFHL08Awi.', 'player', false, '2026-09-24 14:00+03', '2026-10-12 08:30+03');

-- ============ ZONES ============
INSERT INTO zones (id, city, name, center_lat, center_lng, radius_m)
OVERRIDING SYSTEM VALUE VALUES
  (1, 'Kaunas', 'Senamiestis',  54.8972, 23.8862,  900),
  (2, 'Kaunas', 'Naujamiestis', 54.8980, 23.9120, 1200),
  (3, 'Kaunas', 'Žaliakalnis',  54.9010, 23.9300, 1500),
  (4, 'Kaunas', 'Ąžuolynas',    54.9005, 23.9440,  800),
  (5, 'Kaunas', 'Panemunė',     54.8830, 23.9650, 1400);

-- ============ EVENT TEMPLATES ============
-- zone_id NULL = bendras šablonas bet kuriai zonai
INSERT INTO event_templates (id, type, name, description, zone_id, poi_lat, poi_lng)
OVERRIDING SYSTEM VALUE VALUES
  -- bendri klausimai
  (1,  'question', 'Ar esi į šiaurę nuo manęs?',           'Taip/Ne klausimas. Atmeta pusę zonos.', NULL, NULL, NULL),
  (2,  'question', 'Ar esi į rytus nuo manęs?',            'Taip/Ne klausimas. Atmeta pusę zonos.', NULL, NULL, NULL),
  (3,  'question', 'Ar esi arčiau nei 500 m nuo manęs?',   'Atstumas skaičiuojamas tiesia linija.', NULL, NULL, NULL),
  (4,  'question', 'Ar matai Nemuną arba Nerį?',           'Upė turi būti matoma iš tavo vietos.',  NULL, NULL, NULL),
  (5,  'question', 'Ar esi parke ar skvere?',              'Žalioji zona, pažymėta žemėlapyje.',   NULL, NULL, NULL),
  -- zonų klausimai
  (6,  'question', 'Ar esi arčiau Rotušės nei Kauno pilies?',               NULL, 1, NULL, NULL),
  (7,  'question', 'Ar esi į vakarus nuo Šv. Mykolo Arkangelo bažnyčios?',  NULL, 2, NULL, NULL),
  -- užduotys prie objektų
  (8,  'task', 'Nusifotografuok prie Kauno pilies',            'Nuotraukoje turi matytis pilies bokštas.',        1, 54.8990, 23.8851),
  (9,  'task', 'Rask Perkūno namą',                            'Atsakyk, kuriame amžiuje jis pastatytas.',        1, 54.8963, 23.8873),
  (10, 'task', 'Nueik prie Šv. Mykolo Arkangelo bažnyčios',    'Užlipk iki laiptų viršaus.',                      2, 54.8977, 23.9216),
  (11, 'task', 'Pakilk Žaliakalnio funikulieriumi',            'Atsiųsk nuotrauką iš viršutinės stotelės.',       3, 54.8988, 23.9240),
  (12, 'task', 'Nusifotografuok prie Kristaus Prisikėlimo bažnyčios', 'Nuotrauka su bažnyčios bokštu fone.',      3, 54.9027, 23.9297),
  (13, 'task', 'Rask Dainų slėnį',                             'Atsistok scenos priekyje.',                       4, 54.9012, 23.9420),
  (14, 'task', 'Panemunės šile rask Nemuno pakrantę',          'Atsiųsk nuotrauką su upe.',                       5, 54.8845, 23.9600),
  -- bendra užduotis be objekto
  (15, 'task', 'Nusifotografuok prie artimiausios gatvės lentelės', 'Gatvės pavadinimas turi būti įskaitomas.',   NULL, NULL, NULL);

-- ============ GAMES ============
INSERT INTO games (id, name, created_by, zone_id, status, is_public, is_locked, max_players, head_start_min, created_at, started_at, ended_at)
OVERRIDING SYSTEM VALUE VALUES
  (1, 'Senamiesčio slėpynės',     2, 1, 'finished', true,  true,  6, 15, '2026-10-03 20:00+03', '2026-10-04 14:00+03', '2026-10-04 17:20+03'),
  (2, 'Laisvės alėjos medžioklė', 3, 2, 'finished', true,  true,  5, 20, '2026-10-10 18:00+03', '2026-10-11 12:00+03', '2026-10-11 15:00+03'),
  (3, 'Žaliakalnio iššūkis',      4, 3, 'active',   true,  true,  8, 30, '2026-10-17 21:00+03', '2026-10-18 13:00+03', NULL),
  (4, 'Ąžuolyno vakaras',         2, 4, 'lobby',    true,  false, 4, 10, '2026-10-18 09:30+03', NULL, NULL),
  (5, 'Draugų žaidimas',          5, 1, 'lobby',    false, true,  4, 15, '2026-10-18 10:15+03', NULL, NULL),
  (6, 'Panemunės slėpynės',       6, 5, 'lobby',    true,  false, 6, 20, '2026-10-18 11:40+03', NULL, NULL);

-- ============ GAME PLAYERS ============
INSERT INTO game_players (game_id, user_id, joined_at) VALUES
  (1, 2, '2026-10-03 20:00+03'), (1, 3, '2026-10-03 20:12+03'), (1, 4, '2026-10-03 21:05+03'),
  (1, 5, '2026-10-04 09:30+03'), (1, 9, '2026-10-04 10:00+03'),
  (2, 3, '2026-10-10 18:00+03'), (2, 4, '2026-10-10 18:20+03'), (2, 6, '2026-10-10 19:45+03'),
  (2, 7, '2026-10-11 08:10+03'),
  (3, 4, '2026-10-17 21:00+03'), (3, 5, '2026-10-17 21:30+03'), (3, 6, '2026-10-18 08:00+03'),
  (3, 7, '2026-10-18 09:15+03'), (3, 2, '2026-10-18 10:00+03'),
  (4, 2, '2026-10-18 09:30+03'), (4, 3, '2026-10-18 10:05+03'),
  (5, 5, '2026-10-18 10:15+03'), (5, 6, '2026-10-18 10:40+03'),
  (6, 6, '2026-10-18 11:40+03'), (6, 7, '2026-10-18 12:00+03'), (6, 4, '2026-10-18 12:30+03');

-- ============ ROUNDS ============
-- started_at = head start pradžia; ended_at = komanda surasta
INSERT INTO rounds (id, game_id, found_by, round_number, status, started_at, ended_at)
OVERRIDING SYSTEM VALUE VALUES
  -- žaidimas 1 (laimi 2 raundo komanda: 70 min)
  (1, 1, 2, 1, 'finished', '2026-10-04 14:00+03', '2026-10-04 14:52+03'),
  (2, 1, 5, 2, 'finished', '2026-10-04 15:00+03', '2026-10-04 16:10+03'),
  (3, 1, 3, 3, 'finished', '2026-10-04 16:20+03', '2026-10-04 17:20+03'),
  -- žaidimas 2 (laimi 2 raundas: 70 min)
  (4, 2, 3, 1, 'finished', '2026-10-11 12:00+03', '2026-10-11 12:45+03'),
  (5, 2, 4, 2, 'finished', '2026-10-11 12:55+03', '2026-10-11 14:05+03'),
  (6, 2, 6, 3, 'finished', '2026-10-11 14:15+03', '2026-10-11 15:00+03'),
  -- žaidimas 3 (vyksta)
  (7, 3, 4, 1, 'finished', '2026-10-18 13:00+03', '2026-10-18 13:58+03'),
  (8, 3, NULL, 2, 'active', '2026-10-18 14:10+03', NULL);

-- ============ ROUND HIDERS ============
INSERT INTO round_hiders (round_id, user_id) VALUES
  (1, 3),
  (2, 4), (2, 9),
  (3, 5),
  (4, 6),
  (5, 7),
  (6, 3),
  (7, 5),
  (8, 6), (8, 7);

-- ============ EVENTS ============
-- klausimas: created_by = ieškotojas, resolved_by = besislepiantysis, status answered
-- užduotis:  created_by = besislepiantysis, resolved_by = ieškotojas, status completed
INSERT INTO events (id, round_id, template_id, created_by, resolved_by, status, answer, created_at, resolved_at)
OVERRIDING SYSTEM VALUE VALUES
  -- raundas 1 (slepiasi ieva.p)
  (1,  1, 1,  2, 3,    'answered',  'Taip',                         '2026-10-04 14:20+03', '2026-10-04 14:21+03'),
  (2,  1, 8,  3, 5,    'completed', 'Nuotrauka su pilies bokštu',   '2026-10-04 14:25+03', '2026-10-04 14:40+03'),
  (3,  1, 6,  4, 3,    'answered',  'Arčiau pilies',                '2026-10-04 14:30+03', '2026-10-04 14:32+03'),
  -- raundas 2 (slepiasi mantas_r ir paulius_j)
  (4,  2, 2,  5, 4,    'answered',  'Ne',                           '2026-10-04 15:20+03', '2026-10-04 15:22+03'),
  (5,  2, 9,  4, 3,    'completed', 'XV a. pabaiga',                '2026-10-04 15:30+03', '2026-10-04 15:55+03'),
  (6,  2, 3,  2, 9,    'answered',  'Ne',                           '2026-10-04 15:40+03', '2026-10-04 15:41+03'),
  -- raundas 3 (slepiasi greta_v)
  (7,  3, 5,  3, 5,    'answered',  'Taip',                         '2026-10-04 16:45+03', '2026-10-04 16:47+03'),
  -- raundas 4 (slepiasi lukas_s)
  (8,  4, 1,  3, 6,    'answered',  'Ne',                           '2026-10-11 12:20+03', '2026-10-11 12:21+03'),
  (9,  4, 10, 6, 7,    'completed', 'Užlipta iki laiptų viršaus',   '2026-10-11 12:25+03', '2026-10-11 12:38+03'),
  -- raundas 5 (slepiasi rugile_m)
  (10, 5, 7,  4, 7,    'answered',  'Taip',                         '2026-10-11 13:20+03', '2026-10-11 13:22+03'),
  (11, 5, 4,  6, 7,    'answered',  'Ne',                           '2026-10-11 13:40+03', '2026-10-11 13:41+03'),
  -- raundas 6 (slepiasi ieva.p)
  (12, 6, 15, 3, 6,    'completed', 'Kęstučio g. lentelė',          '2026-10-11 14:30+03', '2026-10-11 14:44+03'),
  -- raundas 7 (slepiasi greta_v)
  (13, 7, 2,  4, 5,    'answered',  'Taip',                         '2026-10-18 13:25+03', '2026-10-18 13:26+03'),
  (14, 7, 11, 5, 2,    'completed', 'Nuotrauka iš viršutinės stotelės', '2026-10-18 13:30+03', '2026-10-18 13:50+03'),
  -- raundas 8 (vyksta, slepiasi lukas_s ir rugile_m)
  (15, 8, 3,  2, 6,    'answered',  'Taip',                         '2026-10-18 14:30+03', '2026-10-18 14:31+03'),
  (16, 8, 12, 6, NULL, 'pending',   NULL,                           '2026-10-18 14:40+03', NULL),
  (17, 8, 1,  5, NULL, 'pending',   NULL,                           '2026-10-18 14:50+03', NULL);

-- ============ IDENTITY SEKŲ ATSTATYMAS ============
-- kad nauji įrašai per API gautų id po seed'o įrašų
SELECT setval(pg_get_serial_sequence('users', 'id'),           (SELECT max(id) FROM users));
SELECT setval(pg_get_serial_sequence('zones', 'id'),           (SELECT max(id) FROM zones));
SELECT setval(pg_get_serial_sequence('event_templates', 'id'), (SELECT max(id) FROM event_templates));
SELECT setval(pg_get_serial_sequence('games', 'id'),           (SELECT max(id) FROM games));
SELECT setval(pg_get_serial_sequence('rounds', 'id'),          (SELECT max(id) FROM rounds));
SELECT setval(pg_get_serial_sequence('events', 'id'),          (SELECT max(id) FROM events));