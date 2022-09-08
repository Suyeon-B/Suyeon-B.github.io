---
layout: post
title: 상속과 프로토타입 체인
subtitle: Java나 C++같은 클래스 기반 언어와는 다른 특성들에 주목해보자!
tags: [Javascript, prototype, inheritance]
author: Suyeon Bak
comments: True
---

# 0. Intro

---

> ☝🏻 **JavaScript는 …** <br>_`프로토타입 기반 객체지향프로그래밍 언어`이며, <br>_`dynamic`하고, `static type`이 없다! <br><br>→ Java나 C++같은 클래스 기반 언어와는 다른 특성들에 주목해보자.

오늘은 프로토타입 체인을 메인으로, 프로토타입의 개념과 프로토타입을 기반으로 구현하는 상속도 간단히 다뤄본다. 상속은 객체지향 프로그래밍의 핵심 개념으로, 불필요한 코드 중복을 줄여 생산성을 높일 수 있다.

<br>
> **\* 프로토타입 기반 객체지향프로그래밍 언어 ?**
>
> ES6부터 클래스가 도입되긴 했지만, 기존 프로토타입 기반 패턴의 문법적 설탕이라고 볼 수 있다. 다만, 클래스와 생성자 함수가 모두 프로토타입 기반의 인스턴스를 생성하지만 클래스는 생성자 함수에서 제공하지 않는 기능도 제공한다.

> **\* 정적 언어 vs. 동적 언어 ?**
>
> 자료형(type)이 결정되는 타이밍에 따라 나뉜다.
> 런타임에 결정 <br>→ 동적 언어 (JavaScript, Python, PHP)<br>컴파일 타임에 결정<br>→ 정적 언어 (TypeScript, Java, C++) <br><br>정적 타입 언어는 진입장벽이 상대적으로 높은 대신, 개발자가 만들어내는 오류를 사전에 방지할 수 있어 생산성이 높다고 평가된다.

# 1. 프로토타입 객체

---

> 🧬 **프로토타입?** <br>: 어떤 객체의 상위(부모) 객체 역할을 하는 객체! <br><br>→ 프로토타입을 상속받은 하위(자식) 객체는, 메서드를 포함한 부모 객체의 \*프로퍼티를 자유롭게 사용할 수 있다.

- 모든 객체는 `[[Prototype]]` 이라는 내부 슬롯(은닉(private) 속성)을 가지고, 그 값은 프로토타입의 참조이다.
  - 내부 슬롯 값이 null인 경우도 존재하고, 이 경우엔 프로토타입이 없으며 프로토타입 체인의 끝을 의미한다.
  - 상속을 통해 `__proto__` 접근자 프로퍼티를 사용하여 간접적으로 “자신의 프로토타입 == `[[Prototype]]` 내부 슬롯”에 접근할 수 있다.
  - 하지만 Object.prototype을 상속받지 않는 객체를 생성할 수도 있기 때문에, `__proto__` 대신 `Object.getPrototypeOf` 메서드를 사용할 것이 권장된다. 같은 이유에서 프로토타입 교체시에도 `Object.setPrototypeOf`가 권장된다.
- 모든 객체는 하나의 프로토타입을 가지고, 모든 프로토타입은 생성자 함수와 연결되어 있다.
- 객체가 생성될 때 객체 생성 방식에 따라 프로토타입이 결정되고, `[[Prototype]]`에 저장된다.
  - 예시
    - 객체 리터럴에 의해 생성된 객체의 프로토타입
      : Object.prototype
    - 생성자 함수에 의해 생성된 객체의 프로토타입
      : 생성자 함수의 prototype 프로퍼티에 바인딩되어 있는 객체

<br>

> **\* 프로퍼티 ?**
>
> - 해당하는 object의 특징이며, 이름과 값(원시함수, 메서드 또는 객체 참조)을 갖는다.
> - 주의할 점은 property의 값을 변경할 때 기존에 참조된 object는 그대로 남아있다는 점이다.

# 2. 프로토타입 체인

---

> ⛓️ **프로토타입 체인 ?** <br><br>: 객체의 프로퍼티(메서드 포함)에 접근하려고 할 때 해당 객체에 접근하려는 프로퍼티가 없다면, `[[Prototype]]` 내부 슬롯의 참조를 따라 부모 프로토타입의 프로퍼티를 순차적으로 검색하는 것

- 프로토타입 체인의 종착역은 `null`이다.
  - 예시 : `b ---> a ---> Object.prototype ---> null`
- `Object.getPrototypeOf`메서드를 사용해야 간접적으로 프로토타입에 접근할 수 있다.
  - 이는 서로가 자신의 프로토타입이 되어(cycle) 비정상적인 프로토타입 체인 생성을 방지하기 위함이며, 프로토타입 체인은 단방향 링크드 리스트로 구현되어야 한다.

