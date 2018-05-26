# 리스펙토링 세션 2 - REST API 실습

프론트엔드(클라이언트) : Vue.js + Axios 라이브러리 ( CDN 이용 )

백엔드(서버) : Node.js + Express 프레임워크  
 
 
#### 용어 간단히 소개

###### Vue.js

- Angular, React와 같은 프론트엔드 자바스크립트 프레임워크이다. 
- HTML, JavaScript 언어를 좀 더 간편하고 깔끔하게 작성할 수 있다. HTML 코드들을 조각조각 분리하여 관리할 수 있기 때문에 유지보수하기에 좋고, 성능을 높여주는 다양한 기능들을 제공해준다.

###### Axios

- Vue에서 사용할 수 있는 Ajax 요청 방식이며, 인기있는 HTTP 클라이언트 라이브러리 중 하나이다. 
- 비동기 형식으로 클라이언트에서 서버로 요청한다. REST API 실습을 위한 핵심 기능들을 갖고 있다. 
- TARGET URL, HTTP METHOD (GET, POST, PUT, DELETE), 데이터, 요청, 응답 처리, 에러 처리

###### Node.js

- 구글의 V8 자바스크립트 엔진을 기반으로 한 서버 사이드 언어이다. 
- JavaScript 언어를 사용해 서버를 구축할 수 있고, 기본 프로토타입 작성이 빠르기 때문에 생산성이 높다. 
- 이벤트 루프라는 싱글 스레드로 파일이나 I/O 요청을 비동기 형식으로 처리한다. 
- 특히, 많은 커넥션을 수용하기 위한 네트워크 처리 성능이 매우 뛰어나다.

###### Express

- 기존 애플리케이션 개발을 위한 Node.js를 더 간결하고 유연하게 작성할 수 있다. 
- 다양한 HTTP 유틸리티 메소드와 미들웨어를 제공하여 개발자가 쉽고 빠르게 API를 작성할 수 있게 해준다. 


  

## 기본 환경 구축 및 실행 방법


Git Bash를 설치하여 터미널에 아래 명령어들을 입력한다.

```bash
git clone https://github.com/kkodu/rest-api-practice.git
cd rest-api-practice
npm install
node app-restapi.js

>> 웹 브라우저 URL 입력창에 localhost:3000 치고 접속
```
 


## 기본 Node.js를 사용한 간단한 로컬 서버 구현

출처 - [Node.js 공식 페이지](https://nodejs.org/ko/about)

###### 새 프로젝트 생성 시

- **$ mkdir myapp; cd myapp** : myapp 폴더 생성 후 이동
- **$ npm init** : 노드 프로젝트 폴더 초기화 
- **$ index.js** : 파일 생성
- **$ node index.js** : index 파일 실행

#### node index.js

```javascript
var http = require('http'); // http 통신을 위한 'http' 내장 모듈을 가져온다.

var hostname = '127.0.0.1'; // 자신의 컴퓨터에서만 서버를 구동시킬 수 있는 가상 IP 주소 (루프백 호스트)
var port = 3000; // Node.js 등 보통 3000번 포트로 연결한다.

// 클라이언트 요청을 받고 응답을 해줄 서버를 생성한다.
var server = http.createServer(function (request, response) {
  // 응답 메시지 작성
  response.statusCode = 200; // 응답 코드 : 200 (성공) 
  response.setHeader('Content-Type', 'text/plain'); // 응답 데이터 형식 : 일반 문자열
  response.end('Hello World\n'); // 클라이언트로 응답 데이터 전송
});

// 로컬 서버를 가동시킨다. 브라우저 URL 창에 localhost:3000을 입력해서 확인
server.listen(port, hostname, function () {
  // 로컬 서버를 가동시켰을 때 터미널에 출력해주는 메시지
  console.log(`Server running at http://${hostname}:${port}/`);
});
```





## Express 프레임워크를 사용한 간결한 코드 작성

출처 - [express 공식 페이지](http://expressjs.com/ko/starter/hello-world.html)

###### 해당 프로젝트 폴더에서

- **$ npm install --save express** : express 설치 및 package.json 파일이 의존성 관리

#### node app-simple.js

```javascript
var express = require('express'); // express 모듈 가져오기
var app = express(); // 앱 서버 생성

// get 요청 방식으로 '/' 루트 경로로 접근했을 때
app.get('/', function (req, res) {
  // 클라이언트로 응답 메시지 전송
  // http 모듈을 사용하는 것 보다 훨씬 간결해졌다.
  res.send('Hello World!');
});

