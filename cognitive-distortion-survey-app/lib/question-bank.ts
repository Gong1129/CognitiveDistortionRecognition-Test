export type DistortionType =
  | '非黑即白思维'
  | '读心术'
  | '以偏概全'
  | '灾难化'
  | '情绪化推理'
  | '贴标签';

export const DISTORTION_TYPES: DistortionType[] = [
  '非黑即白思维',
  '读心术',
  '以偏概全',
  '灾难化',
  '情绪化推理',
  '贴标签',
];

export type IntroItem = {
  title: DistortionType;
  description: string;
  thoughts: string[];
  cues: string[];
  example: string;
};

export const TYPE_INTRO: IntroItem[] = [
  {
    title: '非黑即白思维',
    description: '把事情看成两个极端，没有中间情况。',
    thoughts: ['要么很好，要么很糟', '不是成功，就是失败'],
    cues: ['完全', '彻底', '一定要最好', '如果不……就是失败'],
    example: '这次我不是第一名，就说明我很失败。',
  },
  {
    title: '读心术',
    description: '在没有足够证据时，直接认定别人怎么想你。',
    thoughts: ['他一定觉得我很烦', '她肯定看不起我'],
    cues: ['一定觉得', '肯定认为', '一定在笑我'],
    example: '他刚才没看我，他一定是不喜欢我。',
  },
  {
    title: '以偏概全',
    description: '因为一次或少数几次不好的经历，就觉得以后都会这样。',
    thoughts: ['我总是这样', '以后也不会好'],
    cues: ['总是', '每次都', '永远', '以后都……'],
    example: '这次面试失败了，说明我以后都找不到好工作。',
  },
  {
    title: '灾难化',
    description: '把事情往最糟的结果推，觉得后果一定会很严重。',
    thoughts: ['这下全完了', '事情一定会越来越糟'],
    cues: ['完了', '全毁了', '肯定会出大问题', '越来越糟'],
    example: '我这次讲错一句话，大家以后一定都会笑我。',
  },
  {
    title: '情绪化推理',
    description: '因为自己有某种感觉，就认定事实一定如此。',
    thoughts: ['我这么害怕，说明我一定做错了', '我觉得自己不行，那就说明我真的不行'],
    cues: ['我觉得……所以一定……', '我很害怕，说明……', '这证明……'],
    example: '我现在特别慌，说明我肯定做错了什么。',
  },
  {
    title: '贴标签',
    description: '根据一次事情，就给自己或别人下一个整体性的结论。',
    thoughts: ['我是个废物', '我就是一个失败的人'],
    cues: ['我就是……的人', '废物', '失败的人', '没用的人'],
    example: '我这题答错了，说明我就是个笨蛋。',
  },
];

export type SurveyQuestion = {
  id: string;
  prompt: string;
  step2Options: string[];
};

export const QUESTION_BANK: Record<'A' | 'B', SurveyQuestion[]> = {
  A: [
    {
      id: 'A1',
      prompt: `A classmate hasn't replied to my message in two hours. I immediately think: "He must find me annoying."`,
      step2Options: ['He must', 'find', 'me', 'annoying'],
    },
    {
      id: 'A2',
      prompt: `I stuttered during a speech. My first thought: "Oh no, I'll definitely become the whole class's laughingstock."`,
      step2Options: ["I'll", 'definitely become', "the whole class's", 'laughingstock'],
    },
    {
      id: 'A3',
      prompt: `I failed my math test. I think: "This means I'm no good at anything."`,
      step2Options: ['This means', "I'm", 'no good at', 'anything'],
    },
    {
      id: 'A4',
      prompt: `If I can't be the best this time, "that means I'm a complete failure."`,
      step2Options: ['that means', "I'm a", 'complete failure', 'failure'],
    },
    {
      id: 'A5',
      prompt: `I'm so nervous right now. "That means I definitely can't handle this competition."`,
      step2Options: ['That means', 'definitely', "can't handle", 'this competition'],
    },
    {
      id: 'A6',
      prompt: `I missed a line in my lab notes. I think: "I'm such a useless person."`,
      step2Options: ["I'm", 'such a', 'useless person'],
    },
    {
      id: 'A7',
      prompt: `My friend didn't invite me to the gathering. I think: "Looks like no one will want to hang out with me ever again."`,
      step2Options: ['Looks like', 'no one', 'will want to', 'hang out with me', 'ever again'],
    },
    {
      id: 'A8',
      prompt: `My teacher looked at me sternly. I think: "She must think I'm terrible."`,
      step2Options: ['She', 'must think', "I'm", 'terrible'],
    },
    {
      id: 'A9',
      prompt: `I didn't prepare well, so my performance was average. "I need to start earlier next time."`,
      step2Options: ['I need to', 'start earlier', 'next time'],
    },
    {
      id: 'A10',
      prompt: `I'm very sad right now, "but that doesn't mean things will stay this bad forever."`,
      step2Options: ["doesn't mean", 'stay this bad', 'forever'],
    },
  ],
  B: [
    {
      id: 'B1',
      prompt: `My roommate didn't look at me during the meeting. A thought pops into my head: "He must be angry with me."`,
      step2Options: ['He must', 'be', 'angry', 'with me'],
    },
    {
      id: 'B2',
      prompt: `My teacher asked me to revise my assignment. I immediately think: "Oh no, this will surely ruin the entire course."`,
      step2Options: ['Oh no', 'this will', 'surely ruin', 'the entire course'],
    },
    {
      id: 'B3',
      prompt: `After a failed job interview, I immediately think: "Looks like I'll never find a good job in the future."`,
      step2Options: ['Looks like', 'never', 'find a good job', 'in the future'],
    },
    {
      id: 'B4',
      prompt: `If I don't perform perfectly in this event, "that proves I'm totally unfit to be a leader."`,
      step2Options: ['that proves', "I'm", 'totally unfit', 'to be a leader'],
    },
    {
      id: 'B5',
      prompt: `I'm panicking. "This proves I must have done something terribly wrong."`,
      step2Options: ['This proves', 'must', 'have done something', 'terribly wrong'],
    },
    {
      id: 'B6',
      prompt: `I forgot to bring my materials. I berate myself: "I'm such an unreliable person."`,
      step2Options: ["I'm", 'such an', 'unreliable person'],
    },
    {
      id: 'B7',
      prompt: `We lost this round of the game. I immediately think: "Our team always drags everyone down."`,
      step2Options: ['Our team', 'always', 'drags', 'everyone', 'down'],
    },
    {
      id: 'B8',
      prompt: `My classmates whispered after I spoke. I immediately think: "They must be laughing at me."`,
      step2Options: ['They', 'must be', 'laughing at', 'me'],
    },
    {
      id: 'B9',
      prompt: `I'm not at my best today. "I'll rest a bit and keep going—this doesn't mean I'm incompetent."`,
      step2Options: ["I'll rest a bit", 'keep going', "doesn't mean", "I'm incompetent"],
    },
    {
      id: 'B10',
      prompt: `The result isn't ideal, "but I need more information to figure out the cause."`,
      step2Options: ['need more information', 'figure out the cause'],
    },
  ],
};

export function shuffleQuestions(version: 'A' | 'B'): SurveyQuestion[] {
  const copy = [...QUESTION_BANK[version]];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
