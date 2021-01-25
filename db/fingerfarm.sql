CREATE TABLE users (
    id integer PRIMARY KEY,
    ext_id text NOT NULL,
    authsource text NOT NULL,
    username text,
    displayname text,
    plan text,
    project text,
    token text NOT NULL,
    lastupdate DEFAULT CURRENT_TIMESTAMP
 );