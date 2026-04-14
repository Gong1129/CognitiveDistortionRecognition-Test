import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type SubmissionPayload = {
  participantId: string;
  version: 'A' | 'B';
  startedAt: string;
  submittedAt: string;
  elapsedMs: number;
  questionOrder: string[];
  responses: Array<{
    questionId: string;
    prompt: string;
    step1: string;
    step2: string[];
    step3: string;
  }>;
};

function isValidPayload(payload: unknown): payload is SubmissionPayload {
  if (!payload || typeof payload !== 'object') return false;
  const p = payload as SubmissionPayload;
  return (
    typeof p.participantId === 'string' &&
    (p.version === 'A' || p.version === 'B') &&
    typeof p.startedAt === 'string' &&
    typeof p.submittedAt === 'string' &&
    typeof p.elapsedMs === 'number' &&
    Array.isArray(p.questionOrder) &&
    Array.isArray(p.responses)
  );
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    if (!isValidPayload(payload)) {
      return NextResponse.json({ message: 'Invalid payload.' }, { status: 400 });
    }

    const saved = await prisma.surveySubmission.upsert({
      where: { participantCode: payload.participantId },
      update: {
        version: payload.version,
        startedAt: new Date(payload.startedAt),
        submittedAt: new Date(payload.submittedAt),
        elapsedMs: payload.elapsedMs,
        questionOrder: payload.questionOrder,
        responses: payload.responses,
      },
      create: {
        participantCode: payload.participantId,
        version: payload.version,
        startedAt: new Date(payload.startedAt),
        submittedAt: new Date(payload.submittedAt),
        elapsedMs: payload.elapsedMs,
        questionOrder: payload.questionOrder,
        responses: payload.responses,
      },
      select: {
        id: true,
        participantCode: true,
      },
    });

    return NextResponse.json({ ok: true, submissionId: saved.id, participantId: saved.participantCode });
  } catch (error) {
    console.error('submit error', error);
    return NextResponse.json({ message: 'Failed to save submission.' }, { status: 500 });
  }
}
