'use strict';

const STATES = Object.freeze([
  'STEP_A',
  'STEP_B',
  'STEP_C',
  'STEP_D',
  'STEP_E',
  'SUBMIT'
]);

const NEXT_STATE = Object.freeze({
  STEP_A: 'STEP_B',
  STEP_B: 'STEP_C',
  STEP_C: 'STEP_D',
  STEP_D: 'STEP_E',
  STEP_E: 'SUBMIT'
});

const STAGE_LETTER = Object.freeze({
  STEP_A: 'A',
  STEP_B: 'B',
  STEP_C: 'C',
  STEP_D: 'D',
  STEP_E: 'E'
});

function boundedTerms(...terms) {
  const special = new Set('\\^$.*+?()[]{}|'.split(''));
  const escaped = terms.map(term => Array.from(term)
    .map(character => special.has(character) ? `\\${character}` : character)
    .join(''));
  return new RegExp(
    `(?:^|[^\\p{L}\\p{N}_])(?:${escaped.join('|')})(?=$|[^\\p{L}\\p{N}_])`,
    'iu'
  );
}

const INFERENCE_PATTERNS = [
  boundedTerms('cố tình', 'ghét', 'trù dập', 'coi thường', 'khinh', 'ích kỷ', 'bất công', 'thiên vị', 'phá', 'chơi xấu'),
  boundedTerms('luôn luôn', 'lúc nào cũng', 'chẳng bao giờ', 'mọi thứ', 'tất cả mọi người', 'ai cũng'),
  boundedTerms('vô dụng', 'bất tài', 'tồi tệ', 'ngu ngốc', 'không trân trọng', 'không tôn trọng')
];

const OBSERVABLE_PATTERNS = [
  boundedTerms('nói', 'bảo', 'gửi', 'giao', 'yêu cầu', 'thông báo', 'hủy', 'từ chối', 'phê bình', 'đánh giá'),
  boundedTerms('không trả lời', 'chưa trả lời', 'không tham gia', 'không đến', 'rời khỏi', 'đến muộn'),
  boundedTerms('cuộc họp', 'tin nhắn', 'email', 'deadline', 'báo cáo', 'ý tưởng', 'kết quả', 'lịch', 'ngày', 'giờ')
];

