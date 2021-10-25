DROP TABLE IF EXISTS user;

CREATE TABLE user
(
    id        INT AUTO_INCREMENT
        PRIMARY KEY,
    mail      VARCHAR(200) NOT NULL,
    password  VARCHAR(200) NOT NULL,
    birthdate DATE         NOT NULL,
    address   TEXT         NOT NULL
);

