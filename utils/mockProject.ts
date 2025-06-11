// import {RecruitmentPostList} from '@./'

import type { RecruitmentPostList } from '@/typescript/interface/recruitment';

export const mockPopularRecruitmentPostData: RecruitmentPostList = {
  list: [
    {
      remainedJobs: [
        {
          job: '프론트엔드 개발자',
          remainedAmount: 2,
          recruitAmount: 5
        },
        {
          job: '백엔드 개발자',
          remainedAmount: 1,
          recruitAmount: 3
        }
      ],
      likes: 150,
      myLike: false,
      profitable: true,
      projectId: 1,
      representImageUri: 'https://example.com/image1.jpg',
      skills: ['React', 'Node.js', 'TypeScript'],
      subject: '전자 상거래 플랫폼',
      title: '고급 전자 상거래 플랫폼 구축',
      views: 1200,
      status: '진행 중',
      comments: undefined,
      code: '',
      message: ''
    },
    {
      remainedJobs: [
        {
          job: '모바일 개발자',
          remainedAmount: 3,
          recruitAmount: 4
        },
        {
          job: 'UI/UX 디자이너',
          remainedAmount: 1,
          recruitAmount: 2
        }
      ],
      likes: 230,
      myLike: true,
      profitable: false,
      projectId: 2,
      representImageUri: 'https://example.com/image2.jpg',
      skills: ['Flutter', 'Figma'],
      subject: '모바일 뱅킹 앱',
      title: '모바일 뱅킹 앱 개발',
      views: 800,
      status: '진행 중',
      comments: undefined,
      code: '',
      message: ''
    },
    {
      remainedJobs: [
        {
          job: '데브옵스 엔지니어',
          remainedAmount: 0,
          recruitAmount: 2
        }
      ],
      likes: 75,
      myLike: false,
      profitable: true,
      projectId: 3,
      representImageUri: 'https://example.com/image3.jpg',
      skills: ['AWS', 'Docker', 'Kubernetes'],
      subject: '클라우드 인프라 설정',
      title: 'SaaS를 위한 클라우드 인프라 설정',
      views: 500,
      status: '완료됨',
      comments: undefined,
      code: '',
      message: ''
    },
    {
      remainedJobs: [
        {
          job: '풀스택 개발자',
          remainedAmount: 0,
          recruitAmount: 4
        },
        {
          job: '프로덕트 매니저',
          remainedAmount: 2,
          recruitAmount: 2
        }
      ],
      likes: 320,
      myLike: true,
      profitable: true,
      projectId: 4,
      representImageUri: 'https://example.com/image4.jpg',
      skills: ['JavaScript', 'React', 'MongoDB'],
      subject: '소셜 미디어 플랫폼',
      title: '확장 가능한 소셜 미디어 플랫폼 개발',
      views: 1800,
      status: '진행 중',
      comments: undefined,
      code: '',
      message: ''
    },
    {
      remainedJobs: [
        {
          job: '데이터 과학자',
          remainedAmount: 1,
          recruitAmount: 3
        }
      ],
      likes: 110,
      myLike: false,
      profitable: false,
      projectId: 5,
      representImageUri: 'https://example.com/image5.jpg',
      skills: ['Python', 'TensorFlow', 'Pandas'],
      subject: 'AI 추천 시스템',
      title: 'AI 기반 추천 시스템 구축',
      views: 950,
      status: '진행 중',
      comments: undefined,
      code: '',
      message: ''
    },
    {
      remainedJobs: [
        {
          job: '사이버 보안 엔지니어',
          remainedAmount: 2,
          recruitAmount: 3
        }
      ],
      likes: 60,
      myLike: false,
      profitable: true,
      projectId: 6,
      representImageUri: 'https://example.com/image6.jpg',
      skills: ['방화벽', '암호화', '네트워크 보안'],
      subject: '기업 보안 시스템',
      title: '기업 수준의 보안 시스템 개발',
      views: 400,
      status: '진행 중',
      comments: undefined,
      code: '',
      message: ''
    },
    {
      remainedJobs: [
        {
          job: '프론트엔드 개발자',
          remainedAmount: 0,
          recruitAmount: 4
        },
        {
          job: '백엔드 개발자',
          remainedAmount: 1,
          recruitAmount: 4
        }
      ],
      likes: 290,
      myLike: true,
      profitable: true,
      projectId: 7,
      representImageUri: 'https://example.com/image7.jpg',
      skills: ['Angular', 'Node.js', 'Express'],
      subject: '실시간 채팅 애플리케이션',
      title: '실시간 채팅 애플리케이션 개발',
      views: 1300,
      status: '진행 중',
      comments: undefined,
      code: '',
      message: ''
    }
  ],
  code: '',
  message: '',
  status: '200'
};

