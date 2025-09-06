import { MarketCode } from '@/entities/stock';

/**
 * 해외주식 조건 검색 쿼리 파라미터
 */
export type OverseasStockConditionSearchParams = {
    /** 사용자권한정보 - "" (Null 값 설정) */
    AUTH: string;
    /** 거래소코드 - NYS: 뉴욕, NAS: 나스닥, AMS: 아멕스, HKS: 홍콩, SHS: 상해, SZS: 심천, HSX: 호치민, HNX: 하노이, TSE: 도쿄 */
    EXCD: MarketCode;
    /** 현재가선택조건 - 해당조건 사용시(1), 미사용시 필수항목아님 */
    CO_YN_PRICECUR?: '1';
    /** 현재가시작범위가 - 단위: 각국통화(JPY, USD, HKD, CNY, VND) */
    CO_ST_PRICECUR?: string;
    /** 현재가끝범위가 - 단위: 각국통화(JPY, USD, HKD, CNY, VND) */
    CO_EN_PRICECUR?: string;
    /** 등락율선택조건 - 해당조건 사용시(1), 미사용시 필수항목아님 */
    CO_YN_RATE?: '1';
    /** 등락율시작율 - % */
    CO_ST_RATE?: string;
    /** 등락율끝율 - % */
    CO_EN_RATE?: string;
    /** 시가총액선택조건 - 해당조건 사용시(1), 미사용시 필수항목아님 */
    CO_YN_VALX?: '1';
    /** 시가총액시작액 - 단위: 천 */
    CO_ST_VALX?: string;
    /** 시가총액끝액 - 단위: 천 */
    CO_EN_VALX?: string;
    /** 발행주식수선택조건 - 해당조건 사용시(1), 미사용시 필수항목아님 */
    CO_YN_SHAR?: '1';
    /** 발행주식시작수 - 단위: 천 */
    CO_ST_SHAR?: string;
    /** 발행주식끝수 - 단위: 천 */
    CO_EN_SHAR?: string;
    /** 거래량선택조건 - 해당조건 사용시(1), 미사용시 필수항목아님 */
    CO_YN_VOLUME?: '1';
    /** 거래량시작량 - 단위: 주 */
    CO_ST_VOLUME?: string;
    /** 거래량끝량 - 단위: 주 */
    CO_EN_VOLUME?: string;
    /** 거래대금선택조건 - 해당조건 사용시(1), 미사용시 필수항목아님 */
    CO_YN_AMT?: '1';
    /** 거래대금시작금 - 단위: 천 */
    CO_ST_AMT?: string;
    /** 거래대금끝금 - 단위: 천 */
    CO_EN_AMT?: string;
    /** EPS선택조건 - 해당조건 사용시(1), 미사용시 필수항목아님 */
    CO_YN_EPS?: '1';
    /** EPS시작 */
    CO_ST_EPS?: string;
    /** EPS끝 */
    CO_EN_EPS?: string;
    /** PER선택조건 - 해당조건 사용시(1), 미사용시 필수항목아님 */
    CO_YN_PER?: '1';
    /** PER시작 */
    CO_ST_PER?: string;
    /** PER끝 */
    CO_EN_PER?: string;
    /** NEXT KEY BUFF - "" 공백 입력 */
    KEYB?: string;
};

export type KISAccessTokenResponse = {
    access_token: string;
    access_token_token_expired: string;
    token_type: string;
    expires_in: number;
};

export type OverseasStockConditionSearchResponse = {
    rt_cd: string; // 성공 실패 여부
    msg_cd: string; // 응답코드
    msg1: string; // 응답메세지
    output1: {
        zdiv: string; // 소수점 자리수
        stat: string; // 거래상태정보
        crec: string; // 현재조회종목수
        trec: string; // 전체조회종목수
        nrec: string; // Record Count
    };
    output2: {
        rsym: string; // 실시간조회심볼
        excd: string; // 거래소코드
        name: string; // 종목명
        symb: string; // 종목코드
        last: string; // 현재가
        shar: string; // 발행주식
        valx: string; // 시가총액
        plow: string; // 저가
        phigh: string; // 고가
        popen: string; // 시가
        tvol: string; // 거래량
        rate: string; // 등락율
        diff: string; // 대비
        sign: '1' | '2' | '3' | '4' | '5'; // 대비기호 (1: 상한, 2: 상승, 3:보합, 4:하한, 5:하락)
        avol: string; // 거래대금
        eps: string; // EPS
        per: string; // PER
        rank: string; // 순위
        ename: string; // 영문종목명
        e_ordyn: string; // 매매가능
    }[];
};

