export type QuestionType = 'EI' | 'SN' | 'TF' | 'JP';

export interface Question {
    id: number;
    text: string;
    type: QuestionType;
    options: {
        text: string;
        value: string;
    }[];
}

export const questions: Question[] = [
    {
        id: 1,
        text: "주말에 약속이 없다면?",
        type: 'EI',
        options: [
            { text: "친구들에게 연락해 약속을 잡는다.", value: 'E' },
            { text: "집에서 혼자만의 시간을 즐긴다.", value: 'I' },
        ],
    },
    {
        id: 2,
        text: "새로운 사람을 만났을 때 나는?",
        type: 'EI',
        options: [
            { text: "먼저 말을 걸고 대화를 주도한다.", value: 'E' },
            { text: "상대방이 말을 걸 때까지 기다린다.", value: 'I' },
        ],
    },
    {
        id: 3,
        text: "친구들과 여행 계획을 짤 때?",
        type: 'JP',
        options: [
            { text: "분 단위로 꼼꼼하게 계획을 세운다.", value: 'J' },
            { text: "큰 틀만 정하고 가서 생각한다.", value: 'P' },
        ],
    },
    {
        id: 4,
        text: "영화를 고를 때 나는?",
        type: 'SN',
        options: [
            { text: "실화 바탕이나 현실적인 장르를 선호한다.", value: 'S' },
            { text: "판타지나 SF 같은 상상력이 풍부한 장르를 선호한다.", value: 'N' },
        ],
    },
    {
        id: 5,
        text: "친구가 우울하다고 할 때 나의 반응은?",
        type: 'TF',
        options: [
            { text: "왜 우울해? 무슨 일 있었어? (해결책 제시)", value: 'T' },
            { text: "많이 힘들었겠다... (공감과 위로)", value: 'F' },
        ],
    },
    {
        id: 6,
        text: "일할 때 나는?",
        type: 'JP',
        options: [
            { text: "미리미리 끝내놓고 쉰다.", value: 'J' },
            { text: "마감 기한이 닥쳐야 효율이 오른다.", value: 'P' },
        ],
    },
    {
        id: 7,
        text: "멍 때릴 때 나는?",
        type: 'SN',
        options: [
            { text: "아무 생각 안 하거나 눈앞의 사물을 본다.", value: 'S' },
            { text: "만약에... 같은 상상의 나래를 펼친다.", value: 'N' },
        ],
    },
    {
        id: 8,
        text: "결정을 내릴 때 더 중요한 것은?",
        type: 'TF',
        options: [
            { text: "논리적인 사실과 원칙", value: 'T' },
            { text: "사람들의 감정과 관계", value: 'F' },
        ],
    },
    {
        id: 9,
        text: "파티에서 나는?",
        type: 'EI',
        options: [
            { text: "무대의 중심이 되어 분위기를 띄운다.", value: 'E' },
            { text: "친한 친구 몇 명과 조용히 이야기한다.", value: 'I' },
        ],
    },
    {
        id: 10,
        text: "요리할 때 나는?",
        type: 'SN',
        options: [
            { text: "레시피를 정확히 계량해서 따른다.", value: 'S' },
            { text: "감으로 대충 넣어가며 만든다.", value: 'N' },
        ],
    },
    {
        id: 11,
        text: "친구가 약속 시간에 늦었을 때?",
        type: 'TF',
        options: [
            { text: "늦은 이유가 타당한지 따져본다.", value: 'T' },
            { text: "오느라 고생했다고 걱정해준다.", value: 'F' },
        ],
    },
    {
        id: 12,
        text: "책상 위 상태는?",
        type: 'JP',
        options: [
            { text: "항상 깔끔하게 정리되어 있다.", value: 'J' },
            { text: "필요한 물건들이 어지럽게 놓여 있다.", value: 'P' },
        ],
    },
];
