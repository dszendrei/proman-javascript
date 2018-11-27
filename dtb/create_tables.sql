DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS boards;
DROP TABLE IF EXISTS cards;

CREATE TABLE users (
  id serial NOT NULL,
  username varchar(10),
  password varchar,
  PRIMARY KEY (id)
);

CREATE TABLE boards (
  id serial NOT NULL,
  title varchar,
  is_active boolean,
  user_id integer,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE cards (
  id serial NOT NULL,
  title varchar,
  status_id integer,
  board_id integer,
  user_id integer,
  PRIMARY KEY (id),
  FOREIGN KEY (board_id) REFERENCES boards(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (id, username, password)
  VALUES (1, 'tomi', '$2b$12$bRs3qYWOdNF9oqUy9aus6Oku9AFkdClsbTXtVA66JClVRyCgrMSeC');

INSERT INTO users (id, username, password)
  VALUES (2, 'daneel', '$2b$12$bRs3qYWOdNF9oqUy9aus6Oku9AFkdClsbTXtVA66JClVRyCgrMSeC');

INSERT INTO boards (id, title, is_active, user_id)
  VALUES (1, 'Test Board 1', FALSE, 1);

INSERT INTO boards (id, title, is_active, user_id)
  VALUES (2, 'Test Board 2', FALSE, 2);

INSERT INTO cards (id, title, status_id, board_id, user_id)
  VALUES (1, 'Task 1', 1, 1, 1);

INSERT INTO cards (id, title, status_id, board_id, user_id)
  VALUES (2, 'Task 2', 1, 1, 1);

INSERT INTO cards (id, title, status_id, board_id, user_id)
  VALUES (3, 'Task 3', 3, 1, 1);

INSERT INTO cards (id, title, status_id, board_id, user_id)
  VALUES (4, 'Task 4', 1, 2, 2);

INSERT INTO cards (id, title, status_id, board_id, user_id)
  VALUES (5, 'Task 5', 2, 2, 2);

INSERT INTO cards (id, title, status_id, board_id, user_id)
  VALUES (6, 'Task 6', 4, 2, 2);