import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function getAssignedVersion(requestedVersion: unknown): 'A' | 'B' {
  if (requestedVersion === 'A' || requestedVersion === 'B') return requestedVersion;
  return Math.random() < 0.5 ? 'A' : 'B';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const version = getAssignedVersion(body?.requestedVersion);

    const counter = await prisma.counter.upsert({
      where: { key: 'participant' },
      update: { value: { increment: 1 } },
      create: { key: 'participant', value: 1 },
    });

    const participantId = `P${String(counter.value).padStart(4, '0')}`;

    return NextResponse.json({
      participantId,
      version,
      startedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('session/start error', error);
    return NextResponse.json({ message: 'Unable to initialize session.' }, { status: 500 });
  }
}
