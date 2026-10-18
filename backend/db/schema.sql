DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS zones CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS game_players CASCADE;
DROP TABLE IF EXISTS rounds CASCADE;
DROP TABLE IF EXISTS round_hiders CASCADE;
DROP TABLE IF EXISTS event_templates CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS game_status;
DROP TYPE IF EXISTS round_status;
DROP TYPE IF EXISTS event_status;
DROP TYPE IF EXISTS event_type;

CREATE TYPE user_role as ENUM ('player', 'admin');
CREATE TYPE game_status as ENUM ('lobby', 'active', 'finished');
CREATE TYPE round_status as ENUM ('pending', 'active', 'finished');
CREATE TYPE event_status as ENUM ('pending', 'answered', 'completed');
CREATE TYPE event_type as ENUM ('task', 'question');

CREATE TABLE users (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email text NOT NULL,
    username text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    role user_role NOT NULL DEFAULT 'player',
    is_blocked boolean NOT NULL DEFAULT false,
    avatar_url text,
    created_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz 
);

CREATE UNIQUE INDEX users_email_active_unique ON users (email) WHERE deleted_at IS NULL;

CREATE TABLE zones (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    city text NOT NULL,
    name text NOT NULL,
    center_lat double precision NOT NULL CHECK (center_lat BETWEEN -90 AND 90),
    center_lng double precision NOT NULL CHECK (center_lng BETWEEN -180 AND 180),
    radius_m int NOT NULL CHECK (radius_m > 0)
);

CREATE TABLE games (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL,
    created_by bigint NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    zone_id bigint NOT NULL REFERENCES zones(id) ON DELETE RESTRICT,
    status game_status NOT NULL DEFAULT ('lobby'),
    is_public boolean NOT NULL DEFAULT false,
    is_locked boolean NOT NULL DEFAULT false,
    max_players int NOT NULL CHECK(max_players between 2 AND 20),
    head_start_min int NOT NULL CHECK(head_start_min > 0),
    created_at timestamptz NOT NULL DEFAULT now(),
    started_at timestamptz,
    ended_at timestamptz,
    CHECK (ended_at IS NULL OR ended_at >= started_at)
);

CREATE TABLE game_players(
    game_id bigint NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    user_id bigint NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    joined_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (game_id, user_id)
);

CREATE TABLE rounds (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    game_id bigint NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    found_by bigint REFERENCES users(id) ON DELETE RESTRICT,
    round_number int NOT NULL CHECK (round_number > 0),
    status round_status NOT NULL DEFAULT ('pending'),
    started_at timestamptz,
    ended_at timestamptz,
    UNIQUE (game_id, round_number),
    CHECK (ended_at IS NULL OR ended_at >= started_at)
);

CREATE UNIQUE INDEX rounds_one_active_per_game ON rounds (game_id) WHERE status = 'active';

CREATE TABLE round_hiders (
    round_id bigint NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
    user_id bigint NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    PRIMARY KEY (round_id, user_id)
);

CREATE TABLE event_templates (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type event_type NOT NULL,
    name text NOT NULL,
    description text,
    zone_id bigint REFERENCES zones(id) ON DELETE CASCADE,
    poi_lat double precision,
    poi_lng double precision,
    CHECK (
        (poi_lat IS NULL AND poi_lng IS NULL) OR 
        (poi_lat IS NOT NULL AND poi_lng IS NOT NULL)
    )
);

CREATE TABLE events (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    round_id bigint NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
    template_id bigint NOT NULL REFERENCES event_templates(id) ON DELETE RESTRICT,
    created_by bigint NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    resolved_by bigint REFERENCES users(id) ON DELETE RESTRICT,
    status event_status NOT NULL DEFAULT ('pending'),
    answer text,
    created_at timestamptz NOT NULL DEFAULT now(),
    resolved_at timestamptz,
    CHECK ((status = 'pending') = (resolved_at IS NULL))
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE round_hiders ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;