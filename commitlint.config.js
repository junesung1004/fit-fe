const commitlintConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // ✅ 타입 제한
    'type-enum': [
      2,
      'always',
      [
        'feat', // 기능 추가
        'fix', // 버그 수정
        'docs', // 문서 추가/수정
        'style', // 포맷팅 (세미콜론, 들여쓰기 등)
        'refactor', // 리팩토링
        'test', // 테스트 추가/수정
        'chore', // 기타 변경 (빌드, 패키지 등)
        'build', // 빌드 시스템 변경
        'ci', // CI/CD 설정
        'perf', // 성능 개선
        'config', // 설정 파일 변경
        'init', // 프로젝트 초기화
      ],
    ],

    // ✅ 제목 끝에 마침표 금지
    'subject-full-stop': [2, 'never', '.'],
  },
};

module.exports = commitlintConfig;
