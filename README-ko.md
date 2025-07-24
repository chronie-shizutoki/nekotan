

# 조용한 시간 냥이의 일기장🐾

고양이처럼 부드러운 일기 앱으로, 매일의 소중한 추억을 사랑스럽게 기록할 수 있어요 냥~♡  
반짝반짝 인터페이스로 여러분의 마음을 살며시 보관해 드릴게요~✨

## 국제화 냥~🌍

전 세계 고양이들과 친해지기 위해 다국어 지원을 열심히 준비 중이에요!

- 영어 냥: [README-en.md](README-en.md)
- 한국어 냥: [README-ko.md](README-ko.md)  
- 중국어(간체) 냥: [README-zh.md](README-zh.md)  
- 중국어(번체) 냥: [README-tw.md](README-tw.md)  

## 리소스의 집🏠

사용된 자료들은 모두 집에서 관리하고 있어요 냥:

### 폰트宝宝  
`public/vendor/fonts` 안에 있어요 냥~  
- KleeOne-Regular.woff2 - 포슬포슬 폰트  

### JavaScript 라이브러리  
`public/vendor/js` 에서 낮잠 중이에요🐾  
- fastclick.min.js - 빠른 탭 라이브러리 (v1.0.6)  

## 냥이 자랑 기능✨  

- 💕 터치만 해도 냥이 하트가 통통! 직관적 조작  
- 📝 카테고리 분류로 마음까지 깔끔 정리 냥♪  
- 🏷️ 태그 10개까지! 추억을 쏙 찾아요🔖  
- 🔍 키워드 하나로 마법 같은 검색~✨  
- 📤 CSV/JSON으로 추억 이사 가능 냥📦  
- 📊 자동 백업으로 편안한 숙면😴💤  
- 📱 모바일에서도 폭신폭신 조작~🐾  

## 필요한 것🍼  

- Node.js >= 14.0.0 (냥이 버전 이상이어야 해요)  
- PM2 (전역 설치 필수 냥)  

## 시작 방법🐾  

먼저 냥이를 집에 모실 준비를 해요!  

```bash
# 집으로 데려오기 냥~
git clone https://github.com/quiettimejsg/nekotan.git  
cd nekochan  

# 간식 준비 냥
npm install  

# 보호자 불러오기 냥
npm install -g pm2
```

## 방 꾸미기✨  

`.env` 파일로 취향에 맞게 설정 냥~:  

```env
PORT=3000                 # 집 현관 번호🚪  
NODE_ENV=production       # 외출 모드 설정🎀  
MAX_FILE_SIZE=5242880     # 사진 크기(5MB)📸  
LOG_LEVEL=info            # 이야기량 설정💬  
BACKUP_RETENTION_DAYS=30  # 추억 보관 기간📆  
CORS_ORIGIN=*             # 모두 친구 설정🌈  
```

## 실행 명령어🐾  

놀이 모드 실행:  
```bash
npm run dev  # 신나는 개발 모드💫  
```  

실전 모드 실행:  
```bash
npm run prod  # 진지 냥 모드👑  
```  

기타 관리 명령어:  
- `npm run stop`: 잘 자요 냥~🌙  
- `npm run restart`: 활기차게 재시작!🔁  
- `npm run logs`: 오늘의 이야기 보기📖  

## 사용 방법💖  

1.  로그인 후 냥이 화면 톡톡✨  
2.  통통한 "새 일기" 버튼 터치!  
3.  제목과 마음을 냥냥 입력📝  
4.  카테고리와 태그로 스타일리시 정리🎀  
5.  "저장"으로 폭신한 하트에 보관💕  

## 집 구조🐾  