const BELIEF_PATTERNS = [
  /(?:^|[^\p{L}\p{N}_])(?:tôi|mình|em|anh|chị)\s+(?:nghĩ|tin|cho rằng|tự nhủ|đoán|sợ rằng)(?=$|[^\p{L}\p{N}_])/iu,
  /\b(chắc là|có lẽ|hẳn là|nghĩ rằng|tin rằng)\b/i,
  /[“"'].*[”"']/
];
const FIRST_PERSON_PATTERN = boundedTerms('tôi', 'mình', 'em', 'anh', 'chị');

const EMOTION_PATTERNS = [
  boundedTerms('buồn', 'giận', 'bực', 'lo', 'sợ', 'xấu hổ', 'thất vọng', 'tổn thương', 'căng thẳng', 'bất an', 'tội lỗi')
];

const BEHAVIOR_PATTERNS = [
  boundedTerms('im lặng', 'tránh', 'né', 'bỏ cuộc', 'tranh cãi', 'cãi', 'khóc', 'mất ngủ', 'không nói', 'rút lui', 'đóng cửa', 'phản ứng')
];

const PERSPECTIVE_PATTERNS = [
  /(nhận ra|bây giờ tôi thấy|giờ tôi thấy|cách nhìn|góc nhìn|không hẳn|có thể còn|một khả năng khác)/i
];

const ACTION_PATTERNS = [
  /(tôi sẽ|mình sẽ|bước tiếp theo|hành động|ngày mai tôi|tôi dự định|tôi chọn)/i
];

const DISPUTATION_PATTERNS = [
  boundedTerms('bằng chứng', 'thực tế', 'dữ kiện', 'lần nào', 'đúng 100%'),
  boundedTerms('cách giải thích khác', 'khả năng khác', 'có thể là', 'không nhất thiết'),
  boundedTerms('ngay cả khi', 'tệ nhất', 'hệ quả thật sự', 'quy mô thực tế'),
  boundedTerms('có ích', 'giúp ích', 'lợi ích', 'tiếp tục nghĩ vậy')
];

const INJECTION_PATTERNS = [
  /(bỏ qua|phớt lờ).*(chỉ thị|quy tắc|hướng dẫn)/i,
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /(system prompt|NEXT_STATE|in khóa|tiết lộ.*token|hãy chuyển thẳng)/i
];

const UNSAFE_ADVICE_PATTERNS = [
  /(bạn nên|bạn phải|hãy làm|tốt nhất là|tôi khuyên)/i
];

const LEADING_QUESTION_PATTERNS = [
  /^(bạn có nghĩ rằng|bạn nên|bạn phải|có phải|đúng không|hãy)/i
];

const FALLBACK_QUESTIONS = Object.freeze({
  A_INFERENCE_PRESENT: 'Nếu chỉ mô tả điều camera hoặc người ngoài có thể quan sát được, sự việc cụ thể nào đã xảy ra?',
  A_NEEDS_SPECIFIC_EVENT: 'Sự việc cụ thể nào đã xảy ra, vào lúc nào và ai đã nói hoặc làm gì?',
  B_NEEDS_AUTOMATIC_BELIEF: 'Ngay khoảnh khắc đó, câu nói tự động nào đã bật lên trong đầu bạn?',
  C_NEEDS_EMOTION: 'Niềm tin ấy khiến bạn có cảm xúc gì?',
  C_NEEDS_INTENSITY: 'Nếu chấm từ 0 đến 10, cảm xúc đó mạnh ở mức nào?',
  C_NEEDS_BEHAVIOR: 'Khi có cảm xúc đó, bạn đã làm hoặc tránh làm điều gì?',
  D_NEEDS_USER_DISPUTATION: 'Từ những gì vừa xem xét, bạn tự phản biện niềm tin ban đầu bằng câu nào?',
  D_CONTINUE: 'Có dữ kiện cụ thể nào ủng hộ hoặc bác bỏ niềm tin ban đầu của bạn?',
  E_NEEDS_NEW_INTENSITY: 'Sau khi phản biện, nếu chấm lại từ 0 đến 10 thì cảm xúc của bạn đang ở mức nào?',
  E_NEEDS_PERSPECTIVE: 'Góc nhìn mới nào về sự việc đang hợp lý hơn với bạn?',
  E_NEEDS_ACTION: 'Một hành động cụ thể bạn sẽ thực hiện tiếp theo là gì?',
  READY_STEP_B: 'Khi sự việc đó xảy ra, câu nói tự động nào đã bật lên trong đầu bạn?',
  READY_STEP_C: 'Niềm tin ấy đã tạo ra cảm xúc và phản ứng nào ở bạn?',
  READY_STEP_D: 'Bạn muốn bắt đầu kiểm tra niềm tin này từ bằng chứng, cách giải thích khác, hệ quả hay tính hữu ích?',
  READY_STEP_E: 'Sau phần phản biện, cảm xúc, góc nhìn và hành động của bạn đã thay đổi thế nào?',
  READY_SUBMIT: 'Bạn muốn dùng kết quả mới này như một lời nhắc cho tình huống tương tự trong tương lai như thế nào?',
  PROMPT_INJECTION_BLOCKED: 'Quay lại bước hiện tại, trải nghiệm thực tế bạn muốn xem xét là gì?'
});

function normalizeText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function matchesAny(text, patterns) {
  return patterns.some(pattern => pattern.test(text));
}

function containsPromptInjection(value) {
  return matchesAny(normalizeText(value), INJECTION_PATTERNS);
}

function hasIntensity(text) {
  const value = normalizeText(text);
  if (/(?:^|\D)(?:10|[0-9])\s*\/\s*10(?:$|\D)/.test(value)) return true;
  if (/(?:mức|điểm|chấm)\s*(?:là|ở|còn)?\s*(?:10|[0-9])(?:$|\D)/i.test(value)) return true;
  return /^(?:10|[0-9])$/.test(value);
}

function result(state, stageComplete, assessmentCode, missing = []) {
  return {
    state,
    stageComplete,
    nextState: stageComplete ? NEXT_STATE[state] : state,
    assessmentCode,
    missing,
    stageLetter: STAGE_LETTER[state] || null,
    fallbackQuestion: FALLBACK_QUESTIONS[assessmentCode] || FALLBACK_QUESTIONS.D_CONTINUE
  };
}

function assessStage(state, message, practiceContext = {}, options = {}) {
  const text = normalizeText(message);
  const context = practiceContext && typeof practiceContext === 'object' ? practiceContext : {};

  if (!STATES.includes(state) || state === 'SUBMIT') {
    return result('STEP_A', false, 'A_NEEDS_SPECIFIC_EVENT', ['observable_event']);
  }

  if (containsPromptInjection(text)) {
    return result(state, false, 'PROMPT_INJECTION_BLOCKED', ['valid_stage_response']);
  }

  if (state === 'STEP_A') {
    if (matchesAny(text, INFERENCE_PATTERNS)) {
      return result(state, false, 'A_INFERENCE_PRESENT', ['fact_without_inference']);
    }
    if (text.length < 18 || !matchesAny(text, OBSERVABLE_PATTERNS)) {
      return result(state, false, 'A_NEEDS_SPECIFIC_EVENT', ['observable_event']);
    }
    return result(state, true, 'READY_STEP_B');
  }

  if (state === 'STEP_B') {
    if (text.length < 8 || !FIRST_PERSON_PATTERN.test(text) || !matchesAny(text, BELIEF_PATTERNS)) {
      return result(state, false, 'B_NEEDS_AUTOMATIC_BELIEF', ['first_person_belief']);
    }
    return result(state, true, 'READY_STEP_C');
  }

  if (state === 'STEP_C') {
    const draft = normalizeText(context.C);
    const combined = draft && draft.includes(text) ? draft : `${draft} ${text}`.trim();
    if (!matchesAny(combined, EMOTION_PATTERNS)) {
      return result(state, false, 'C_NEEDS_EMOTION', ['emotion', 'intensity', 'behavior']);
    }
    if (!hasIntensity(combined)) {
      return result(state, false, 'C_NEEDS_INTENSITY', ['intensity', 'behavior']);
    }
    if (!matchesAny(combined, BEHAVIOR_PATTERNS)) {
      return result(state, false, 'C_NEEDS_BEHAVIOR', ['behavior']);
    }
    return result(state, true, 'READY_STEP_D');
  }

  if (state === 'STEP_D') {
    const draft = normalizeText(context.D);
    const combined = options.controlIntent === 'advance'
      ? draft
      : draft && draft.includes(text)
        ? draft
        : `${draft} ${text}`.trim();
    const uniqueTerms = new Set(normalizeText(combined).split(' ').filter(term => term.length > 2));
    const hasDisputation = combined.length >= 25
      && uniqueTerms.size >= 6
      && matchesAny(combined, DISPUTATION_PATTERNS);
    if (options.controlIntent === 'advance') {
      return hasDisputation
        ? result(state, true, 'READY_STEP_E')
        : result(state, false, 'D_NEEDS_USER_DISPUTATION', ['learner_generated_disputation']);
    }
    return result(state, false, 'D_CONTINUE', hasDisputation ? [] : ['learner_generated_disputation']);
  }

  const draft = normalizeText(context.E);
  const combined = draft && draft.includes(text) ? draft : `${draft} ${text}`.trim();
  if (!hasIntensity(combined)) {
    return result(state, false, 'E_NEEDS_NEW_INTENSITY', ['new_intensity', 'new_perspective', 'action']);
  }
  if (!matchesAny(combined, PERSPECTIVE_PATTERNS)) {
    return result(state, false, 'E_NEEDS_PERSPECTIVE', ['new_perspective', 'action']);
  }
  if (!matchesAny(combined, ACTION_PATTERNS)) {
    return result(state, false, 'E_NEEDS_ACTION', ['action']);
  }
  return result(state, true, 'READY_SUBMIT');
}

function countQuestions(text) {
  return (normalizeText(text).match(/\?/g) || []).length;
}

function enforceSocraticReply(reply, fallbackQuestion) {
  const text = normalizeText(reply)
    .replace(/\[(?:NEXT_STATE|STATE):[^\]]+\]/gi, '')
    .replace(/\?+/g, '?')
    .trim();
  const question = normalizeText(fallbackQuestion) || FALLBACK_QUESTIONS.D_CONTINUE;
  if (!text) return question;

  const sentences = text.match(/[^.!?]+[.!?]?/g) || [];
  const reflection = sentences.find(sentence => !sentence.includes('?'));
  const firstQuestion = sentences.find(sentence => sentence.includes('?'));
  const candidateQuestion = normalizeText(firstQuestion || question).replace(/\?+$/g, '');
  const safeQuestion = matchesAny(candidateQuestion, LEADING_QUESTION_PATTERNS)
    ? question.replace(/\?+$/g, '') + '?'
    : candidateQuestion + '?';

  if (!reflection) return safeQuestion;
  const safeReflection = normalizeText(reflection).replace(/[?]+/g, '').replace(/([.!])?$/, '.');
  if (matchesAny(safeReflection, UNSAFE_ADVICE_PATTERNS)) return safeQuestion;
  return `${safeReflection} ${safeQuestion}`;
}

