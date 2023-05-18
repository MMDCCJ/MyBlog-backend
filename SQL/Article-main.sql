USE blog;

CREATE TABLE Article_Main (
    ID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    AID INT NOT NULL,
    article TEXT NOT NULL,
    foreign key(AID) references Article(ID) on update cascade on delete cascade
);