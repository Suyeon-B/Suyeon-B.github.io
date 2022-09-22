---
layout: post
title: Javascript는 정말 싱글인가? 
subtitle: 어 싱글이야~ 
tags: [Javascript, V8]
author: Suyeon Bak
comments: True
---

# 0. Intro

---

> 💬 프론트엔드 스터디에서 혁오빠가 `JavaScript`의 `GC`를 주제로 발표했다.<br> 오빠는 V8엔진의 GC를 소개하며 **JavaScript가 정말 싱글스레드인지**를 의심했다.

의문이 들게 된 이유는,

- V8엔진의 GC가 발전
- 메인 쓰레드가 혼자 하던 일을 `헬퍼 쓰레드`와 나누어 일을 하게 됨
- 즉, 프로그램이 멈추는 시간이 크게 감소하게 됨

`헬퍼 쓰레드`가 존재하기 때문이었을거다.

<br> 
결론부터 말하자면, **V8엔진은  `멀티 쓰레드`, JavaScript는 `싱글 쓰레드`다!**

즉, JS 자체는 싱글이고 JS 런타임(실행환경)은 멀티다!


# 1. 자스 너 … 진짜 싱글 스레드 맞아?

---

![동석짱]({{ site.baseurl }}/assets/img/어 싱글이야.png)

```jsx
console.log("1");
setTimeout(console.log, 5000, "2"); // 5초 후, console.log 함수 실행
console.log("3"); 

// [결과]
// 1
// 3
// 2
```

자바스크립트가 진짜 싱글 스레드면 출력값이 1, 2, 3이어야 말이 된다.

(싱글 스레드 == 싱글 콜스택잉께)

setTimeout에 0ms을 걸어도 결과는 같다.

근데 왜 이런 결과가 나올까?

바로바로바로 `Web API`와 `이벤트 루프` 때문!!


# 2. 자바스크립트는 진짜 싱글스레드야 믿어줘

---

> 😱 자바스크립트가 `멀티쓰레드인 것 처럼` 사용되는 이유..<br>면접에서 설명할 수 있으시겠어요?<br><br>가보자고…👊


```jsx
// 이 코드는 어떤 순서로 콜 스택에 쌓일까용?
console.log('hi');

setTimeout(function () {
		console.log('there');
}, 5000);

console.log('JSConfEU');
```

**사진을 통해 과정을 따라가봅시다잉**

![1]({{ site.baseurl }}/assets/img/1.callstack.png)
![2]({{ site.baseurl }}/assets/img/2.callstack.png)
![3]({{ site.baseurl }}/assets/img/3.callstack.png)
![4]({{ site.baseurl }}/assets/img/4.callstack.png)
![5]({{ site.baseurl }}/assets/img/5.callstack.png)
![6]({{ site.baseurl }}/assets/img/6.callstack.png)
![7]({{ site.baseurl }}/assets/img/7.callstack.png)

그런데 곰곰히 생각해보면 의문이 또 들죠..

어떻게 `console.log('there')`가 5초 뒤 나올 수 있는걸까?

우리는 다시 자바스크립트가 싱글스레드가 맞는지 의심하게 된다.

<br>
하지만 의심을 하지 맙시다

**자바스크립트는..** 

- `이벤트 루프`
    - 콜스택 ↔ Callback Queue
- `Web APIs`
    - setTimeout 등
    - node.js → C++ APIs

같은 **행님들과 함께한답니다?**

<br>
<br>

### 행님들과 함께라면 “Concurrent하게 동작하는 것 처럼 보이는” JavaScript
> 😏 webapi와 event loop만 있으면 동시에 처리하는 척 할 수 있어
![webApi&EventLoop]({{ site.baseurl }}/assets/img/webApi&EventLoop.gif)<br>이제 setTimeout에 0ms 을 걸어줘도 왜 마지막에 찍히는지 알겠쥬?<br>이벤트 루프의 콜백큐에 얼마나 많이 쌓여있을지 몰라요.<br>그래서 setTimeout에 적어주는 시간이 “최소한” 그만큼은 기다렸다가 실행되는거지,<br>딱! 그 만큼 기다렸다 바로 실행될거라는 보장이 없답니당?

<br>

### 중간 정리 !!!

- 자바스크립트 자체는 콜스택에 push하고 pop하는 것만 할 수 있는 싱글스레드!!
- setTimeout이 실행되면 Web API의 timer 쓰레드에 작업을 넘김
- timer 쓰레드는 작업 완료 후 Callback queue로 옮김
- Event Loop이 콜스택이랑 콜백큐를 돌며 확인하고, 콜스택 비었으면 콜백큐 하나씩 올려줌
- 그래서 메인 스레드에서는 블로킹 없이 바로 다음 코드를 수행할 수 있고, 이를 동시성(Concurrency)이라 말함!


# 3. V8은 그럼 싱글이야 ?

---

> 💕 V8 엔진은 ❗멀티쓰레드❗입니다잉~<br>![multidongsuk]({{ site.baseurl }}/assets/img/multidongsuk.png)

- 메인쓰레드
    - 코드를 가져와 컴파일하고 실행
    - 자바스크립트 코드가 영향을 받는 메모리 블록을 수행할 때는 하나의 쓰레드만 사용하는 것!!!
- 컴파일을 위한 쓰레드
    - 이 쓰레드가 코드 최적화를 하는 동안 메인 쓰레드가 쉬지 않고 코드 실행 가능
