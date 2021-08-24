---
layout: post
title: MySQL workbench 예제) 테이블 생성 및 정보 입력하기
categories: DB
tags: [DB, MySQL, MySQL workbench]
sitemap :
  changefreq : daily
  priority : 1.0
---

> **구현 환경은 아래와 같습니다.**
>
> MySQL 5.7.35
>
> MySQL workbench 8.0.26







---

⚠️ **MySQL root 계정의 비밀번호를 알고 계신다는 가정 하에 작성하도록 하겠습니다.**

> 혹시 MySQL root 계정 비밀번호를 분실하셔서, 혹은 로그인 문제를 겪고 계시다면 
>
> 아래 링크를 참고하셔서 해결 후 진행하시면 됩니다.
>
> [MySQL 비밀번호 분실](https://blog.naver.com/tndus4243/222465409979)







## **1. MySQL workbench - root 계정으로 시작하기**

MySQL workbench에서  root 계정으로 시작해보겠습니다.

우선 MySQL workbench를 켭니다.![image](/assets/images/post_images/MySQL workbench/MySQL workbench첨부 Img 1.png)

원하는 작업 환경을 선택해주시고,

username에는 root를, password에는 root 계정의 비밀번호를 입력하신 뒤

Test connection을 누르시면, 아래와 같이 연결이 성공적으로 되었다는 알림창이 뜹니다.

![image](/assets/images/post_images/MySQL workbench/MySQL workbench첨부 Img 2.png)

---

## **2. 테이블 생성하고 정보 입력하기**

### 2-1. 새로운 스키마 생성

SCHEMAS 부분에서 우클릭 > 'Create Schema...' 선택

![image](/assets/images/post_images/MySQL workbench/MySQL workbench첨부 Img 3.png)

### 2-2. 스키마 이름 설정 후, 우측 하단의 'Apply' 클릭

![image](/assets/images/post_images/MySQL workbench/MySQL workbench첨부 Img 4.png)

### 2-3. 세부 설정을 원하는 대로 한 뒤 Apply > Close

![image](/assets/images/post_images/MySQL workbench/MySQL workbench첨부 Img 5.png)

![image](/assets/images/post_images/MySQL workbench/MySQL workbench첨부 Img 6.png)

### 그럼 아래와 같이 스키마가 생성된 것을 확인할 수 있습니다. 👏

![image](/assets/images/post_images/MySQL workbench/MySQL workbench첨부 Img 7.png)

###  💁‍♀️ 그럼 이제 방금 생성한 DB_test 더블클릭 후 테이블을 생성해봅시다!

![image](/assets/images/post_images/MySQL workbench/MySQL workbench첨부 Img 8.png)

### 2-4. 'CREATE' 로 테이블 생성하기

간단하게 userName, age, gender 정보를 담고 있는 'db_test' 테이블을 만들어보겠습니다.![image](/assets/images/post_images/MySQL workbench/MySQL workbench첨부 Img 9.png)

위와 같이 create 문을 입력한 뒤,

윈도우는 ctrl + enter

맥은 command + enter 하시면 테이블이 생성됩니다.







테이블이 잘 생성되었는지 확인하고 싶다면 아래와 같이 "select * from db_test;"를 입력하시고,

다시 command + enter 해보시면 아래와 같이 테이블이 생성된 것을 확인할 수 있습니다.

![image](/assets/images/post_images/MySQL workbench/MySQL workbench첨부 Img 10.png)

### 2-5. 이제 정보를 입력/수정해봅시다.

'insert into' 로 우리가 정한 userName, age, gender의 value값들을 입력해줍니다.

(잘 들어갔는지 확인하기 위한 "select * from db_test;" 과정은 생략하도록 하겠습니다.)![image](/assets/images/post_images/MySQL workbench/MySQL workbench첨부 Img 11.png)

위와 같이 입력한 데이터가 잘 들어갔습니다!

그럼 이제 조금 더 많은 정보를 넣어보겠습니다.

![image](/assets/images/post_images/MySQL workbench/MySQL workbench첨부 Img 12.png)

만약 한 column 값을 한 번에 바꾸고 싶다면

아래와 같이 update를 이용하여 세팅해줍니다.![image](/assets/images/post_images/MySQL workbench/MySQL workbench첨부 Img 13.png)

특정 정보만 바꿔주고 싶다면 아래와 같이 할 수도 있습니다.![image](/assets/images/post_images/MySQL workbench/MySQL workbench첨부 Img 14.png)

![image](/assets/images/post_images/MySQL workbench/MySQL workbench첨부 Img 15.png)