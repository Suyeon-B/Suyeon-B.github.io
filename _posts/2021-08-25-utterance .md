---
layout: post
title: Github 블로그 만들기) 댓글 구현 - utterances / disqus 고민중인 당신에게
categories: Git
tags: [gitment, gitblog, Github 블로그 만들기]
sitemap :
  changefreq : daily
  priority : 1.0
---

### Github 블로그 만들기 시리즈 ⛓

---

### 댓글 구현에 앞서

먼저 [<span style="color:#ff5100">**정적 웹 페이지**</span>와 <span style="color:#ff5100">**동적 웹 페이지**</span>의 차이](https://suyeon-b.github.io/web/2021/08/25/%EC%A0%95%EC%A0%81-%EC%9B%B9-%ED%8E%98%EC%9D%B4%EC%A7%80%EC%99%80-%EB%8F%99%EC%A0%81-%EC%9B%B9-%ED%8E%98%EC%9D%B4%EC%A7%80.html)를 보시면,

댓글 기능은 '동적인 부분'에 속하기 때문에 <u>정적 웹 페이지에서 댓글 기능을 쓰고 싶다면 직접 추가해야 한다</u>는 것을 알게 됩니다.







## Disqus / Utterances... 어떤 게 좋을까?

다행히도 댓글 기능을 쉽게 추가할 수 있도록 미리 구현해둔 똑똑한 사람들 덕분에 우리는 몇 줄만 추가해서 댓글 기능을 사용할 수 있습니다. 다양한 플랫폼들이 존재하는데, 결론적으로 저는 Disqus를 처음에 구현했다가 <span style="color:#ff5100">**Utterances**</span>로 갈아타기로 했습니다! 



### Disqus 댓글 플랫폼이 탈락한 이유

- 광고가 엄청 붙습니다. (게다가 광고를 지우려면 매달 9$를 결제해야하는...)
- 디자인이 마음에 들지 않습니다.
- 기술 블로그 댓글에 facebook, twitter와 같은 사적인 정보로 로그인하도록 유도하고 싶지 않았습니다.
- disqus에 가입하도록 유도하는 건 더더욱 싫었습니다.



### utterances란?

댓글 기능을 제공하는 깃허브 앱입니다.

### utterances의 장점 🧞‍♀️

- 깃허브 계정만 있으면 운영이 가능합니다. (기술 블로그이기 때문에, 대부분의 방문해주신 분들은 깃허브 계정이 있으실거라고 판단했습니다.)
- 댓글 알림을 메일로 받을 수 있고, 깃허브로 관리가 용이합니다.
- 설치 및 설정이 어렵지 않습니다.
- Markdown 사용이 가능해서 예쁘게 댓글을 달 수 있습니다.







## 🔮 utterances 댓글 적용하기

> minimal-mistakes를 사용하는 분들은 각 테마에 따라 댓글 구현 방법이 다양할 수 있습니다. <br>따라서 본 포스팅에서는 직접 html 파일에 script 태그를 넣는 형식으로 진행하겠습니다.







### 1. repository 생성하기

댓글들을 따로 관리하기 위함입니다. 저는 [comments](https://github.com/Suyeon-B/comments) 라는 이름으로 생성했습니다.

![image](/assets/images/post_images/utterance/utterance 1.png)





### 2. utterances 설치하기

![image](/assets/images/post_images/utterance/utterance 2.png)

[이 링크](https://github.com/apps/utterances)를 통해 설치하시면 됩니다. 설치를 할 때 달린 댓글이 모든 저장소의 Issue들에 업로드가 되게 할지, 아니면 특정 한 저장소의 Issue에만 업로드가 되게 할지 선택할 수 있습니다. 저는 1번에서 생성한 레포지토리에만 모아 관리하기 위해 '<span style="color:#ff5100">**Only Select Repositories**</span> 선택 > comments'로 지정 후 설치했습니다.







### 3. Install 후 작성할 것들

### 	3-1. Repository

> repo:<br>github아이디/레포지토리이름
>
> ex) Suyeon-B/comments



### 	3-2. Blog Post ↔️ Issue Mapping

> 저는 고유한 값을 매핑시키기 위해 'Issue title contains page pathname' 선택했습니다.







### 4. 블로그에 적용시키기

### 	4-1. Theme

> 원하는 색상으로 선택하시면 됩니다.

### 	4-2. Enable Utterances

> 아래 코드를 repo와 테마 색상만 본인과 맞게 수정하셔서, 📄gitment.html 파일에 기존 script 부분을 대체하시면 됩니다.

```html
<script src="https://utteranc.es/client.js"
    repo="Suyeon-B/comments" // 수정할 부분
    issue-term="pathname"
    theme="github-light" // 수정할 부분
    crossorigin="anonymous"
    async>
</script>  
```

사실 minimal-mistakes를 사용하시는 분들은 이렇게 직접 바꾸지 않고, 더 간단하게 📄_config.yml 파일에서 몇 가지만 바꾸어 사용하시면 됩니다. 그 방법은 따로 포스팅하도록 하겠습니다!







### 5. 관리자 인증을 위한 최초 로그인 🔐

4번 이후 commit & push 해준 뒤, 반영될 때 까지 조금 기다려줍니다.

이후 블로그에서 command+shift+r (캐쉬 새로고침) 하시면, 깃허브 댓글 창이 생성되어있을겁니다.

![image](/assets/images/post_images/utterance/utterance 3.png)

관리자 인증을 위해 최초 로그인이 필요하니, 로그인 해주시면 정상적으로 댓글 기능이 활성화된 것을 확인할 수 있습니다. 👏

![image](/assets/images/post_images/utterance/utterance 4.png)
