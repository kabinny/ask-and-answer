// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// 스크린샷 참고 포스트: https://ndo.dev/posts/link-screenshot
// 사용 패키지: playwright-core, chrome-aws-lambda@6 (6이후 버전은 용량이 너무 크다)
// 에러가 나서 추가 패키지: npx playwright install

import chromium from 'chrome-aws-lambda';
import playwright from 'playwright-core';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const localChromePath = process.env.NODE_ENV !== 'development' ? '' : process.env.LOCAL_CHROME_PATH ?? '';
  if (process.env.NODE_ENV !== 'development') {
    const protocol = process.env.PROTOCOL || 'http';
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || '3000';
    const baseUrl = `${protocol}://${host}:${port}`;
    await chromium.font(`${baseUrl}/Pretendard-Regular.ttf`);
  }

  const browser = await playwright.chromium.launch({
    args: chromium.args,
    executablePath: process.env.NODE_ENV !== 'development' ? await chromium.executablePath : localChromePath,
    headless: process.env.NODE_ENV !== 'development' ? chromium.headless : true,
  });

  // viewport는 트위터 사이즈
  const page = await browser.newPage({
    viewport: {
      width: 1200,
      height: 675,
    },
  });

  const url = req.query.url as string;

  await page.goto(url);

  const data = await page.screenshot({
    type: 'jpeg',
  });

  await browser.close();

  res.setHeader('Cache-Control', 's-maxage=31536000, public');
  res.setHeader('Content-Type', 'image/jpeg');
  res.end(data);
}