- 프로파일러 쓰레드
    - 어떤 메소드에서 사용자가 많은 시간을 보내는지 런타임에게 알려줘서 크랭크샤프트가 최적화할 수 있게 함 (근데 현재는 크랭크샤프트 안씀 다음 발표에서 만나용..)
- 가비지 컬렉터 스윕 처리를 위한 n개의 쓰레드

# 4. 싱글이던 아니던 우리에게 중요한 건 뭐다? WHY!

---

>❗ **왜 싱글쓰레드인지,<br>그래서 장단점은 뭔지!!!**

### 장점

- 비용이 큰 문맥 교환(context switch) 작업을 요구하지 않는다.
- 자원 접근에 대한 동기화를 신경쓰지 않아도 된다.
- 단순히 CPU만을 사용하는 계산작업이라면, 오히려 멀티스레드보다 싱글스레드로 프로그래밍하는 것이 더 효율적이다.
- 프로그래밍 난이도가 쉽고, CPU, 메모리를 적게 사용한다. (코스트가 적게든다)

### 단점

- 여러 개의 CPU를 활용하지 못한다.
- 연산량이 많은 작업을 하는 경우, 그 작업이 완료되어야 다른 작업을 수행할 수 있다.
- 싱글 스레드 모델은 에러 처리를 못하는 경우 멈춘다.

<br>
성능 최적화 관련해서는 V8엔진 포스팅에서 다루겠습니다.

# 5. 3줄 요약

---

1. JS는 싱글 쓰레드다
2. V8, node.js…는 멀티 쓰레드다
3. 자스는 왜 싱글 쓰레드를 선택했나? 쉽다! 자원도 아낄 수 있다!


# References

---

- **Event Loop**
    - [The event loop - JavaScript(MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
    - [What the hack event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ&ab_channel=JSConf)
        
- **JavaScript Concurrency와 실행 흐름**
    - 특히 14분 부터 JavaScript Concurrency 다룸
    - [코드스피츠 85 - 거침없는 자바스크립트](https://www.youtube.com/playlist?list=PLBNdLLaRx_rImvbuZnfO-Ecv9OpuCNoCl)
        
- **자바스크립트는 어떻게 작동하는가: 엔진, 런타임, 콜스택 개관**
    - [자바스크립트는 어떻게 작동하는가: 엔진, 런타임, 콜스택 개관](https://engineering.huiseoul.com/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%9E%91%EB%8F%99%ED%95%98%EB%8A%94%EA%B0%80-%EC%97%94%EC%A7%84-%EB%9F%B0%ED%83%80%EC%9E%84-%EC%BD%9C%EC%8A%A4%ED%83%9D-%EA%B0%9C%EA%B4%80-ea47917c8442)
    
- **자바스크립트는 어떻게 작동하는가: V8 엔진의 내부 + 최적화된 코드를 작성을 위한 다섯 가지 팁**
    - [자바스크립트는 어떻게 작동하는가: V8 엔진의 내부 + 최적화된 코드를 작성을 위한 다섯 가지 팁](https://engineering.huiseoul.com/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%9E%91%EB%8F%99%ED%95%98%EB%8A%94%EA%B0%80-v8-%EC%97%94%EC%A7%84%EC%9D%98-%EB%82%B4%EB%B6%80-%EC%B5%9C%EC%A0%81%ED%99%94%EB%90%9C-%EC%BD%94%EB%93%9C%EB%A5%BC-%EC%9E%91%EC%84%B1%EC%9D%84-%EC%9C%84%ED%95%9C-%EB%8B%A4%EC%84%AF-%EA%B0%80%EC%A7%80-%ED%8C%81-6c6f9832c1d9)
    
- **JS 싱글쓰레드 장점(JS가 싱글 쓰레드를 택한 이유)**
    - [싱글스레드(Single thread) vs 멀티스레드 (Multi thread)](https://velog.io/@gil0127/%EC%8B%B1%EA%B8%80%EC%8A%A4%EB%A0%88%EB%93%9CSingle-thread-vs-%EB%A9%80%ED%8B%B0%EC%8A%A4%EB%A0%88%EB%93%9C-Multi-thread-t5gv4udj)
    
    - [What does it mean by Javascript is single threaded language](https://medium.com/swlh/what-does-it-mean-by-javascript-is-single-threaded-language-f4130645d8a9)
    
    - [Why Node.js is a single threaded language ? - GeeksforGeeks](https://www.geeksforgeeks.org/why-node-js-is-a-single-threaded-language/)
    
    - [자바스크립트는 왜 싱글 스레드를 선택했을까? 프로세스, 스레드, 비동기, 동기, 자바스크립트 엔진, 이벤트루프](https://miracleground.tistory.com/entry/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%8A%94-%EC%99%9C-%EC%8B%B1%EA%B8%80-%EC%8A%A4%EB%A0%88%EB%93%9C%EB%A5%BC-%EC%84%A0%ED%83%9D%ED%96%88%EC%9D%84%EA%B9%8C-%ED%94%84%EB%A1%9C%EC%84%B8%EC%8A%A4-%EC%8A%A4%EB%A0%88%EB%93%9C-%EB%B9%84%EB%8F%99%EA%B8%B0-%EB%8F%99%EA%B8%B0-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%97%94%EC%A7%84-%EC%9D%B4%EB%B2%A4%ED%8A%B8%EB%A3%A8%ED%94%84)