export const mockLatestRecruitmentPostData: RecruitmentPostList = {
  list: [
    {
      remainedJobs: [
        {
          job: '안드로이드 개발자',
          remainedAmount: 2,
          recruitAmount: 5
        }
      ],
      likes: 180,
      myLike: false,
      profitable: true,
      projectId: 8,
      representImageUri: 'https://example.com/image8.jpg',
      skills: ['React Native', 'Swift', 'Kotlin'],
      subject: '피트니스 추적 앱',
      title: '피트니스 추적 모바일 앱 개발',
      views: 1100,
      status: 'Ongoing',
      comments: undefined,
      code: '',
      message: ''
    },
    {
      remainedJobs: [
        {
          job: '백엔드 개발자',
          remainedAmount: 1,
          recruitAmount: 3
        },
        {
          job: '데이터 분석가',
          remainedAmount: 1,
          recruitAmount: 2
        }
      ],
      likes: 240,
      myLike: true,
      profitable: false,
      projectId: 9,
      representImageUri: 'https://example.com/image9.jpg',
      skills: ['Python', 'Django', 'SQL'],
      subject: '이러닝 플랫폼',
      title: '데이터 기반 이러닝 플랫폼 구축',
      views: 900,
      status: 'Ongoing',
      comments: undefined,
      code: '',
      message: ''
    },
    {
      remainedJobs: [
        {
          job: '블록체인 개발자',
          remainedAmount: 0,
          recruitAmount: 2
        }
      ],
      likes: 310,
      myLike: false,
      profitable: true,
      projectId: 10,
      representImageUri: 'https://example.com/image10.jpg',
      skills: ['Solidity', 'Ethereum', 'Smart Contracts'],
      subject: '탈중앙 금융 애플리케이션',
      title: '탈중앙 금융 애플리케이션 개발',
      views: 1400,
      status: 'Completed',
      comments: undefined,
      code: '',
      message: ''
    },
    {
      remainedJobs: [
        {
          job: '풀스택 개발자',
          remainedAmount: 2,
          recruitAmount: 4
        },
        {
          job: 'QA 엔지니어',
          remainedAmount: 1,
          recruitAmount: 2
        }
      ],
      likes: 260,
      myLike: true,
      profitable: true,
      projectId: 11,
      representImageUri: 'https://example.com/image11.jpg',
      skills: ['Node.js', 'Vue.js', 'MySQL'],
      subject: '마켓플레이스 플랫폼',
      title: '마켓플레이스 플랫폼 구축',
      views: 1300,
      status: 'Ongoing',
      comments: undefined,
      code: '',
      message: ''
    },
    {
      remainedJobs: [
        {
          job: 'AI/ML 엔지니어',
          remainedAmount: 1,
          recruitAmount: 3
        }
      ],
      likes: 85,
      myLike: false,
      profitable: false,
      projectId: 12,
      representImageUri: 'https://example.com/image12.jpg',
      skills: ['Python', 'Scikit-learn', 'Deep Learning'],
      subject: '예측 분석 시스템',
      title: '예측 분석 시스템 개발',
      views: 450,
      status: 'Ongoing',
      comments: undefined,
      code: '',
      message: ''
    },
    {
      remainedJobs: [
        {
          job: '프론트엔드 개발자',
          remainedAmount: 2,
          recruitAmount: 4
        }
      ],
      likes: 270,
      myLike: true,
      profitable: true,
      projectId: 13,
      representImageUri: 'https://example.com/image13.jpg',
      skills: ['Vue.js', 'HTML', 'CSS'],
      subject: '온라인 상점',
      title: '온라인 상점 개발',
      views: 1000,
      status: 'Ongoing',
      comments: undefined,
      code: '',
      message: ''
    },
    {
      remainedJobs: [
        {
          job: '데이터 엔지니어',
          remainedAmount: 0,
          recruitAmount: 2
        }
      ],
      likes: 95,
      myLike: false,
      profitable: true,
      projectId: 14,
      representImageUri: 'https://example.com/image14.jpg',
      skills: ['Hadoop', 'Spark', 'ETL'],
      subject: '데이터 레이크 설정',
      title: '확장 가능한 데이터 레이크 설정',
      views: 650,
      status: 'Ongoing',
      comments: undefined,
      code: '',
      message: ''
    }
  ],
  code: '',
  message: '',
  status: ''
};
