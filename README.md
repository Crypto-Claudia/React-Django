## 테스트 방법
루트에서 ```npm start```
로 실행 ...

얘는 실행만 하면 끝

## 주의사항

실행 후 호스트 주소 변경 필요 

기본 실행 호스트가 [http://localhost:3000]인데 

[http://127.0.0.1:3000] 으로 바꿔서 접속해야 정상 실행 (CORS 오류)

## 별도로 프로젝트에서 사용법

```javascript
localStorage.setItem("user_id", "test_id");
localStorage.setItem("email", "test@email.com");
localStorage.setItem("region", "서울 송파구");
localStorage.setItem("diseases", "질병1,질병2, ..."); // ,로 구분
localStorage.setItem("nickname", "닉네임");
```
위 코드를 테스트할 페이지에 삽입후 

```javascript
localStorage.getItem("user_id");
localStorage.getItem("email");
localStorage.getItem("region");
localStorage.getItem("diseases"); // ,로 구분
localStorage.getItem("nickname");

// diseases의 경우 ,로 구분되기 때문에 
localStorage.getItem("diseases").split(","); // return: (list)
```

이렇게 쓰시면 될듯 합니다.