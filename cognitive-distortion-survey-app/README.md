# 认知扭曲识别测验（可部署项目版）

这是一个可落地的 Next.js 全栈项目，包含：

- A/B 版题库
- 题目随机顺序
- 三步作答逻辑
- 后台自动生成被试编号
- 作答计时
- PostgreSQL 持久化保存
- JSON / CSV 数据导出接口

## 一、项目结构

- `app/page.tsx`：前端页面入口
- `components/survey-app.tsx`：问卷主界面和交互逻辑
- `app/api/session/start/route.ts`：初始化会话，自动生成被试编号
- `app/api/submit/route.ts`：保存问卷结果
- `app/api/export/route.ts`：导出 JSON 或 CSV
- `prisma/schema.prisma`：数据库模型
- `lib/question-bank.ts`：A/B 版题库与说明文本

## 二、环境变量

在项目根目录创建 `.env` 或 `.env.local`：

```bash
DATABASE_URL="postgres://..."
ADMIN_EXPORT_TOKEN="请换成一个复杂字符串"
```

## 三、本地运行

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

打开：

```bash
http://localhost:3000
```

## 四、导出数据

### 导出 JSON

```bash
http://localhost:3000/api/export?format=json&token=你的导出令牌
```

### 导出 CSV

```bash
http://localhost:3000/api/export?format=csv&token=你的导出令牌
```

CSV 采用“每个被试 × 每道题一行”的长表格式，便于后续统计分析。

## 五、部署建议

推荐：

- 前端 + API：Vercel
- 数据库：Prisma Postgres / Neon / Supabase Postgres

你也可以全部放在 Render，但当前项目已经按 Vercel 的 Next.js 全栈方式组织好了。