// 앱 3000번 포트로 연결
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
```



## REST API 실습을 위한 서버 파일 구성

자세한 소스코드 설명은 해당 파일에 주석 처리, REST API 개념은 피피티나 구글링 참고

#### app-restapi.js

- 클라이언트 요청을 받을 API 서버이다.
- 서버 구동 및 **라우팅 처리**를 해준다.
- 라우팅 처리는 RESTful 형식인 GET, POST, PUT, DELETE 메소드를 사용한다.
- 아래 코드는 라우팅 구현 부분만을 설명



###### 인덱스 페이지 접속 

```javascript
/* URL 입력창에 localhost:3000으로 접속했을 때
 * __dirname  : 현재 폴더 경로
 * index.html : 화면에 보여줄 페이지
 * sendFile() : 클라이언트로 파일을 전송한다.
*/
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
})
```

###### 모든 레시피 조회 (READ)

```javascript
/* HTTP method : GET
 * URI : /recipes
 * fs.readFile() : 파일을 불러온다. data에는 파일 내용이 담겨 온다.
 * data = JSON.parse(data) : 문자열(string)로 온 data를 json 형식으로 변환
 * res.json() : 클라이언트로 JSON 데이터를 전송한다.
*/
app.get('/recipes', function (req, res) {
	fs.readFile(__dirname + '/recipes.json', 'utf8', function (err, data) {
        data = JSON.parse(data)
        res.json(data)
	})
})
```

###### 하나의 레시피 조회 (READ)

```javascript
/* HTTP method : GET
 * URI : /recipes/:food (food -> 조회할 음식명)
 * req.params : URI로 넘어온 리소스 중 서버에서 사용할 파라미터 변수, 기호 ':'로 구분한다.
 * food : 레시피 음식명
 * data.find(callback handler) : 모든 레시피를 하나씩 순회하다 조건과 맞는 레시피 하나를 반환한다.
*/
app.get('/recipes/:food', function (req, res) {
	var food = req.params.food

	fs.readFile(__dirname + '/recipes.json', 'utf8', function (err, data) {
        data = JSON.parse(data)
        var recipe = data.find(function (rcp) {
            // data의 레시피명과 파라미터로 넘어온 레시피명이 같으면 해당 레시피 반환
            return rcp.food === food
        })
        if (recipe) {
            res.json(recipe) // 레시피 있으면 레시피 응답
        } else {
            res.json(error) // 레시피 없으면 에러 응답
        } 
	})
})
```

###### 새로운 레시피 추가 (CREATE)

```javascript
/* HTTP method : POST
 * URI : /recipes
 * req.body : POST로 보낸 데이터 집합은 리퀘스트 바디 안에 담겨서 전송된다. 전송 내용은 data 객체 안에 들어있다.
 * data.push() : 레시피 배열에 새로운 데이터를 추가하는 메서드
 * JSON.stringify() : JSON 객체를 문자열로 변환한다. 변경 내용을 파일에 쓰기 위해서 변환해주는 과정
 * fs.writeFile() : 파일을 새로쓴다. 변경된 내용을 파일에 저장한다.
*/
app.post('/recipes', function (req, res) {
	var recipe = req.body.data
	
	fs.readFile(__dirname + '/recipes.json', 'utf8', function (err, data) {
        data = JSON.parse(data)
        data.push(recipe)
        var json = JSON.stringify(data)
        fs.writeFile(__dirname + '/recipes.json', json, 'utf8', function (err) {
            res.json(recipe)
        })
	})
})
```

###### 하나의 레시피 수정 (UPDATE)

```javascript
/* HTTP method : PUT
 * URI : /recipes/:food
 * index : 요청 레시피 배열 인덱스(요소 위치)
*/
app.put('/recipes/:food', function (req, res) {
	var index = req.params.food // 요청 레시피 번호는 URI를 통해
	var recipe = req.body.data  // 레시피 변경 데이터는 request body 안에
	
	fs.readFile(__dirname + '/recipes.json', 'utf8', function (err, data) {
        data = JSON.parse(data)
        data[index] = recipe // 변경할 레시피 위치에 요청 레시피로 덮어쓰기 한다. (수정 필요)
        var json = JSON.stringify(data)
        fs.writeFile(__dirname + '/recipes.json', json, 'utf8', function (err) {
            res.json(recipe)
        })
	})
})
```

###### 하나의 레시피 삭제 (DELETE)

```javascript
/* HTTP method : DELETE 
 * URI : /recipes/:food
 * index : 요청 레시피 배열 인덱스
 * data.splice() : 요청 레시피를 삭제하기 위한 메서드
*/
app.delete('/recipes/:food', function (req, res) {
	var index = req.params.food

	fs.readFile(__dirname + '/recipes.json', 'utf8', function (err, data) {
        data = JSON.parse(data)
        var recipe = data[index]
        data.splice(index, 1) // 배열의 해당 레시피 위치에서 자신의 데이터 삭제
        var json = JSON.stringify(data)
        fs.writeFile(__dirname + '/recipes.json', json, 'utf8', function (err) {
            res.json(recipe)
        })
	})
})
```



#### recipes.json

###### * JSON(JavaScript Object Notation)

- 자바스크립트 언어로 작성된 가벼운 데이터 형식
- 클라이언트와 서버 간의 데이터 교환 시에 주로 쓰인다.
- 가독성이 좋고 호환성이 뛰어나다.
- KEY - VALUE 형식으로 구성

모든 레시피 데이터는 JSON 구조로 파일에 저장해 놓는다. 요청된 데이터는 Node.js에 기본 내장되어 있는 파일 입출력 관리 모듈 **' fs '** 를 사용해 추가, 조회, 변경, 삭제한다. (데이터베이스를 사용하지 않기 때문에 JSON 파일을 이용했다)



#### error.json

레시피 조회 실패 시, 응답해줄 데이터



#### index.html

클라이언트 측, 사용자가 화면에서 볼 페이지이다. 원래는 public 폴더 안에 넣거나 HTML 템플릿을 사용하지만 편의를 위해 이렇게 했다. 코드는 아래에 따로 설명.



#### public 폴더

- 정적(static) 파일들을 저장하고 관리한다.
- HTML, CSS, JS, 이미지 파일들이 포함
- app.use(express.static('public')) : Express의 static 미들웨어를 사용해 정적 폴더 경로를 추가한다.



## HTML 및 Vue 작성

###### HTML 코드는 VUE와 관련된 코드들만 설명

- **v-model** : 양방향 데이터 바인딩을 가능하게 해준다. HTML 코드 데이터 \<---> VM(뷰모델) 코드 데이터
- **@keyup.enter** : @는 v-on의 축약어로 이벤트 바인딩을 의미. keyup.enter=" "는 엔터키 입력 시 메서드 실행
- **@click** : 버튼 클릭 시 메서드 실행
- **v-if** : 해당 VM(뷰모델) 데이터가 TRUE일 시, HTML 코드를 화면에 보여준다.
- **{{ 뷰모델 데이터명 }}** : 콧수염 바인딩이라 하여, VM 데이터를 HTML 화면에 보여주고 싶을 때 사용한다.
- **v-for** : VM 데이터 중, 배열이나 객체 데이터를 순회할 때 사용한다.
- **:class** : v-bind:class의 축약어로 의사 표현을 통해 클래스 바인딩이 가능하게 해준다. 



###### \<script> 코드 설명

```javascript
/* new Vue() => 새로운 Vue 객체를 생성 */
var vm = new Vue({
    el: '#app', // Vue 객체가 관리할 엘리먼트(el) 범위를 <div id="app">으로 설정
    data: function () {
      return {
        // data 객체는 모델(model)이라고 한다.
        // Vue 객체가 관리할 데이터들을 이 안에 작성한다.
      }
    },
    mounted: function () {
      // Vue 객체가 엘리먼트 '#app'과 연동? 연결 됐을 때.. 마운트 됐을 때 실행되는 코드
    },
    methods: {
      // Vue 객체에서 사용할 메서드를 정의한다.
    }
})
```



## Axios 작성

* **_this 변수** : 기존의 this는 Vue 객체를 가리키는데, axios 코드 안에서의 this는 axios를 가리키게 된다. 만약 axios 코드 안에서 Vue 객체를 사용하고 싶다면 미리 Vue 객체를 변수에 담아서 사용해야 하는데, 이 때 사용되는 변수가 _this이다.
* **axios 작성법**

```javascript
var _this = this // axios 안에서 사용할 Vue 객체 

