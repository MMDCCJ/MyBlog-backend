USE blog;
-- 文章内容
CREATE TABLE Article (
   ID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
   firstUpdateDate Date NOT NULL,
   lastUpdateDate Date NOT NULL,
   title VARCHAR(50) NOT NULL,
   -- 文章主体
   articleBody TEXT NOT NULL,
   -- 文章类型
   articleType varchar(20) NOT NULL,
   -- 是否被删除 N 未被删除 Y 已被删除
   isDelete char(1) NOT NULL,
   -- 作者
   author varchar(10)
);