export type OverseasStockPriceResponse = {
    rt_cd: string; // 성공 실패 여부 (0: 성공, 0이외의 값: 실패)
    msg_cd: string; // 응답코드
    msg1: string; // 응답메세지
    output: {
        rsym: string; // 종목코드 D + 시장구분(3자리) + 종목코드 (예: DNASAAPL)
        zdiv: string; // 소수점 자리수
        base: string; // 전일종가
        pvol: string; // 전일거래량
        last: string; // 현재가
        sign: '1' | '2' | '3' | '4' | '5'; // 대비기호 (1: 상한, 2: 상승, 3:보합, 4:하한, 5:하락)
        diff: string; // 대비
        rate: string; // 등락율
        tvol: string; // 거래량
        tamt: string; // 거래대금
        ordy: string; // 매수가능여부
    };
};

export type OverseasStockInfoResponse = {
    rt_cd: string; // 성공 실패 여부
    msg_cd: string; // 응답코드
    msg1: string; // 응답메세지
    output: {
        std_pdno: string; // 표준상품번호
        prdt_eng_name: string; // 상품영문명
        natn_cd: string; // 국가코드
        natn_name: string; // 국가명
        tr_mket_cd: string; // 거래시장코드
        tr_mket_name: string; // 거래시장명
        ovrs_excg_cd: string; // 해외거래소코드
        ovrs_excg_name: string; // 해외거래소명
        tr_crcy_cd: string; // 거래통화코드
        ovrs_papr: string; // 해외액면가
        crcy_name: string; // 통화명
        ovrs_stck_dvsn_cd: string; // 해외주식구분코드
        prdt_clsf_cd: string; // 상품분류코드
        prdt_clsf_name: string; // 상품분류명
        sll_unit_qty: string; // 매도단위수량
        buy_unit_qty: string; // 매수단위수량
        tr_unit_amt: string; // 거래단위금액
        lstg_stck_num: string; // 상장주식수
        lstg_dt: string; // 상장일자
        ovrs_stck_tr_stop_dvsn_cd: string; // 해외주식거래정지구분코드
        lstg_abol_item_yn: string; // 상장폐지종목여부
        ovrs_stck_prdt_grp_no: string; // 해외주식상품그룹번호
        lstg_yn: string; // 상장여부
        tax_levy_yn: string; // 세금징수여부
        ovrs_stck_erlm_rosn_cd: string; // 해외주식등록사유코드
        ovrs_stck_hist_rght_dvsn_cd: string; // 해외주식이력권리구분코드
        chng_bf_pdno: string; // 변경전상품번호
        prdt_type_cd_2: string; // 상품유형코드2
        ovrs_item_name: string; // 해외종목명
        sedol_no: string; // SEDOL번호
        blbg_tckr_text: string; // 블름버그티커내용
        ovrs_stck_etf_risk_drtp_cd: string; // 해외주식ETF위험지표코드
        etp_chas_erng_rt_dbnb: string; // ETP추적수익율배수
        istt_usge_isin_cd: string; // 기관용도ISIN코드
        mint_svc_yn: string; // MINT서비스여부
        mint_svc_yn_chng_dt: string; // MINT서비스여부변경일자
        prdt_name: string; // 상품명
        lei_cd: string; // LEI코드
        ovrs_stck_stop_rson_cd: string; // 해외주식정지사유코드
        lstg_abol_dt: string; // 상장폐지일자
        mini_stk_tr_stat_dvsn_cd: string; // 미니스탁거래상태구분코드
        mint_frst_svc_erlm_dt: string; // MINT최초서비스등록일자
        mint_dcpt_trad_psbl_yn: string; // MINT소수점매매가능여부
        mint_fnum_trad_psbl_yn: string; // MINT정수매매가능여부
        mint_cblc_cvsn_ipsb_yn: string; // MINT잔고전환불가여부
        ptp_item_yn: string; // PTP종목여부
        ptp_item_trfx_exmt_yn: string; // PTP종목양도세면제여부
        ptp_item_trfx_exmt_strt_dt: string; // PTP종목양도세면제시작일자
        ptp_item_trfx_exmt_end_dt: string; // PTP종목양도세면제종료일자
        dtm_tr_psbl_yn: string; // 주간거래가능여부
        sdrf_stop_ecls_yn: string; // 급등락정지제외여부
        sdrf_stop_ecls_erlm_dt: string; // 급등락정지제외등록일자
        memo_text1: string; // 메모내용1
        ovrs_now_pric1: string; // 해외현재가격1
        last_rcvg_dtime: string; // 최종수신일시
    }; // 응답상세1
};
