import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '认知扭曲识别测验',
  description: 'A/B 版认知扭曲识别问卷网页',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
