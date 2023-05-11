USE blog;

CREATE TABLE Article (
   ID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
   firstUpdateDate Date NOT NULL,
   lastUpdateDate Date NOT NULL,
   title VARCHAR(50) NOT NULL,
   articleBody TEXT NOT NULL
);