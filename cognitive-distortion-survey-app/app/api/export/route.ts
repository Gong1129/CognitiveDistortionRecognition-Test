import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { submissionsToCsv } from '@/lib/export';

function isAuthorized(request: NextRequest): boolean {
  const token = process.env.ADMIN_EXPORT_TOKEN;
  if (!token) return false;

  const urlToken = request.nextUrl.searchParams.get('token');
  const headerToken = request.headers.get('x-export-token');
  return urlToken === token || headerToken === token;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  const format = request.nextUrl.searchParams.get('format') || 'json';
  const submissions = await prisma.surveySubmission.findMany({
    orderBy: { createdAt: 'asc' },
  });

  if (format === 'csv') {
    const csv = submissionsToCsv(submissions);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="survey-submissions.csv"',
      },
    });
  }

  return NextResponse.json(
    submissions.map((item) => ({
      ...item,
      startedAt: item.startedAt.toISOString(),
      submittedAt: item.submittedAt.toISOString(),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    })),
  );
}
