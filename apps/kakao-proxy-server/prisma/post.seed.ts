import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Posts 데이터
const postTitles = [
    '애플 주가 전망 어떻게 보시나요?',
    '테슬라 실적 발표 후 급등! 이제 매수 타이밍일까요?',
    '엔비디아 AI 붐, 언제까지 갈까요?',
    '마이크로소프트 클라우드 사업 성장률 분석',
    '아마존 물류 네트워크 확장 소식',
    '알파벳 광고 수익 감소 우려',
    '메타 메타버스 투자 과연 성공할까?',
    '넷플릭스 구독자 수 증가세 지속',
    '월마트 오프라인 매장 디지털 전환',
    '비자 결제 시스템 혁신 동향',
    '마스터카드 암호화폐 결제 도입',
    '제이피모건 디지털 뱅킹 확장',
    '오라클 클라우드 인프라 성장',
    '세일스포스 CRM 시장 점유율',
    '홈디포 주택 개선 시장 호황',
    '코스트코 회원제 모델의 강점',
    '존슨앤드존슨 의료기기 부문 분석',
    '일라이릴리 당뇨병 치료제 성과',
    '애브비 면역치료제 시장 전망',
    '브로드컴 반도체 업계 동향',
    'TSMC 파운드리 시장 독점 현황',
    '버크셔 헤서웨이 포트폴리오 분석',
    '노보노디스크 비만치료제 전망',
    'SAP 클라우드 전환 성과',
    'ASML 극자외선 장비 수요 증가',
];

const postContents = [
    '최근 실적을 보면 매출이 꾸준히 증가하고 있어서 긍정적으로 보고 있습니다. 특히 서비스 부문의 성장이 인상적이네요.',
    '기술적 분석 관점에서 보면 지지선을 잘 지키고 있고, 거래량도 증가하고 있어서 상승 모멘텀이 있어 보입니다.',
    '펀더멘털 분석을 해보니 PER이 업계 평균보다 낮아서 저평가된 것 같습니다. 장기 투자 관점에서 매력적이에요.',
    '최근 발표된 신제품이 시장에서 좋은 반응을 얻고 있어서 향후 매출 증가가 기대됩니다.',
    '경쟁사 대비 기술력이 우수하고 특허도 많이 보유하고 있어서 경쟁 우위가 있다고 봅니다.',
    '글로벌 시장 확장 계획이 구체적이고 실현 가능성이 높아 보여서 성장 가능성이 크다고 생각합니다.',
    '최근 주가 조정이 있었지만 오히려 좋은 매수 기회라고 봅니다. 단기적 변동보다는 장기적 성장에 주목하고 있어요.',
    '배당 수익률도 안정적이고 배당 성장률도 꾸준해서 배당 투자자에게도 매력적인 종목이라고 생각합니다.',
    'ESG 경영에도 적극적이어서 장기적으로 지속가능한 성장이 가능할 것 같습니다.',
    '업계 전체적으로 성장하고 있는 분야이고, 이 회사가 시장 점유율 1위를 유지하고 있어서 안정적입니다.',
    '최근 발표된 분기 실적이 예상을 상회했고, 가이던스도 상향 조정되어서 긍정적입니다.',
    '주요 경쟁사들과 비교해도 마진율이 높고 효율성이 좋아서 투자 매력도가 높다고 봅니다.',
    '신규 시장 진출 계획이 잘 수립되어 있고, 이미 테스트 마케팅에서 좋은 결과를 보이고 있어요.',
    '기관투자자들의 매수세가 꾸준히 유입되고 있어서 주가 상승 동력이 있다고 생각합니다.',
    '최근 인수합병 소식이 있었는데, 시너지 효과가 클 것으로 예상되어 기대하고 있습니다.',
    '차세대 기술 개발에 대한 투자가 활발하고, 연구개발비 비중도 적정 수준이라고 봅니다.',
    '글로벌 공급망 다각화가 잘 이루어져 있어서 리스크 관리 측면에서도 우수합니다.',
    '정부 정책의 수혜를 받을 수 있는 업종이라서 추가적인 성장 모멘텀이 있을 것 같아요.',
    '주주친화적 정책을 지속적으로 추진하고 있어서 주주 가치 제고에 노력하고 있습니다.',
    '최근 업계 트렌드를 선도하고 있고, 혁신적인 비즈니스 모델로 차별화되어 있어서 긍정적으로 봅니다.',
];

