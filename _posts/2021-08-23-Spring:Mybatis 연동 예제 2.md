---
layout: post
title: MyBatis-Spring 예제) ➋ MyBatis-Spring 연결 & DB 테스트
categories: DB
tags: [DB, MyBatis, Spring, MyBatis-Spring]
---

지난 [MyBatis-Spring 예제 ➊편](https://suyeon-b.github.io/db/2021/08/23/Spring-Mybatis-%EC%97%B0%EB%8F%99-%EC%98%88%EC%A0%9C.html)에서 Spring, MyBatis, MySQL 설정을 마쳤습니다.

이번 포스팅에서는 실제로 연결을 해보고,

DB 연결 테스트까지 해보겠습니다! 🔥

---

### 3-5. 사전 준비는 마쳤으니, 실제 연결을 해봅시다〰️!

우선 아래와 같이 패키지, 파일들을 생성해줍니다.

![image](/assets/images/post_images/Spring-MyBatis 연동 포스팅/Spring-MyBatis 연동 첨부 Img 6.png)

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

![image](/assets/images/post_images/Spring-MyBatis 연동 포스팅/Spring-MyBatis 연동 첨부 Img 7.png)

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