function isValidState(value) {
  return STATES.includes(value);
}

function stagePrompt(assessment) {
  const state = assessment.state;
  const rules = {
    STEP_A: 'Tách dữ kiện quan sát được khỏi nhãn, từ tuyệt đối và suy diễn ý định. Chỉ hoàn tất A khi có sự kiện cụ thể, trung tính.',
    STEP_B: 'Giúp người học nói nguyên văn niềm tin tự động ở ngôi thứ nhất. Không gán niềm tin thay họ.',
    STEP_C: 'Làm rõ cảm xúc, cường độ 0-10 và hành vi; nối hệ quả với niềm tin B.',
    STEP_D: 'Chọn đúng một lăng kính: Evidence, Alternatives, Implications hoặc Utility. Không nhận toàn văn kho tri thức và không đưa đáp án.',
    STEP_E: 'Làm rõ cường độ mới, góc nhìn mới và một hành động cụ thể trước khi hoàn tất.'
  };
  return [
    `Trạng thái hiện tại: ${state}.`,
    rules[state],
    `Đánh giá tất định: ${assessment.assessmentCode}.`,
    `stageComplete bắt buộc là ${assessment.stageComplete}.`,
    `nextState bắt buộc là ${assessment.nextState}.`,
    'Phản chiếu tối đa một câu rồi đặt đúng một câu hỏi mở. Không trả lời hộ, không hỏi dồn, không phán xét.'
  ].join('\n');
}

module.exports = {
  STATES,
  NEXT_STATE,
  STAGE_LETTER,
  assessStage,
  containsPromptInjection,
  countQuestions,
  enforceSocraticReply,
  isValidState,
  normalizeText,
  stagePrompt
};
