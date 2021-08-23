---
layout: post
title: MyBatis-Spring 예제 ➊ Spring & MyBatis & MySQL 설정하기
categories: DB
tags: [DB, MyBatis, Spring, MyBatis-Spring]
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

[MySQL workbench 예제 ) 테이블 생성 및 정보 입력하기! 📝]()

예제 테이블 생성이 완료되셨다면 다음 단계로 넘어가겠습니다.

---

## **2. Spring Legacy Project 생성하기**

### 2-1. '우클릭 ➡️ Project...' 선택

![image](/Users/suyeon/gitBlog/Suyeon-B.github.io/assets/images/post_images/Spring-MyBatis 연동 포스팅/Spring-MyBatis 연동 첨부 Img 1.png)

### 2-2. 'Spring Legacy Project' 선택

![image](/Users/suyeon/gitBlog/Suyeon-B.github.io/assets/images/post_images/Spring-MyBatis 연동 포스팅/Spring-MyBatis 연동 첨부 Img 3.png)

### 2-3. 'Spring MVC Project' 선택 및 프로젝트 이름 설정

(저는 DB_selftest로 하겠습니다.)

![image](/Users/suyeon/gitBlog/Suyeon-B.github.io/assets/images/post_images/Spring-MyBatis 연동 포스팅/Spring-MyBatis 연동 첨부 Img 4.png)

### 2-4. 기본 파일들 생성

저는 아래와 같은 경로로 만들어두었습니다.

![image](/Users/suyeon/gitBlog/Suyeon-B.github.io/assets/images/post_images/Spring-MyBatis 연동 포스팅/Spring-MyBatis 연동 첨부 Img 2.png)

---

## **3. MyBatis-Spring으로 Spring과 MyBatis 연동하기**

### 3-1. 우선 경로 설정부터!

📂spring > 📂appServlet > 📄servlet-context.xml

기본적으로는 아래 사진과 같이 되어있으나, 우리는 파일을 새로 생성하고 경로를 바꾸었으니 변경해줍니다.

![image](/Users/suyeon/gitBlog/Suyeon-B.github.io/assets/images/post_images/Spring-MyBatis 연동 포스팅/Spring-MyBatis 연동 첨부 Img 5.png)

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







### 3-5. 사전 준비는 마쳤으니, 실제 연결을 해봅시다〰️!

우선 아래와 같이 패키지, 파일들을 생성해줍니다.

![image](/Users/suyeon/gitBlog/Suyeon-B.github.io/assets/images/post_images/Spring-MyBatis 연동 포스팅/Spring-MyBatis 연동 첨부 Img 6.png)

