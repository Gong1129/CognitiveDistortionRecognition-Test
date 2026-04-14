'use client';

import { useEffect, useMemo, useState } from 'react';
import { DISTORTION_TYPES, QUESTION_BANK, TYPE_INTRO, shuffleQuestions, type DistortionType, type SurveyQuestion } from '@/lib/question-bank';

type Step1Value = '' | 'yes' | 'no';

type QuestionResponse = {
  step1: Step1Value;
  step2: string[];
  step3: DistortionType | '';
};

const MAX_STEP2_SELECTIONS = 2;

function getVersionFromUrl(): 'A' | 'B' | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const v = params.get('version');
  return v === 'A' || v === 'B' ? v : null;
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function initialResponses(questions: SurveyQuestion[]): Record<string, QuestionResponse> {
  const result: Record<string, QuestionResponse> = {};
  questions.forEach((q) => {
    result[q.id] = { step1: '', step2: [], step3: '' };
  });
  return result;
}

function cls(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function SectionCard({ title, children, subtitle }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="card">
      <h2 className="section-title">{title}</h2>
      {subtitle ? <p className="muted body-copy">{subtitle}</p> : null}
      <div>{children}</div>
    </section>
  );
}

function IntroTable({ title, description, thoughts, cues, example }: (typeof TYPE_INTRO)[number]) {
  return (
    <div className="intro-card">
      <h3 className="intro-title">{title}</h3>
      <p className="body-copy">{description}</p>
      <div className="intro-grid">
        <div className="intro-grid-head">常见想法</div>
        <div className="intro-grid-head">常见线索词 / 词组</div>
        <div className="intro-grid-head">简短例子</div>
        <div className="intro-grid-cell">{thoughts.map((item) => <div key={item}>“{item}”</div>)}</div>
        <div className="intro-grid-cell">{cues.map((item) => <div key={item}>“{item}”</div>)}</div>
        <div className="intro-grid-cell">“{example}”</div>
      </div>
    </div>
  );
}

function OptionCard({ selected, children }: { selected: boolean; children: React.ReactNode }) {
  return <div className={cls('option-card', selected && 'selected')}>{children}</div>;
}

