---
layout: post
title: MyBatis-Spring 예제) ➊ Spring & MyBatis & MySQL 설정하기
categories: DB
tags: [DB, MyBatis, Spring, MyBatis-Spring]
sitemap :
  changefreq : daily
  priority : 1.0
---

👇🏻 MyBatis의 개념에 대해 먼저 알아보시려면 👇🏻

[MyBatis란 뭘까요? 🤔](https://suyeon-b.github.io/db/2021/08/12/MyBatis%EB%9E%80.html)

---

지난 포스팅에서는 MyBatis의 개념에 대해 알아보았습니다.

이번에는 실제 예제를 통해 어떻게 정보를 주고받는지 보도록 하겠습니다.

> **구현 환경은 아래와 같습니다.**
>
> eclipse 2020-12
>
> jdk 1.8
>
> tomcat 8.5
>
> MySQL 5.7.35
>
> MyBatis 3.4.1
>
> MyBatis-Spring 1.1.1
>
> Spring framework 5.1.2.RELEASE
>
> MySQL workbench 8.0.26





---

## **1. MySQL workbench에서 예제테이블 만들기**

👇🏻 아래 포스팅에서 예제 테이블 생성 및 정보 입력/수정을 다뤘습니다.

[[MySQL workbench 예제] 테이블 생성 및 정보 입력하기! 📝](https://suyeon-b.github.io/db/2021/08/23/MySQL-workbench-%EC%98%88%EC%A0%9C.html)

예제 테이블 생성이 완료되셨다면 다음 단계로 넘어가겠습니다.

---

## **2. Spring Legacy Project 생성하기**

### 2-1. '우클릭 ➡️ Project...' 선택

![image](/assets/images/post_images/Spring-MyBatis 연동 포스팅/Spring-MyBatis 연동 첨부 Img 1.png)

### 2-2. 'Spring Legacy Project' 선택

![image](/assets/images/post_images/Spring-MyBatis 연동 포스팅/Spring-MyBatis 연동 첨부 Img 3.png)

### 2-3. 'Spring MVC Project' 선택 및 프로젝트 이름 설정

(저는 DB_selftest로 하겠습니다.)

![image](/assets/images/post_images/Spring-MyBatis 연동 포스팅/Spring-MyBatis 연동 첨부 Img 4.png)

### 2-4. 기본 파일들 생성

저는 아래와 같은 경로로 만들어두었습니다.

![image](/assets/images/post_images/Spring-MyBatis 연동 포스팅/Spring-MyBatis 연동 첨부 Img 2.png)

---

## **3. MyBatis-Spring으로 Spring과 MyBatis 연동하기**

### 3-1. 우선 경로 설정부터!

📂spring > 📂appServlet > 📄servlet-context.xml

기본적으로는 아래 사진과 같이 되어있으나, 우리는 파일을 새로 생성하고 경로를 바꾸었으니 변경해줍니다.

![image](/assets/images/post_images/Spring-MyBatis 연동 포스팅/Spring-MyBatis 연동 첨부 Img 5.png)

변경된 코드는 다음과 같습니다.

- css, js 연결
- .jsp 경로 루트로 변경

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans:beans xmlns="http://www.springframework.org/schema/mvc"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:beans="http://www.springframework.org/schema/beans"
	xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="http://www.springframework.org/schema/mvc https://www.springframework.org/schema/mvc/spring-mvc.xsd
		http://www.springframework.org/schema/beans https://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">

	<!-- DispatcherServlet Context: defines this servlet's request-processing infrastructure -->
	
	<!-- Enables the Spring MVC @Controller programming model -->
	<annotation-driven />

	<!-- Handles HTTP GET requests for /resources/** by efficiently serving up static resources in the ${webappRoot}/resources directory -->
	<resources mapping="/resources/**" location="/resources/" />
	<resources mapping="/css/**" location="/resources/css/" />
	<resources mapping="/js/**" location="/resources/js/" />

	<!-- Resolves views selected for rendering by @Controllers to .jsp resources in the /WEB-INF/views directory -->
	<beans:bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
		<beans:property name="prefix" value="/WEB-INF/" />
		<beans:property name="suffix" value=".jsp" />
	</beans:bean>
	
	<context:component-scan base-package="project.database.selftest,data*" />
	
	
	
</beans:beans>

```

📄home.jsp에서도 불필요한 부분을 삭제하고

추후 필요한 js, css를 아래와 같이 연결해줍니다.

```java
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" type="text/css" href="/css/home.css">

<!-- 제이쿼리 -->
<script src="https://code.jquery.com/jquery-3.0.0.js"></script>
<!-- ajax -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
</head>
<body>

<!-- ajax -->
<script src="/js/home.js"></script>
</body>
</html>
```







### 3-2. Bean 으로 'SqlSessionFactoryBean'과 'SqlSessionTemplate' 등록하기

📂spring > 📄root-context.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://www.springframework.org/schema/beans https://www.springframework.org/schema/beans/spring-beans.xsd">
	
	<!-- Root Context: defines shared resources visible to all other web components -->
	<bean class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
		<property name="locations">
			<value>WEB-INF/mysql/mysql.properties</value>	
		</property>
	</bean>
	
	<bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
		<property name="url" value="${url}"/>
		<property name="driverClassName" value="${driver}"/>
		<property name="username" value="${username}"/>
		<property name="password" value="${password}"/>
	</bean>
	
	<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
		<property name="dataSource" ref="dataSource"/>
		<property name="configLocation">
		<value>classpath:mybatis/setting/SqlMapConfig.xml</value>
		</property>
	</bean>
	
	<bean id="sqlSessionTemplate" class="org.mybatis.spring.SqlSessionTemplate">
		<constructor-arg ref="sqlSessionFactory"/>
	</bean>
	
</beans>

```

위 코드에서 SqlSessionFactoryBean이 **dataSource 정보**와 **Mapper 설정 정보**를 입력받아 등록됨을 알 수 있습니다.

- **dataSource 정보**에는 DB 커넥션 정보 등이 담겨있습니다.
- **Mapper 설정 정보**에는 SQL문에 대한 정보가 담겨있습니다.

MyBatis 설정 정보는 📄DB_sql.xml 파일에서 다루겠습니다.







### 3-3. 'MySQL, MyBatis, MyBatis-Spring, Spring-jdbc' pom.xml 에 추가하기

```xml
<!-- MySQL -->
<dependency>
  <groupId>mysql</groupId>
  <artifactId>mysql-connector-java</artifactId>
  <version>6.0.5</version>
</dependency>

<!-- MyBatis -->
<!-- https://mvnrepository.com/artifact/org.mybatis/mybatis -->
<dependency>
  <groupId>org.mybatis</groupId>
  <artifactId>mybatis</artifactId>
  <version>3.4.1</version>
</dependency>

<!-- MyBatis-Spring -->
<!-- https://mvnrepository.com/artifact/org.mybatis/mybatis-spring -->
<dependency>
  <groupId>org.mybatis</groupId>
  <artifactId>mybatis-spring</artifactId>
  <version>1.1.1</version>
</dependency>
 
<!-- Spring-jdbc -->
<!-- https://mvnrepository.com/artifact/org.springframework/spring-jdbc -->
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-jdbc</artifactId>
  <version>${org.springframework-version}</version>
</dependency>
```







### 3-4. 📄mysql.properties 설정

```
driver=com.mysql.jdbc.Driver
url=jdbc:mysql://localhost:3306/DB_test?useUnicode=true&characterEncoding=utf8&verifyServerCertificate=false&useSSL=false&serverTimezone=UTC
username=root
password=root
```

mysql workbench에서 설정한 포트번호와 mysql root계정으로 진행하겠습니다.

---



### 3-5. 실전 연동부터는 다음 포스팅에서!
이제 다음 [MyBatis-Spring 예제 ➋편](https://suyeon-b.github.io/db/2021/08/23/Spring-Mybatis-%EC%97%B0%EB%8F%99-%EC%98%88%EC%A0%9C-2.html)에서 실제로 DB 연결 테스트까지 다뤄보도록 하겠습니다.