axios.HTTP_METHOD(URI, [DATA])
.then(function (response) {
    // 성공적인 데이터 처리
})
.catch(function (error) {
    // 오류 처리
})
```

#### axios

- HTTP 통신 요청 기능을 제공해주는 axios 객체이다. 
- CDN을 이용했기 때문에 바로 쓸 수 있다.

#### HTTP_METHOD

- 클라이언트가 서버에 요청 시, 사용할 HTTP 요청 방식이다.
- 실습에서는 REST API를 사용하므로 GET, POST, PUT, DELETE를 사용한다.

#### URI

- 요청 자원을 적어준다. (도메인 주소는 생략)
- ex) /recipes

#### DATA

- [] 괄호는 옵션을 의미. 안 써줘도 무방
- 요청 메시지 중 Request Body 안에 담아서 보낼 데이터를 다룬다. (POST, PUT)

#### .then()

- 서버에 성공적으로 요청 시, 실행되는 함수이다.
- HTTP_METHOD 방식으로 URI 경로로 요청하는 과정에서 에러가 없다면 .then()이 실행된다.

#### function (response) {}

-  서버에서 데이터를 처리한 후 클라이언트로 다시 응답을 해주는데, 이 때 마찬가지로 에러 없이 성공적으로 클라이언트로 응답을 해주면 function (response) 함수가 실행된다.
- response는 서버에서 응답해주는 객체
- 응답 데이터는 response.data 안에 담겨서 온다.
- { ...처리 코드 } 안에는 성공적으로 요청-응답이 이루어졌을 시에 실행되는 코드들

#### .catch()

- catch 함수는 axios를 사용해 서버로의 요청-응답 과정에서 오류 발생 시, 실행되는 함수이다.
- 에러가 발생되면 error 객체가 반환된다. 
- function (error) 함수에서 에러를 처리한다.



## REST API 실습을 위한 클라이언트 코드 작성

###### 모든 레시피 데이터 요청

```javascript
/* 모든 레시피 조회
 * HTTP method : GET
 * URI : /recipes
 * _this.recipes : Vue 객체 안의 모든 레시피 데이터
*/
axios.get('/recipes') 
.then(function (response) {
    _this.recipes = response.data // 레시피 데이터에 응답된 모든 레시피를 저장
})
.catch(function (error) {
    console.log(error)
})
```

###### 하나의 레시피 데이터 요청

```javascript
/* 하나의 레시피 조회
 * HTTP method : GET
 * URI : /recipes/food
 * _this.search.request : 레시피 검색 폼에 입력한 데이터
 * _this.search.response : 화면에 보여줄 응답 데이터
*/
axios.get('/recipes/' + _this.search.request)
.then(function (response) {
    if (response.data.error) {
        _this.search.response = { food: response.data.error }
    } else {
        _this.search.response = response.data
    }
    _this.search.request = '' // 검색 입력 폼을 초기화
})
.catch(function (error) {
    console.log(error)
})
```

###### 새로운 레시피 추가 요청

```javascript
/* 하나의 레시피 추가
 * HTTP method : POST
 * URI : /recipes
 * data : food, ingradients, level (v-model이 있는 입력 폼에 입력한 레시피 데이터)
 * _this.[food, ingradients, level] = '' : 레시피 입력 폼 초기화
*/
axios.post('/recipes', {
    data: {
        food: _this.food,
        ingradients: _this.ingradients,
        level: _this.level
    }
})
.then(function (response) {
    _this.recipes.push(response.data)
    _this.food = ''
    _this.ingradients = ''
    _this.level = ''
})
.catch(function (error) {
    console.log(error)
})
```

###### 하나의 레시피 변경 요청

```javascript
/* 하나의 레시피 변경
 * HTTP method : PUT
 * URI : /reipces/food
 * data : 변경할 레시피 데이터 (모달창에 입력한 데이터)
 * update_data : 기존의 입력한 레시피 데이터로 모달에 있는 데이터를 저장하는 변수
 * _this.modal.currentIndex : 현재 레시피가 recipes 배열 데이터 안에 위치하는 값
 * _this.cancelRecipe() : 요청 성공 시, 모달 입력창 초기화
*/
var update_data = this.modal.edit

axios.put('/recipes/' + _this.modal.currentIndex, {
    data: {
        food: update_data.food,
        ingradients: update_data.ingradients,
        level: update_data.level
    }
})
.then(function (response) {
    _this.recipes[_this.modal.currentIndex] = response.data
    _this.cancelRecipe()
})
.catch(function (error) {
    console.log(error);
})
```

###### 하나의 레시피 삭제 요청

```javascript
/* 하나의 레시피 삭제
 * HTTP method : DELETE
 * URI : /recipes/food
 * data.index : deleteRecipe 함수 실행 시, 넘어오는 인자 값. 여기서는 해당 레시피가 배열 안에서 위치하는 값이다.
 * _this.recipes.splice(index, 1) : 해당 번 째에 위치하는 레시피 데이터 삭제
*/
var index = data.index

axios.delete('/recipes/' + index)
.then(function (response) {
    _this.recipes.splice(index, 1) // Vue 객체 안의 recipes 데이터에서 해당 레시피 삭제
})
.catch(function (error) {
    console.log(error)
})
```