// Comments 더미 데이터
const commentContents = [
    '좋은 분석이네요! 동감합니다.',
    '저도 비슷하게 생각하고 있었는데, 좋은 정보 감사합니다.',
    '다른 관점에서 보면 어떨까요?',
    '정말 유용한 글입니다. 참고하겠습니다.',
    '추가로 고려해봐야 할 부분이 있을 것 같은데요.',
    '훌륭한 인사이트입니다!',
    '이런 시각으로 봐야겠네요.',
    '공감합니다. 저도 같은 생각이었어요.',
    '흥미로운 분석이네요. 더 자세히 알고 싶습니다.',
    '좋은 정보 공유 감사합니다.',
    '이 부분에 대해서는 조금 다르게 생각해요.',
    '정말 도움이 되는 내용이네요!',
    '새로운 관점을 배웠습니다.',
    '구체적인 데이터가 있으면 더 좋겠어요.',
    '경험상 이런 케이스도 있었습니다.',
    '앞으로 지켜봐야겠네요.',
    '좋은 지적이세요!',
    '이런 분석 너무 좋아요.',
    '더 많은 의견을 듣고 싶습니다.',
    '정말 인상적인 내용입니다.',
    '저도 이 종목에 관심이 있어요.',
    '시장 상황을 잘 분석하신 것 같아요.',
    '투자에 참고하겠습니다.',
    '전문적인 분석 감사합니다.',
    '다음 글도 기대하겠습니다!',
    '정말 유익한 정보네요.',
    '이런 관점은 처음 봅니다.',
    '수고하셨습니다!',
    '좋은 자료 공유 감사해요.',
    '계속 관심 갖고 지켜보겠습니다.',
];

export async function seedPosts() {
    console.log('📝 Posts 더미 데이터 생성 시작...');

    // User와 Stock 데이터 확인
    const users = await prisma.user.findMany({
        select: { id: true, nickname: true },
    });

    const stocks = await prisma.stock.findMany({
        select: { symbol: true, nameKo: true },
    });

    if (users.length === 0) {
        console.log('❌ User 데이터가 없습니다. Posts 생성을 건너뜁니다.');
        return [];
    }

    if (stocks.length === 0) {
        console.log('❌ Stock 데이터가 없습니다. Posts 생성을 건너뜁니다.');
        return [];
    }

    console.log(`✅ Users: ${users.length}개, Stocks: ${stocks.length}개 발견`);

    const existingPostsCount = await prisma.post.count();
    console.log(`현재 Posts: ${existingPostsCount}개`);

    // 50개의 더미 포스트 생성
    const postsToCreate = 50;
    let postsCreated = 0;
    const createdPosts: { id: number; userId: string }[] = [];

    for (let i = 0; i < postsToCreate; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomStock = stocks[Math.floor(Math.random() * stocks.length)];
        const randomTitle = postTitles[Math.floor(Math.random() * postTitles.length)];
        const randomContent = postContents[Math.floor(Math.random() * postContents.length)];

        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));

        try {
            const post = await prisma.post.create({
                data: {
                    title: `${randomTitle} - ${randomStock.nameKo}`,
                    content: randomContent,
                    userId: randomUser.id,
                    stockSymbol: randomStock.symbol,
                    createdAt: randomDate,
                    updatedAt: randomDate,
                    thumbnailImage: null,
                    score: 0,
                },
            });

            createdPosts.push({ id: post.id, userId: randomUser.id });
            postsCreated++;
            if (postsCreated % 10 === 0) {
                console.log(`✅ ${postsCreated}/${postsToCreate} Posts 생성 중...`);
            }
        } catch (error) {
            console.error(`❌ Post ${i + 1} 생성 실패:`, error);
        }
    }

    console.log(`📊 Posts 생성 완료: ${postsCreated}개 추가됨`);
    return createdPosts;
}

