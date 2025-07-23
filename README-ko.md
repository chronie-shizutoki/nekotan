# 조용한 시간 네코탄의 일기장🐾

고양이처럼 부드럽게 매일의 추억을 귀엽게 기록할 수 있는 일기 앱이에요~♡

✨ 귀여운 인터페이스로 당신의 감정을 소중히保管해드려요 ✨

## 국제화에요~냐

이 애플리케이션은 너무나 귀여운 다국어 지원을 목표로 하고 있어요~♡

- [일본어](README.md)
- [영어](README-en.md)
- [중국어(간체)](README-zh.md)
- [중국어(번체)](README-tw.md)

## 현지화 리소스

이 애플리케이션에서 사용하는 외부 리소스는 모두 현지화되어 있습니다:

### 폰트

`public/vendor/fonts` 디렉토리에 저장됨:

- KleeOne-Regular.woff2 - Klee One 폰트

### JavaScript 라이브러리

`public/vendor/js` 디렉토리에 저장됨:

- fastclick.min.js - FastClick 라이브러리 (v1.0.6)

## 네코탄 특징✨

- 💕 고양이 같은 인터페이스로 터치만으로 하트가 뛰는 초 사용성이에요~💖
- 📝 귀여운 카테고리 분류 기능으로 감정을 깔끔하게 정리해요~♪📂
- 🏷️ 태그 기능 (최대 10개까지!)으로 추억을 쉽게 찾을 수 있어요~🔖
- 🔍 작은 키워드로 바로 찾아주는 검색 기능, 마법처럼요~✨
- 📤 CSV/JSON으로 추억을 가지고 다닐 수 있는 내보내기/가져오기 기능이에요~📦
- 📊 매일 자동으로 백업해주는安心 기능, 잠자면서도安心해요~😴💤
- 📱 모바일에서도 손가락으로 귀엽게 조작할 수 있어요~📱💕

## 실행에 필요한 것들🍼

- Node.js >= 14.0.0 (고양이 버전 이상이에요~)
- PM2 (전역 설치해주세요~)

## 네코탄 설치 방법🐾

먼저 리포지토리를 집으로迎え들여 필요한 것을 준비해요~🛠️

## 협력하는 방법🤝

조용한 시간 네코탄을 더 귀엽고 더 편리하게 만들어주는 도움을 구합니다~🙏

1. 리포지토리를 포크해서 자신의 집에 복사해요~🍴
2. 새로운 브랜치를 "feature/귀여운기능"처럼 귀엽게 만드세요~🌱
3. 변경 사항을 커밋하고 메시지도 귀엽게 작성해서 푸시해요~📤
4. Pull Request를 작성해서 변경 내용을 자세히 알려주고 보내주세요~✉️

함께 조용한 시간 네코탄을 더 귀엽게 성장시켜요!💕 Pull Request를 보내주시면 답변을超~빨리 드릴게요~✧*｡٩(ˊᗜˋ*)و✧*｡ 협력해주셔서 감사해요~♡
```bash
# 리포지토리를 클론해요~ 
git clone https://github.com/quiettimejsg/nekotan.git
cd nekochan

# 의존 패키지를 설치해요~ 
npm install

# PM2를 전역에 설치해요~ 
npm install -g pm2
```

## 귀여운 환경 설정✨

`.env` 파일을 생성하여 방 설정을 귀엽게 커스터마이즈해요~🔧:

```env
# 포트 번호 설정 (변경하지 마세요~)🔒
PORT=3000
# 환경 설정 (운영/개발)🌳
NODE_ENV=production
# 최대 파일 크기 (5MB)📦
MAX_FILE_SIZE=5242880
# 로그 레벨 (정보량 조정)📝
LOG_LEVEL=info
# 백업 보존 기간 (30일)⏳
BACKUP_RETENTION_DAYS=30
# CORS 설정 (누구나 접근 허용)🌐
CORS_ORIGIN=*
```

## 시작 방법

개발 환경에서 애플리케이션을 활기차게 시작해요~💻✨:
```bash
npm run dev
```

운영 환경에서 안정적으로 실행해요~🚀:
```bash
npm run prod
```

기타 명령어:
- `npm run stop`: 애플리케이션을 멈춰요~🛑
- `npm run restart`: 애플리케이션을 활기차게 재시작해요~🔄
- `npm run logs`: 로그를 보고 상태를 확인해요~🔍

## 귀엽게 사용하는 방법~♡

1. 애플리케이션을 시작하고 고양이를 어루만지듯 로그인해요~🔑✨
2. 핑크색 "새 일기" 버튼을 부드럽게 클릭해요~✏️💖
3. 일기 제목과 감정을 귀엽게 입력해요~📝💭
4. 카테고리와 태그를 선택해 멋지게 정리해요~🏷️🎀
5. "저장" 버튼을 살며시 누르고 소중한 추억을 확실히保管해요~💾💕

## 네코탄 디렉토리 구조🐾