<br>

### 2-1. **Javascript 에서 프로토타입을 사용하는 방법**

**예제 1) 자바스크립트 엔진이 메서드를 검색하는 과정**

{% highlight jsx %}
function Person(name){
this.name = name;
}

// 프로토타입 메서드
Person.prototype.sayHello = function (){
console.log(`Hi! My name is ${this.name}`);
};

const me = new Person('Suyeon');

// hasOwnProperty는 Object.prototype의 메서드이다.
console.log(me.hasOwnProperty('name'));
{% endhighlight %}

1. me 객체에서 먼저 hasOwnProperty 메서드를 검색
2. me 객체에는 없으니 프로토타입 체인을 따라, [[Prototype]] 내부 슬롯에 바인딩되어 있는 프로토타입인 Person.prototype으로 이동해 hasOwnProperty 메서드 검색
3. Person.prototype에도 없으니 [[Prototype]] 내부 슬롯에 바인딩되어 있는 프로토타입인 Object.prototype으로 이동해 hasOwnProperty 메서드 검색
4. Object.prototype에는 존재하므로 자바스크립트 엔진은 Object.prototype.hasOwnProperty 메서드를 호출한다. 이 때 해당 메서드의 this에는 me 객체가 바인딩된다.

<br>

**예제 2) `new` 연산자를 사용한 프로토타입 기반의 인스턴스 생성**

{% highlight jsx %}
function doSomething(){}
doSomething.prototype.foo = "bar";
var doSomeInstancing = new doSomething();
doSomeInstancing.prop = "some value";

// 아래 결과는 어떻게 될까?
console.log("doSomeInstancing.prop: " + doSomeInstancing.prop);
console.log("doSomeInstancing.foo: " + doSomeInstancing.foo);
console.log("doSomething.prop: " + doSomething.prop);
console.log("doSomething.foo: " + doSomething.foo);
console.log("doSomething.prototype.prop: " + doSomething.prototype.prop);
console.log("doSomething.prototype.foo: " + doSomething.prototype.foo);
{% endhighlight %}

{% highlight jsx %}
// console.log( doSomething.prototype );
{
foo: "bar",
constructor: ƒ doSomething(),
**proto**: {
constructor: ƒ Object(),
hasOwnProperty: ƒ hasOwnProperty(),
isPrototypeOf: ƒ isPrototypeOf(),
propertyIsEnumerable: ƒ propertyIsEnumerable(),
toLocaleString: ƒ toLocaleString(),
toString: ƒ toString(),
valueOf: ƒ valueOf()
}
}
{% endhighlight %}

{% highlight jsx %}
// console.log( doSomeInstancing );
{
prop: "some value",
**proto**: {
foo: "bar",
constructor: ƒ doSomething(),
**proto**: {
constructor: ƒ Object(),
hasOwnProperty: ƒ hasOwnProperty(),
isPrototypeOf: ƒ isPrototypeOf(),
propertyIsEnumerable: ƒ propertyIsEnumerable(),
toLocaleString: ƒ toLocaleString(),
toString: ƒ toString(),
valueOf: ƒ valueOf()
}
}
}
{% endhighlight %}

{% highlight jsx %}
// 결과
doSomeInstancing.prop: some value
doSomeInstancing.foo: bar
doSomething.prop: undefined
doSomething.foo: undefined
doSomething.prototype.prop: undefined
doSomething.prototype.foo: bar
{% endhighlight %}

<br>

### 2-2. **객체를 생성하는 여러 방법과 프로토타입 체인 결과**

**예제 1) 문법 생성자로 객체 생성**

{% highlight jsx %}
var o = {a: 1};

// o 객체는 프로토타입으로 Object.prototype 을 가진다.
// 이로 인해 o.hasOwnProperty('a') 같은 코드를 사용할 수 있다.
// hasOwnProperty 라는 속성은 Object.prototype 의 속성이다.
// Object.prototype 의 프로토타입은 null 이다.
// o ---> Object.prototype ---> null

var a = ["yo", "whadup", "?"];

// Array.prototype을 상속받은 배열도 마찬가지다.
// (이번에는 indexOf, forEach 등의 메소드를 가진다)
// 프로토타입 체인은 다음과 같다.
// a ---> Array.prototype ---> Object.prototype ---> null

function f(){
return 2;
}

// 함수는 Function.prototype 을 상속받는다.
// (이 프로토타입은 call, bind 같은 메소드를 가진다)
// f ---> Function.prototype ---> Object.prototype ---> null
{% endhighlight %}

<br>

**예제 2) 생성자 이용**

`new` 연산자를 사용해 함수를 호출하기만 하면 된다.

{% highlight jsx %}
function Graph() {
this.vertexes = [];
this.edges = [];
}