- DAO <sup>[1](#footnote_1)</sup>: Data Access Object
- DTO <sup>[2](#footnote_2)</sup> : Data Transfer Object



**이제 파일들을 작성해봅시다 👩🏻‍💻**

📄DB_DAO_INTERFACE.java

```java
package data.DAO;

import data.DTO.DB_DTO;

public interface DB_DAO_INTERFACE {
	//이름 가져오기
	public String getUserName(String name);
	
	//나이 가져오기
	public int getUserAge(String age);
	
	//성별 가져오기
	public String getUserGender(String gender);
	
	//전부 다 가져오기
	public DB_DTO getUserAll(String all);
}

```

📄DB_DAO.java

```java
package data.DAO;

import java.util.HashMap;

import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Repository;

import data.DTO.DB_DTO;

@Repository
public class DB_DAO extends SqlSessionDaoSupport implements DB_DAO_INTERFACE{
	
	//유저이름 가져오기 
	@Override
	public String getUserName(String name) {
		
		HashMap<String, String> map = new HashMap<String, String>();
			map.put("user_name", name);
		return getSqlSession().selectOne("getUserName", map);
	}
	//나이 불러오기 
	@Override
	public int getUserAge(String age) {
		HashMap<String, String> map = new HashMap<String, String>();
			map.put("user_age", age);
		return getSqlSession().selectOne("getUserAge", map);
	}
	//성별 불러오기 
	@Override
	public String getUserGender(String gender) {
		HashMap<String, String> map = new HashMap<String, String>();
			map.put("user_gender", gender);
		return getSqlSession().selectOne("getUserGender", map);
	}
	//모두 불러오기 
	@Override
	public DB_DTO getUserAll(String all) {
		HashMap<String, String> map = new HashMap<String, String>();
			map.put("user_all", all);
		return getSqlSession().selectOne("getUserAll", map);
	}
	
}
```

📄DB_DTO.java

```
package data.DTO;

public class DB_DTO {
	private String userName;
	private Integer age;
	private String gender;
	
	
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	
	
	public Integer getAge() {
		return age;
	}
	public void setAge(Integer age) {
		this.age = age;
	}
	
	
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	
	
}
```

📄DB_SERVICE_INTERFACE.java

```
package data.SERVICE;

import data.DTO.DB_DTO;

public interface DB_SERVICE_INTERFACE {
	//이름 가져오기
	public String getUserName(String name);
	
	//나이 가져오기
	public int getUserAge(String age);
	
	//성별 가져오기
	public String getUserGender(String gender);
	
	//전부 다 가져오기
	public DB_DTO getUserAll(String all);
}

```

📄DB_SERVICE.java

```
package data.SERVICE;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import data.DAO.DB_DAO_INTERFACE;
import data.DTO.DB_DTO;

@Service
public class DB_SERVICE implements DB_SERVICE_INTERFACE {
	
	@Autowired
	private DB_DAO_INTERFACE dao;
	
	@Override
	public String getUserName(String name) {
		return dao.getUserName(name);
	}
	@Override
	public int getUserAge(String age) {
		return dao.getUserAge(age);
	}
	@Override
	public String getUserGender(String gender) {
		return dao.getUserGender(gender);
	}
	@Override
	public DB_DTO getUserAll(String all) {
		return dao.getUserAll(all);
	}
}

```

📄HomeController.java

```java
package project.database.selftest;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import data.DTO.DB_DTO;
import data.SERVICE.DB_SERVICE_INTERFACE;

@Controller
public class HomeController {

	@Autowired
	private DB_SERVICE_INTERFACE service;
	
	
	@GetMapping("/")
	public String home() {
		return "home";
	}
	
	
	@PostMapping("getUserName")
	public @ResponseBody String getUserName(@RequestParam("name")String name) {
		
		String resultValue = service.getUserName(name);
		
		System.out.println("DB에서 가져온 결과값");
		System.out.println(resultValue);
		
		return resultValue;
	}
	
	@PostMapping("getUserAge")
	public @ResponseBody int getUserAge(@RequestParam("age")String age) {
		
		int resultValue = service.getUserAge(age);
		
		System.out.println("DB에서 가져온 결과값");
		System.out.println(resultValue);
		
		return resultValue;
	}
	
	@PostMapping("getUserGender")
	public @ResponseBody String getUserGender(@RequestParam("gender")String gender) {
		
		String resultValue = service.getUserGender(gender);
		
		System.out.println("DB에서 가져온 결과값");
		System.out.println(resultValue);
		
		return resultValue;
	}
	
	@PostMapping("getUserAll")
	public @ResponseBody HashMap<String, Object> getUserAll(@RequestParam("all")String all) {
		HashMap<String, Object> map = new HashMap<String, Object>();
		DB_DTO dto = service.getUserAll(all);
		
		map.put("result",dto);
		
		System.out.println("DB에서 가져온 결과값");
		System.out.println(dto);
		
		return map;
	}
}

```

📄DB_sql.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd"> <!-- XML 문서의 유효성 체크를 위해 필요 -->
<mapper namespace="compose">

	<select id="getUserName" parameterType="HashMap" resultType="String">
		select userName from db_test where userName = #{user_name};
	</select>
	
	<select id="getUserAge" parameterType="HashMap" resultType="int">
		select age from db_test where userName = #{user_age};
	</select>
	
	<select id="getUserGender" parameterType="HashMap" resultType="String">
		select gender from db_test where userName = #{user_gender};
	</select>
	
	<select id="getUserAll" parameterType="HashMap" resultType="testDTO">
		select * from db_test where userName = #{user_all};
	</select>

	
</mapper>
```

📄SqlMapConfig.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "HTTP://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
	<typeAliases>
		<typeAlias type="data.DTO.DB_DTO" alias="testDTO"/>
	</typeAliases>
	<mappers>
		<mapper resource="mybatis/setting/DB_sql.xml"/>
	</mappers>
</configuration>
```







### 3-6. 이제 view를 구현하면 됩니다! 🥳

📄home.jsp

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<link rel="stylesheet" type="text/css" href="/css/home.css">

<!-- 제이쿼리 -->
<script src="https://code.jquery.com/jquery-3.0.0.js"></script>
<!-- ajax -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
</head>
<body>

<div class="input_box_container">
	<input type="text" class="input_box">
</div>

<div class="btn_container">
	<div class="name">이름 출력 버튼</div>
	<div class="age">나이 출력 버튼</div>
	<div class="gender">성별 출력 버튼</div>
	<div class="all">전부다 출력 버튼</div>
</div>
<div class="result_container">
</div>
<!-- ajax -->
<script src="/js/home.js"></script>
</body>
</html>
```

📄home.css

```jsp
@charset "UTF-8";

.btn_container{
	width: 600px;
	margin: 0 auto;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.btn_container>div{
	background: #000;
	border-radius: 8px;
	color: #fff;
	padding: 5px;
	cursor: pointer;
	
}

.result_container{
	width: 600px;
	margin: 0 auto;
	margin-top: 100px;
}

.input_box{
	width: 600px;
	margin: 0 auto;
	margin-top: 100px;
	background: #dbdbdb;
	border: 0;
	padding: 5px;
	text-align: center;
}

.input_box_container{
	width: 600px;
	margin: 0 auto;
	margin-bottom: 18px;
}
```

📄home.js

```jsp
$(".name").click(function() {
	let input_box = $(".input_box").val();
	$.ajax({
		url: "getUserName",
		type: "post",
		data: { "name": input_box },
		success: function(data) {
			console.log(data);
			$(".result_container").html(data);
		}

	});
});

$(".age").click(function() {
	let input_box = $(".input_box").val();
	$.ajax({
		url: "getUserAge",
		type: "post",
		data: { "age": input_box },
		success: function(data) {
			console.log(data);
			$(".result_container").html(data);
		}
	});
});

$(".gender").click(function() {
	let input_box = $(".input_box").val();
	$.ajax({
		url: "getUserGender",
		type: "post",
		data: { "gender": input_box },
		success: function(data) {
			console.log(data);
			$(".result_container").html(data);
		}
	});
});

$(".all").click(function() {
	let input_box = $(".input_box").val();
	$.ajax({
		url: "getUserAll",
		type: "post",
		data: { "all": input_box },
		success: function(data) {
			console.log(data.result);
			let str = "<div> 이름 : "+data.result.userName+", 나이 : "+data.result.age+", 성별 : "+data.result.gender+"</div>";
			$(".result_container").html(str);
		}
	});
});
```

---

## 🔥 결과 화면 

입력 칸에 데이터베이스에 저장한 이름을 입력한 뒤, 버튼 하나를 클릭하면 원하는 정보를 얻을 수 있습니다.

아래 사진은 '전부 다 출력 버튼'을 누른 결과입니다.

![image](/Users/suyeon/gitBlog/Suyeon-B.github.io/assets/images/post_images/Spring-MyBatis 연동 포스팅/Spring-MyBatis 연동 첨부 Img 7.png)

아래와 같이 eclipse console 상에서도 값을 잘 가져오는 것을 확인할 수 있습니다.![image](/Users/suyeon/gitBlog/Suyeon-B.github.io/assets/images/post_images/Spring-MyBatis 연동 포스팅/Spring-MyBatis 연동 첨부 Img 8.png)

---

## **📍 notes**



<a name="footnote_1">1.</a> **DAO는 DB를 사용해 데이터를 조회하거나 조작하는 기능을 전담하도록 만든 오브젝트를 말합니다.**

사용자는 자신이 필요한 Interface를 DAO에게 던지고, DAO는 이 인터페이스를 구현한 객체를 사용자에게 편리하게 사용할 수 있도록 반환해줍니다.

💬 DB에 대한 접근을 DAO가 담당하도록 하여 데이터베이스 액세스를 DAO에서만 하게 되면 다수의 원격호출을 통한 오버헤드를 DTO를 통해 줄일 수 있고, 다수의 DB 호출문제를 해결할 수 있습니다.



<a name="footnote_2">2.</a>**그럼 DTO는 또 뭐야?!**

계층간 데이터 교환을 위한 자바빈즈를 말합니다.

(여기서 말하는 계층은 컨트롤러, 뷰, 비즈니스 계층, 퍼시스턴스 계층입니다.)

대표적인 DTO로는 폼데이터빈, 데이터베이스 테이블빈 등이 있으며, 각 폼요소나, 데이터베이스 레코드의 데이터를 매핑하기 위한 데이터 객체를 말합니다. 즉, 폼 필드들의 이름을 그대로 가지고 있는 자바빈 객체를 폼 필드와 그대로 매칭하여 비즈니스 계층으로 보낼 때 사용합니다.

이는 데이터 전달을 위한 가장 효율적인 방법이지만, 클래스 선언을 위해 많은 코드가 필요하다는 단점이 있습니다.

