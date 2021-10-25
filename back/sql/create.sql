DROP TABLE IF EXISTS user;

CREATE TABLE user
(
    id        INT AUTO_INCREMENT
        PRIMARY KEY,
    mail      VARCHAR(200) NOT NULL,
    lastname  VARCHAR(20)  NOT NULL,
    firstname VARCHAR(20)  NOT NULL,
    password  VARCHAR(200) NOT NULL,
    birthdate VARCHAR(10)  NOT NULL,
    address   TEXT         NOT NULL
);
