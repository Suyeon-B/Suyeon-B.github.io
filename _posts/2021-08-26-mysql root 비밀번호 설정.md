---
layout: post
title: mysql root 비밀번호 설정 / MySQL 비밀번호 분실 / MySQL 삭제 및 재설치 / MySQL workbench
subheading: 비밀번호 때문에 고통받은 사람 모여라...!
author: SuyeonBak
categories: Database
banner:
  image: https://media.vlpt.us/images/sgh002400/post/005be64e-a3e4-4535-9b97-72876a30ef97/MySQL.png
  opacity: 0.618
  background: "#000"
  height: "100vh"
  min_height: "38vh"
  heading_style: "font-size: 4.25em; font-weight: bold; text-decoration: none"
  subheading_style: "color: #ff5100; font-weight: 400"
tags: [Database, MySQL, MySQL 비밀번호, MySQL 삭제 및 재설치]
sitemap :
  changefreq : daily
  priority : 1.0
---



MySql을 `homebrew`로 설치할 때 분명히 비밀번호 설정하고 시작도 잘 됐었는데, 갑자기 어느날 실행하려니 오류가 떠서 <span style="color:#ff5100">**비밀번호 초기화 → 같은 오류 뜸 → mysql 삭제 후 비번 설정 → 같은 오류 뜸 → ∞ ...**</span> 이런 무한 굴레에 빠지게 되었습니다. 😭







그래서 다시 태어난 마음으로 해보자고 결심하고 삭제 후 새로 install 한 뒤, 다시 설정하는 방법을 찾게 되어 공유하려 합니다.







## **MySql root 비밀번호 설정**

### 1. 우선 기존의 MySql 삭제하기

터미널에서 아래 코드 입력 후,

```terminal
ps -ef | grep mysql
```

![img](/assets/images/post_images/mysql root 비밀번호/mysql root 비밀번호 설정.png)

위 사진의 노란색으로 표시된 숫자를 기준으로 `kill` 시켜줍니다.

````terminal
sudo kill 1612
sudo kill 1705
````



이후 아래 코드를 입력하여 mysql을 멈춰주시면,<br>

````terminal
brew services stop mysql@5.7
````

(본인 버전에 맞게 입력해주세요. 저 같은 경우엔 mysql@5.7이라 위와 같이 입력했습니다.)

![img](/assets/images/post_images/mysql root 비밀번호/mysql root 비밀번호 설정 2.png)

위와 같이 잘 멈춘 것을 확인할 수 있습니다.



그럼 이제 삭제를 할 차례입니다!

아래 한 문장 입력하시면,

````terminal
brew uninstall mysql@5.7
````

![img](/assets/images/post_images/mysql root 비밀번호/mysql root 비밀번호 설정 3.png)

이렇게 나옵니다.

이제 남은 파일들도 모조리 지워주기 위해

````terminal
rm -rf /usr/local/var/mysql
rm /usr/local/etc/my.cnf
````

를 입력해주시고,

````terminal
ps -ef | grep mysql
````

를 입력해서 확인해보시면,

![img](/assets/images/post_images/mysql root 비밀번호/mysql root 비밀번호 설정 4.png)

이렇게 별거 없는 것을 확인할 수 있습니다.

그럼 이제 다시 설치하기로 넘어갈 수 있는 상황입니다!! 🚀







### 2. MySql 다시 설치하기

````terminal
brew install mysql@5.7
````

이제 원하는 mysql버전으로 다운받으면

![img](/assets/images/post_images/mysql root 비밀번호/mysql root 비밀번호 설정 5.png)

이렇게 쭉 다운로드가 됩니다.

그럼 이제 위 사진에서 노란 괄호로 표시한 부분에서 입력하라는대로 해봅시다!

- <span style="color:#ff5100">**환경변수 설정**</span>

````terminal
echo 'export PATH="/usr/local/opt/mysql@5.7/bin:$PATH"' >> ~/.zshrc
````

이렇게 환경변수 설정을 해주시고,

- <span style="color:#ff5100">**mysql 시작**</span>

````terminal
brew services start mysql@5.7
````

시작을 해보면,

````terminal
==> Successfully started `mysql@5.7` (label: homebrew.mxcl.mysql@5.7)
````

라고 나올겁니다!! 👏👏



그럼.... 아무리 해도 root 로 들어갈 수 없었던 오류의 늪에서

````terminal
mysql -u root
````

을 입력했을 때 아래와 같이 뜬다면 제대로 하신겁니다!! 🥳 🥳 🥳

````terminal
suyeon@bagsuyeon-ui-MacBookPro ~ % mysql -u root
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.7.35 Homebrew

Copyright (c) 2000, 2021, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
````

그럼 exit으로 나오시고, 비번 설정 단계로 넘어갑니다.

````mysql
mysql> exit
Bye
````









### 3. mysql_secure_installation 및 비밀번호 설정

이전 시도들에서는 이 과정을 하지 않아 계속 오류가 났습니다.. 😭

- ⭐️ <span style="color:#ff5100">**mysql_secure_installation 및 비밀번호 설정**</span>

````terminal
mysql_secure_installation
````

을 입력하면 아래와 같이 나오는데,

첫번째 질문인

`Press y|Y for Yes, any other key for No: `에

아무 키나 입력해주시면 비밀번호 설정을 할 수 있습니다. 그 밑의 질문들에는 각자 맞는 설정을 해주시면 되겠습니다.

![img](/assets/images/post_images/mysql root 비밀번호/mysql root 비밀번호 설정 6.png)

그럼 드디어 `All done!` 이라는 희망찬 문구가 뜨실거예요. 😂









### 4. 비밀번호 설정이 잘 됐는지 확인하기

이제 확인만 해보면 끝입니다~!

![img](/assets/images/post_images/mysql root 비밀번호/mysql root 비밀번호 설정 7.png)

요렇게 나온다면 성공입니다...!!!!!!! 🔥🔥🔥







## ➕

### MySQL workbench - root 계정으로 시작하기

MySQL workbench에서 방금 설정한 root 계정으로 시작해보겠습니다.

우선 MySQL workbench를 켭니다.

![img](/assets/images/post_images/mysql root 비밀번호/mysql root 비밀번호 설정 8.png)

원하는 작업 환경을 눌러주시고, username에는 root를, password에는 아까 설정한 비밀번호를 입력하신 뒤 Test connection 누르시면 연결이 성공적으로 되었다는 알림창이 뜹니다.

![img](/assets/images/post_images/mysql root 비밀번호/mysql root 비밀번호 설정 9.png)

그럼 정말 끝입니다~! 

