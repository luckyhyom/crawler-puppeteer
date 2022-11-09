### Typescript
1. 타입이 없으니 channelId로 받을지 channel_id로 받을지 정할 수가 없다. 편리한 또는 원하는 인터페이스를 구현하기 어려워진다.
2. 컴파일시 문법 오류를 잡아주지 못해서 매우 불편하다.

### Repository Pattern
1. 생쿼리를 쓰던 ORM을 쓰던 Service에 영향을 미치지 않고 Repo에서만 수정하면 됨. 즉 작업할 파일을 기준을 두어 분리할 수 있음.

### Data Types
- varchar vs text: https://sir.kr/qa/250669

### SQL vs NOSQL
정규화된 테이블 컬럼은 저장할때 비효율적일 수 있다.
- 컬럼 크기를 미리 지정해놔야함. 컬럼에 들어오는 데이터의 평균크기와 최대 크기 차이가 많다면 비효율적