Graph.prototype = {
addVertex: function(v){
this.vertexes.push(v);
}
};

var g = new Graph();
// g 'vertexes' 와 'edges'를 속성으로 가지는 객체이다.
// 생성시 g.[[Prototype]]은 Graph.prototype의 값과 같은 값을 가진다.
{% endhighlight %}

<br>

**예제 3) Object.create 이용**

{% highlight jsx %}
var a = {a: 1};
// a ---> Object.prototype ---> null

var b = Object.create(a);
// b ---> a ---> Object.prototype ---> null
console.log(b.a); // 1 (상속됨)

var c = Object.create(b);
// c ---> b ---> a ---> Object.prototype ---> null

var d = Object.create(null);
// d ---> null
console.log(d.hasOwnProperty); // undefined이다. 왜냐하면 d는 Object.prototype을 상속받지 않기 때문이다.
{% endhighlight %}

<br>

**예제 4) class 키워드 이용**

ECMAScript2015 에 도입된 class

- 추가된 것 - class, constructor, static, extends, super

{% highlight jsx %}
'use strict';

class Polygon {
constructor(height, width) {
this.height = height;
this.width = width;
}
}

class Square extends Polygon {
constructor(sideLength) {
super(sideLength, sideLength);
}
get area() {
return this.height \* this.width;
}
set sideLength(newLength) {
this.height = newLength;
this.width = newLength;
}
}

var square = new Square(2);
console.log(square.area); // 4
{% endhighlight %}

# 3. 프로토타입 체인과 성능

---

> ⚠️ 객체 개인 속성인지 프로토타입 체인상 어딘가에 있는지 확인하기 위해서는 `hasOwnProperty` 메소드를 이용하자.<br><br>**→ 속성을 확인하고 프로토타입 체인 전체를 훑지 않게 하는 유일한 메서드이다.**

- 존재하지도 않는 속성에 접근하려는 시도는 항상 모든 프로토타입 체인인 전체를 탐색해서 확인하게 만든다.
- 객체의 속성에 걸쳐 루프를 수행 하는 경우 프로토타입 체인 전체의 **모든** 열거자 속성에 대하여 적용된다.

# 4. 프로토타입 상속

---

> 🧬 **3가지 종류의 프로토타입 상속** <br><br>1. 위임형 상속 <br>2. 연결형 상속 <br>3. 함수형 상속

**[위임형 상속(Delegation inheritance)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Inheritance_and_the_prototype_chain#%EC%9C%84%EC%9E%84%ED%98%95_%EC%83%81%EC%86%8Ddelegation_inheritance)**

- 모든 객체가 각 메소드에 대해 하나의 코드를 공유하므로 메모리 절약이 가능하다.
- 객체나 배열의 상태를 변경하면 같은 프로토타입을 공유하는 모든 객체의 상태가 변경돼서, 상태 관리에 좋지 못한 방식이다.

**[연결형 상속(Concatenative inheritance)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Inheritance_and_the_prototype_chain#%EC%97%B0%EA%B2%B0%ED%98%95_%EC%83%81%EC%86%8Dconcatenative_inheritance)**

- 한 객체의 속성을 다른 객체에 모두 복사하는 방식
- 속성의 초기값을 저장하기 좋은 방식이다.
- 클로져와 함께 사용하면 훨씬 효과적이다.

**[함수형 상속(Functional inheritance)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Inheritance_and_the_prototype_chain#%ED%95%A8%EC%88%98%ED%98%95_%EC%83%81%EC%86%8Dfunctional_inheritance)**

- 새 속성들을 연결형 상속으로 쌓되 상속 기능을 Factory 함수로 만들어 사용하는 방식
- 가장 큰 이점은 Private Data를 클로져를 통해 캡슐화 시킬 수 있다. (Private 상태 지정 가능)

# References

---

- 상속과 프로토타입 체인 (MDN)
  - ENG
    - [Inheritance and the prototype chain - JavaScript (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
  - KOR
    - [상속과 프로토타입 - JavaScript (MDN)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
- 동적 타입 언어 vs 정적 타입 언어
  - [[TypeScript] 동적 타입 언어 vs 정적 타입 언어](https://jess2.xyz/typescript/javascript-vs-typescript/)
- JavaScript Object
  - [Object - JavaScript (MDN)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Property
  - [쉽게 읽는 프로그래밍 : 네이버 블로그](https://blog.naver.com/magnking/220966405605)
  - [Property (JavaScript) - MDN Web Docs Glossary: Definitions of Web-related terms (MDN)](https://developer.mozilla.org/en-US/docs/Glossary/property/JavaScript)
- 모던자바스크립트 Deep dive
  - 19장 - 프로토타입
  - 25장 - 클래스