function QuestionView({
  question,
  index,
  total,
  response,
  onStep1,
  onStep2,
  onStep3,
}: {
  question: SurveyQuestion;
  index: number;
  total: number;
  response: QuestionResponse;
  onStep1: (questionId: string, value: Step1Value) => void;
  onStep2: (questionId: string, nextValues: string[]) => void;
  onStep3: (questionId: string, value: DistortionType) => void;
}) {
  const showStep2 = response.step1 === 'yes';
  const showStep3 = showStep2 && response.step2.length > 0;

  const toggleStep2 = (option: string) => {
    if (response.step2.includes(option)) {
      onStep2(question.id, response.step2.filter((item) => item !== option));
      return;
    }
    if (response.step2.length >= MAX_STEP2_SELECTIONS) return;
    onStep2(question.id, [...response.step2, option]);
  };

  return (
    <section className="card">
      <div className="question-header">
        <h3 className="question-title">题目 {index + 1}</h3>
        <span className="pill">{index + 1} / {total}</span>
      </div>
      <p className="question-prompt">{question.prompt}</p>

      <div className="step-block">
        <label className="step-label">第 1 步：这句话中是否存在明显的认知扭曲？</label>
        <div className="stack">
          {[
            { value: 'yes' as const, label: '有明显认知扭曲' },
            { value: 'no' as const, label: '没有明显认知扭曲' },
          ].map((item) => (
            <label key={item.value} className="selectable-row">
              <OptionCard selected={response.step1 === item.value}>
                <div className="input-row">
                  <input
                    type="radio"
                    name={`${question.id}-step1`}
                    checked={response.step1 === item.value}
                    onChange={() => onStep1(question.id, item.value)}
                    className="accent-input"
                  />
                  <span>{item.label}</span>
                </div>
              </OptionCard>
            </label>
          ))}
        </div>
      </div>

      {showStep2 ? (
        <div className="step-block">
          <label className="step-label">第 2 步：请选择 1–2 个最能体现该想法中认知扭曲的词或词组</label>
          <div className="option-grid">
            {question.step2Options.map((option) => {
              const checked = response.step2.includes(option);
              return (
                <label key={option} className="selectable-row">
                  <OptionCard selected={checked}>
                    <div className="input-row">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleStep2(option)}
                        className="accent-input"
                      />
                      <span>{option}</span>
                    </div>
                  </OptionCard>
                </label>
              );
            })}
          </div>
          <div className="helper-text">已选择 {response.step2.length} 项，最多可选 {MAX_STEP2_SELECTIONS} 项。</div>
        </div>
      ) : null}

      {showStep3 ? (
        <div className="step-block">
          <label className="step-label">第 3 步：请选择最符合的认知扭曲类型</label>
          <div className="option-grid two-columns">
            {DISTORTION_TYPES.map((type) => (
              <label key={type} className="selectable-row">
                <OptionCard selected={response.step3 === type}>
                  <div className="input-row">
                    <input
                      type="radio"
                      name={`${question.id}-step3`}
                      checked={response.step3 === type}
                      onChange={() => onStep3(question.id, type)}
                      className="accent-input"
                    />
                    <span>{type}</span>
                  </div>
                </OptionCard>
              </label>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function SurveyApp() {
  const [participantId, setParticipantId] = useState('');
  const [version, setVersion] = useState<'A' | 'B'>('A');
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [responses, setResponses] = useState<Record<string, QuestionResponse>>({});
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      const requestedVersion = getVersionFromUrl() ?? (Math.random() < 0.5 ? 'A' : 'B');
      const shuffled = shuffleQuestions(requestedVersion);
      if (!cancelled) {
        setVersion(requestedVersion);
        setQuestions(shuffled);
        setResponses(initialResponses(shuffled));
        setStartedAt(Date.now());
      }

      try {
        const res = await fetch('/api/session/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestedVersion }),
        });
        if (!res.ok) throw new Error('init failed');
        const data = await res.json();
        if (cancelled) return;
        setParticipantId(data.participantId || 'P0000');
        setVersion(data.version || requestedVersion);
        setPreviewMode(false);
      } catch {
        if (cancelled) return;
        setParticipantId(`LOCAL-${String(Date.now()).slice(-6)}`);
        setPreviewMode(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!startedAt || submitted) return;
    const timer = window.setInterval(() => {
      setElapsedMs(Date.now() - startedAt);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [startedAt, submitted]);

  const answeredStep1Count = useMemo(
    () => questions.filter((q) => responses[q.id]?.step1).length,
    [questions, responses],
  );

  const progressPct = questions.length === 0 ? 0 : (answeredStep1Count / questions.length) * 100;

  const updateStep1 = (questionId: string, value: Step1Value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        step1: value,
        step2: value === 'yes' ? prev[questionId]?.step2 || [] : [],
        step3: value === 'yes' ? prev[questionId]?.step3 || '' : '',
      },
    }));
  };

  const updateStep2 = (questionId: string, nextValues: string[]) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        step2: nextValues,
        step3: nextValues.length > 0 ? prev[questionId]?.step3 || '' : '',
      },
    }));
  };

  const updateStep3 = (questionId: string, value: DistortionType) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        step3: value,
      },
    }));
  };

  const validate = (): string => {
    for (const question of questions) {
      const response = responses[question.id];
      if (!response?.step1) return `请先完成题目 ${question.id} 的第 1 步。`;
      if (response.step1 === 'yes') {
        if (response.step2.length < 1 || response.step2.length > MAX_STEP2_SELECTIONS) {
          return `题目 ${question.id} 的第 2 步需要选择 1–2 项。`;
        }
        if (!response.step3) return `请完成题目 ${question.id} 的第 3 步。`;
      }
    }
    return '';
  };

  const handleSubmit = async () => {
    setError('');
    const validationMessage = validate();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const finalElapsedMs = startedAt ? Date.now() - startedAt : elapsedMs;
    const payload = {
      participantId,
      version,
      startedAt: startedAt ? new Date(startedAt).toISOString() : new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      elapsedMs: finalElapsedMs,
      questionOrder: questions.map((q) => q.id),
      responses: questions.map((q) => ({
        questionId: q.id,
        prompt: q.prompt,
        step1: responses[q.id]?.step1 || '',
        step2: responses[q.id]?.step2 || [],
        step3: responses[q.id]?.step3 || '',
      })),
    };

    try {
      setSubmitting(true);
      if (previewMode) {
        console.log('Preview mode submission payload:', payload);
        setElapsedMs(finalElapsedMs);
        setSubmitted(true);
        return;
      }

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('提交失败，请检查数据库连接或 API 设置。');
      setElapsedMs(finalElapsedMs);
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="page-shell">
        <section className="card center-card">
          <div className="loading-dot" />
          <p>正在初始化问卷…</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="card hero-card">
        <h1 className="page-title">认知扭曲识别测验（A/B 版）</h1>
        <p className="muted body-copy">网页正式版示例：带自动编号、计时、随机题序、后台保存与数据导出。</p>
        <div className="meta-grid">
          <div className="meta-box">
            <div className="meta-label">被试编号</div>
            <div className="meta-value">{participantId}</div>
            <div className="meta-note">{previewMode ? '预览模式：当前使用本地临时编号' : '由后台自动生成'}</div>
          </div>
          <div className="meta-box">
            <div className="meta-label">问卷版本</div>
            <div className="meta-value">{version}</div>
            <div className="meta-note">可通过 ?version=A 或 ?version=B 指定</div>
          </div>
          <div className="meta-box">
            <div className="meta-label">作答时长</div>
            <div className="meta-value">{formatElapsed(elapsedMs)}</div>
            <div className="meta-note">从进入问卷到提交为止</div>
          </div>
        </div>
      </section>

      <SectionCard title="一、测验说明">
        <p className="body-copy">本测验用于了解你在阅读案例时，识别想法中是否存在认知扭曲、识别相关线索，并对其进行初步分类的能力。</p>
        <p className="body-copy">本测验不用于临床诊断，也不会用于评估你本人认知扭曲的严重程度。请根据你对题目中人物内心想法的理解作答。</p>
      </SectionCard>

      <SectionCard title="二、作答方式">
        <p className="body-copy">每题都会先给出一个情境，以及情境中人物产生的一句内心想法。</p>
        <p className="body-copy">请先判断这句内心想法中是否存在明显的认知扭曲。如果存在，请继续勾选最能体现该想法中认知扭曲的词或词组，并判断它所属的认知扭曲类型。</p>
        <p className="body-copy">并不是所有负面想法都属于认知扭曲。若一个想法更符合事实、表达较客观，或只是正常的担心、难过、自我提醒，那么它不一定属于认知扭曲。</p>
        <div className="notice">
          答题提醒：第 1 步为单选；第 2 步为多选，每题最多可选 {MAX_STEP2_SELECTIONS} 项；第 3 步为单选。若第 1 步选择“没有明显认知扭曲”，则不会显示后续步骤。
          {previewMode ? ' 当前为预览模式，提交结果会输出到浏览器控制台。' : ''}
        </div>
      </SectionCard>

      <SectionCard title="三、认知扭曲类型简介" subtitle="以下内容用于帮助理解不同认知扭曲类型。表格中的“常见想法”和“常见线索词/词组”只是辅助线索，仍需结合具体语境判断。">
        <div className="stack large-gap">
          {TYPE_INTRO.map((item) => (
            <IntroTable key={item.title} {...item} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="四、答题示例">
        <p className="body-copy">例句：They must think I am weird and do not want to talk to me.</p>
        <p className="body-copy">在这个句子中，说话者在没有足够证据的情况下，直接假设了别人对自己的看法，因此存在明显的认知扭曲。它更接近“读心术”。</p>
        <div className="example-box">
          <div className="step-block">
            <label className="step-label">第 1 步</label>
            <OptionCard selected>
              <div className="input-row"><input type="radio" checked readOnly className="accent-input" /> <span>有明显认知扭曲</span></div>
            </OptionCard>
          </div>
          <div className="step-block">
            <label className="step-label">第 2 步</label>
            <div className="option-grid three-columns">
              <OptionCard selected><div className="input-row"><input type="checkbox" checked readOnly className="accent-input" /> <span>must think</span></div></OptionCard>
              <OptionCard selected><div className="input-row"><input type="checkbox" checked readOnly className="accent-input" /> <span>weird</span></div></OptionCard>
              <OptionCard selected={false}><div className="input-row"><input type="checkbox" readOnly className="accent-input" /> <span>do not want to talk</span></div></OptionCard>
            </div>
          </div>
          <div className="step-block">
            <label className="step-label">第 3 步</label>
            <div className="option-grid two-columns">
              {DISTORTION_TYPES.map((type) => (
                <OptionCard key={type} selected={type === '读心术'}>
                  <div className="input-row"><input type="radio" checked={type === '读心术'} readOnly className="accent-input" /> <span>{type}</span></div>
                </OptionCard>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="正式作答" subtitle="题目顺序已随机排列。请按页面顺序完成。">
        <div className="progress-row">
          <span className="muted">完成进度（按第 1 步计）</span>
          <span className="muted">{answeredStep1Count} / {questions.length}</span>
        </div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div>
      </SectionCard>

      {questions.map((question, index) => (
        <QuestionView
          key={question.id}
          question={question}
          index={index}
          total={questions.length}
          response={responses[question.id] || { step1: '', step2: [], step3: '' }}
          onStep1={updateStep1}
          onStep2={updateStep2}
          onStep3={updateStep3}
        />
      ))}

      <section className="card">
        {error ? <div className="error-box">{error}</div> : null}
        {submitted ? (
          <div className="success-box">提交成功。总作答时长：{formatElapsed(elapsedMs)}</div>
        ) : (
          <button type="button" className="submit-button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? '提交中…' : '提交问卷'}
          </button>
        )}
      </section>
    </main>
  );
}