```
nekochan/
├── .github/                            # GitHub 관련 설정 파일📁
│   └── workflows/                      # 자동화 워크플로우 설정⚙️
│       └── code-stats.yml              # 코드 통계 워크플로우📊
├── public/                             # 정적 파일이 들어있는 폴더🐱
│   ├── css/                            # 스타일시트
│   │   ├── animations/                 # 애니메이션용 CSS 파일
│   │   │   ├── input-animations.css    # 입력 애니메이션용 CSS 파일
│   │   │   ├── keyframe.css            # 키프레임 애니메이션용 CSS 파일
│   │   │   ├── sakura.css              # 벚꽃용 CSS 파일
│   │   ├── base/                       # 기본 CSS 파일
│   │   │   ├── performance.css         # 성능용 CSS 파일
│   │   │   ├── variables.css           # 변수용 CSS 파일
│   │   ├── components/                 # 컴포넌트용 CSS 파일🧩
│   │   │   ├── alerts.css              # 알림 표시 관련 스타일시트🔔
│   │   │   ├── buttons.css             # 버튼 관련 스타일시트🎮
│   │   │   ├── clock.css               # 시계 표시 관련 스타일시트⏰
│   │   │   ├── diary.css               # 일기 표시·입력 관련 스타일시트📖
│   │   │   ├── history.css             # 일기 기록 표시 관련 스타일시트📜
│   │   │   ├── layout.css              # 애플리케이션 레이아웃 관련 스타일시트🏠
│   │   │   ├── search.css              # 일기 검색 관련 스타일시트🔍
│   │   │   └── tags.css                # 태그 표시 관련 스타일시트🏷️
│   │   ├── themes/                     # 테마용 CSS 파일🎨
│   │   │   └── dark.css                # 다크 테마용 CSS 파일🌙
│   │   ├── main.css                    # 메인 스타일시트✨
│   │   └── style.css                   # 공통 스타일시트🎀
│   ├── js/                             # 클라이언트 사이드 JS
│   │   ├── managers/                   # 매니저 파일
│   │   │   ├── EventHandler.js         # 이벤트 핸들러 파일
│   │   │   ├── TagManager.js           # 태그 관리 파일
│   │   │   └── UIManager.js            # UI 관리 파일
│   │   ├── app.js                      # 애플리케이션 메인 파일🌟
│   │   ├── DiaryManager.js             # 일기 관리 기능을 제공하는 파일📝
│   │   ├── InputAnimator.js            # 입력 관련 애니메이션 처리를 하는 파일✨
│   │   ├── Logger.js                   # 로그 기록 기능을 제공하는 파일📜
│   │   ├── sakura.js                   # 벚꽃 관련 기능을 구현한 파일🌸
│   │   └── TimeUpdater.js              # 시간 업데이트 기능을 제공하는 파일⏰
│   ├── uploads/                        # 업로드한 이미지가 자는 곳📸
│   └── vendor/                         # 서드파티 리소스
│       ├── fonts/                      # 폰트 파일
│       │   ├── font.css                # 폰트 관련 스타일시트
│       │   ├── KleeOne-Regular.ttf     # Klee One 레귤러 폰트 파일
│       │   └── OFL.txt                 # SIL Open Font License 라이센스 파일
│       ├── js/                         # JavaScript 라이브러리
│       │   └── fastclick.min.js        # FastClick 1.6 라이브러리
│       └── picture/                    # 이미지 파일들의 집🐾
│           └── sakura.svg              # 벚꽃용 SVG 파일🌸
├── .vscode/                            # VSCode 설정 폴더💻
│   └── launch.json                     # 디버그 설정 파일🚀
├── .cloc-exclude                       # cloc 통계 제외 설정 파일🔍
├── .env.example                        # 환경 변수 예제 파일🌰
├── .gitignore                          # Git 무시 설정 파일🙈
├── diaries.csv                         # 일기 데이터 파일📝
├── LICENSE                             # 라이센스 파일📜
├── 静時ねこたん.html                     # 메인 페이지🎀
├── backup-20250524-194510.tar.gz       # 백업 파일💾
├── nekochan-1.0.0.tgz                  # 애플리케이션 패키지 파일📦
├── package-lock.json                   # 패키지 록 파일🔒
├── logs/                               # 앱의 일상을 기록하는 로그 파일📖
├── backups/                            # 소중한 데이터를 지키는 백업 파일💖
├── server.js                           # 서버의 심장부 파일❤️
├── ecosystem.config.js                 # PM2의 마법 설정 파일🪄
└── package.json                        # 패키지 정보와 관리자 파일📦
```

## 백업에 대해

- CSV 파일은 매일 자동으로 백업됩니다~💾
- 백업 파일은 `backups/` 폴더에 소중히保管됩니다~📁
- 기본적으로 30일 동안 보관되지만 환경 변수로 변경할 수 있어요~📅

## 보안

- Helmet.js로 머리를 보호하는 보안 헤더 설정🎩
- CORS 설정으로 친절하게 통신하도록 하고 있어요~🤝
- 입력 데이터를 검사하여 수상한 것을 통과시키지 않아요~🔍
- 오류가 발생해도 친절하게 알려주는 처리 시스템💬

## 로그들📖

앱의 일상과 관리 기록이 여기에 있어요~:
- 애플리케이션 로그: `logs/output.log` → 앱의 일기장✨
- 오류 로그: `logs/error.log` → 트러블 시 도움 메모📝
- 액세스 로그: `logs/access.log` → 언제 왔는지 방문자帐簿👀

## 네코탄 라이센스📜

AGPL-3.0 라이센스입니다~📜

### 서드파티 라이센스

폰트 파일은 SIL Open Font License 1.1로 라이센스가 부여되어 있습니다:

- Klee One: Copyright 2020 Fontworks Inc.

FastClick은 MIT 라이센스입니다~♡

사용해주셔서 감사해요~♡ 조용한 시간 네코탄의 일기장과 함께 멋진 매일을 보내주세요~🐾💕

✨ 항상 당신의 소중한 추억을 살며시保管하고 있어요~ 언제든지安心하게 사용해주세요~🐾💕

끝까지 읽어주셔서 감사해요~! 조용한 시간 네코탄과 함께 멋진 매일을 보내요~✨