```
nekochan/
├── .github/                            # GitHub 편지함✉️
│   └── workflows/                      # 자동 작업 기계⚙️
│       └── code-stats.yml              # 코드 키 재기📏
├── public/                             # 모두에게 보여주는 방✨
│   ├── css/                            # 스타일리시 옷장👗
│   │   ├── animations/                 # 동작 레시피북💫
│   │   │   ├── input-animations.css    # 글자 입력 댄스💃
│   │   │   ├── keyframe.css            # 반짝임의 비밀✨
│   │   │   ├── sakura.css              # 벚꽃 날리기🌸
│   │   ├── base/                       # 피부 관리 세트💅
│   │   │   ├── performance.css         # 빠른 동작 비결🐇
│   │   │   ├── variables.css           # 색상 팔레트🎨
│   │   ├── components/                 # 부품 장난감 상자🧸
│   │   │   ├── alerts.css              # 알림 카드🔔
│   │   │   ├── buttons.css             # 말랑말랑 버튼🎮
│   │   │   ├── clock.css               # 똑딱 시계⏰
│   │   │   ├── diary.css               # 일기장 디자인📖
│   │   │   ├── history.css             # 추억 앨범📚
│   │   │   ├── layout.css              # 방 구조🏠
│   │   │   ├── search.css              # 보물찾기 세트🔍
│   │   │   └── tags.css                # 냥이 태그 컬렉션🏷️
│   │   ├── themes/                     # 옷 바꾸기👘
│   │   │   └── dark.css                # 달님 모드🌙
│   │   ├── main.css                    # 메인 옷✨
│   │   └── style.css                   # 공통 스타일 세트🎀
│   ├── js/                             # 움직이는 장난감 상자🎪
│   │   ├── managers/                   # 보호자👩‍🍼
│   │   │   ├── EventHandler.js         # 이벤트 접수원🎪
│   │   │   ├── TagManager.js           # 태그 정리사🏷️
│   │   │   └── UIManager.js            # 외관 디자이너🎨
│   │   ├── app.js                      # 심장 뛰뛰❤️
│   │   ├── DiaryManager.js             # 일기 지키미📝
│   │   ├── InputAnimator.js            # 마법 동작사✨
│   │   ├── Logger.js                   # 추억 기록원📜
│   │   ├── sakura.js                   # 벚꽃 마법🌸
│   │   └── TimeUpdater.js              # 시간 알리미⏰
│   ├── uploads/                        # 사진 앨범📸
│   └── vendor/                         # 친구 집🏠
│       ├── fonts/                      # 글자 놀이터✏️
│       │   ├── font.css                # 글자 옷👕
│       │   ├── KleeOne-Regular.ttf     # 포슬포슬 글자🐾
│       │   └── OFL.txt                 # 약속 카드📜
│       ├── js/                         # 편리 도구 상자🧰
│       │   └── fastclick.min.js        # 빠른 탭 버튼⚡
│       └── picture/                    # 장식 그림 상자🖼️
│           └── sakura.svg              # 벚꽃 엽서🌸
├── .vscode/                            # 그림 도구 상자🎨
│   └── launch.json                     # 마법 주문서🪄
├── .cloc-exclude                       # 비밀 메모🙈
├── .env.example                        # 방 설정 예시🏠
├── .gitignore                          # 보이지 않기 목록🙈
├── diaries.csv                         # 추억 보석 상자💎
├── LICENSE                             # 약속 카드📜
├── 静時ねこたん.html                     # 현관 문🚪
├── backup-20250524-194510.tar.gz       # 추억 백업💾
├── nekochan-1.0.0.tgz                  # 이사 가방📦
├── package-lock.json                   # 간식 목록🔒
├── logs/                               # 매일의 일기장📖
├── backups/                            # 추억의 보물상자💖
├── server.js                           # 심장부 뛰뛰❤️
├── ecosystem.config.js                 # 보호자 설명서📖
└── package.json                        # 보호자 수첩📔
```

## 추억 보관함💾  

- 매일 자동 백업 돼요 냥~  
- `backups/` 폴더에서 30일간 보관  
- 환경변수로 기간 변경 가능 냥📅  

## 안전 조치🔐  

- 헬멧으로 머리 보호 (Helmet.js)🧢  
- 모두와 친근한 통신 설정 (CORS)🤝  
- 수상한 입력은 차단!🚫  

## 라이선스 정보📜  

AGPL-3.0 라이선스 냥~  
폰트宝宝는 SIL Open Font License 1.1 로 지킴이  

### 마지막으로 냥~💕  
항상 여러분의 소중한 추억을,  
동그란 눈으로 지켜볼게요 냥🐾  
행복한 매일이 가득 기록되길~✨  