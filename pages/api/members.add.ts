// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import MemberCtrl from '@/controllers/member.crtl';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const supportMethod = ['POST'];
  try {
    if (supportMethod.indexOf(method) === -1) {
      // 에러 반환
    }
    await MemberCtrl.add(req, res);
  } catch (error) {
    console.error(error);
    // 에러 처리
  }
}