export async function seedPostLikes(posts: { id: number; userId: string }[]) {
    console.log('❤️ PostLikes 더미 데이터 생성 시작...');

    const users = await prisma.user.findMany({
        select: { id: true },
    });

    if (users.length === 0) {
        console.log('❌ User 데이터가 없습니다. PostLikes 생성을 건너뜁니다.');
        return;
    }

    let likesCreated = 0;
    const totalLikesToCreate = Math.floor(posts.length * 0.7); // 70%의 포스트에 좋아요

    for (let i = 0; i < totalLikesToCreate; i++) {
        const randomPost = posts[Math.floor(Math.random() * posts.length)];
        const randomUser = users[Math.floor(Math.random() * users.length)];

        // 같은 사용자가 같은 포스트에 좋아요를 중복으로 누르지 않도록 체크
        const existingLike = await prisma.postLike.findFirst({
            where: {
                postId: randomPost.id,
                userId: randomUser.id,
            },
        });

        if (existingLike) {
            continue;
        }

        try {
            await prisma.postLike.create({
                data: {
                    postId: randomPost.id,
                    userId: randomUser.id,
                },
            });

            likesCreated++;
            if (likesCreated % 20 === 0) {
                console.log(`✅ ${likesCreated}/${totalLikesToCreate} PostLikes 생성 중...`);
            }
        } catch (error) {
            console.error(`❌ PostLike 생성 실패:`, error);
        }
    }

    console.log(`📊 PostLikes 생성 완료: ${likesCreated}개 추가됨`);
}

export async function seedPostViews(posts: { id: number; userId: string }[]) {
    console.log('👁️ PostViews 더미 데이터 생성 시작...');

    const users = await prisma.user.findMany({
        select: { id: true },
    });

    if (users.length === 0) {
        console.log('❌ User 데이터가 없습니다. PostViews 생성을 건너뜁니다.');
        return;
    }

    let viewsCreated = 0;
    const totalViewsToCreate = Math.floor(posts.length * 2); // 각 포스트당 평균 2개의 조회수

    for (let i = 0; i < totalViewsToCreate; i++) {
        const randomPost = posts[Math.floor(Math.random() * posts.length)];
        const randomUser = users[Math.floor(Math.random() * users.length)];

        // 같은 사용자가 같은 포스트를 중복으로 조회하지 않도록 체크
        const existingView = await prisma.postViews.findFirst({
            where: {
                postId: randomPost.id,
                userId: randomUser.id,
            },
        });

        if (existingView) {
            continue;
        }

        try {
            await prisma.postViews.create({
                data: {
                    postId: randomPost.id,
                    userId: randomUser.id,
                },
            });

            viewsCreated++;
            if (viewsCreated % 30 === 0) {
                console.log(`✅ ${viewsCreated}/${totalViewsToCreate} PostViews 생성 중...`);
            }
        } catch (error) {
            console.error(`❌ PostView 생성 실패:`, error);
        }
    }

    console.log(`📊 PostViews 생성 완료: ${viewsCreated}개 추가됨`);
}

export async function seedComments(posts: { id: number; userId: string }[]) {
    console.log('💬 Comments 더미 데이터 생성 시작...');

    const users = await prisma.user.findMany({
        select: { id: true, nickname: true },
    });

    if (users.length === 0) {
        console.log('❌ User 데이터가 없습니다. Comments 생성을 건너뜁니다.');
        return;
    }

    if (posts.length === 0) {
        console.log('❌ Post 데이터가 없습니다. Comments 생성을 건너뜁니다.');
        return;
    }

    let commentsCreated = 0;
    const totalCommentsToCreate = Math.floor(posts.length * 1.5); // 각 포스트당 평균 1.5개의 댓글

    for (let i = 0; i < totalCommentsToCreate; i++) {
        const randomPost = posts[Math.floor(Math.random() * posts.length)];
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomContent = commentContents[Math.floor(Math.random() * commentContents.length)];

        // 댓글 생성 시간을 포스트 생성 시간 이후로 설정
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 25)); // 0~25일 전

        try {
            await prisma.comment.create({
                data: {
                    postId: randomPost.id,
                    userId: randomUser.id,
                    content: randomContent,
                    createdAt: randomDate,
                    updatedAt: randomDate,
                },
            });

            commentsCreated++;
            if (commentsCreated % 20 === 0) {
                console.log(`✅ ${commentsCreated}/${totalCommentsToCreate} Comments 생성 중...`);
            }
        } catch (error) {
            console.error(`❌ Comment 생성 실패:`, error);
        }
    }

    console.log(`📊 Comments 생성 완료: ${commentsCreated}개 추가됨`);
}

async function main() {
    const createdPosts = await seedPosts();

    if (createdPosts && createdPosts.length > 0) {
        await seedPostLikes(createdPosts);
    }

    if (createdPosts && createdPosts.length > 0) {
        await seedPostViews(createdPosts);
    }

    if (createdPosts && createdPosts.length > 0) {
        await seedComments(createdPosts);
    }
}

main()
    .catch(e => {
        console.error('❌ 에러 발생:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
