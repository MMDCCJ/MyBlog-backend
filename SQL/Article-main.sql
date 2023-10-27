USE blog;
-- 文章梗概
CREATE TABLE Article_Main (
    ID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    AID INT NOT NULL,
    article TEXT NOT NULL,
    -- 将AID 与 Article表的ID关联起来，并设置级联更新和级联删除
    foreign key(AID) references Article(ID) on update cascade on delete cascade
);