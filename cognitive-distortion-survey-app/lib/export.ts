import type { SurveySubmission } from '@prisma/client';

type StoredResponse = {
  questionId: string;
  prompt: string;
  step1: string;
  step2: string[];
  step3: string;
};

function escapeCsvCell(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function submissionsToCsv(submissions: SurveySubmission[]): string {
  const header = [
    'participantCode',
    'version',
    'startedAt',
    'submittedAt',
    'elapsedMs',
    'questionId',
    'prompt',
    'step1',
    'step2',
    'step3',
    'questionOrder',
  ];

  const rows: string[] = [header.join(',')];

  submissions.forEach((submission) => {
    const responses = (submission.responses as StoredResponse[]) || [];
    const questionOrder = JSON.stringify(submission.questionOrder);

    responses.forEach((response) => {
      const row = [
        submission.participantCode,
        submission.version,
        submission.startedAt.toISOString(),
        submission.submittedAt.toISOString(),
        String(submission.elapsedMs),
        response.questionId,
        response.prompt,
        response.step1,
        response.step2.join(' | '),
        response.step3,
        questionOrder,
      ].map((cell) => escapeCsvCell(String(cell)));

      rows.push(row.join(','));
    });
  });

  return rows.join('\n');
}
