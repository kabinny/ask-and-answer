// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import FirebaseAdmin from '@/models/firebase_admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uid, email, displayName, photoURL } = req.body;
  if (uid === undefined || uid === null) {
    return res.status(400).json({ result: false, message: 'uid가 누락되었습니다.' });
  }

  if (email === undefined || email === null) {
    return res.status(400).json({ result: false, message: 'email이 누락되었습니다.' });
  }

  try {
    // 유저 추가
    // 보여지는 이름은 uid처럼 읽을 수 없는 문자열이면 안되니까 스크린네임을 이메일에서 가져옴
    const screenName = (email as string).replace('@gmail.com', '');

    // transaction을 사용하면 여러 문서에 쓰기를 할 수 있다.
    const addResult = await FirebaseAdmin.getInstance().Firebase.runTransaction(async (transaction) => {
      const memberRef = FirebaseAdmin.getInstance().Firebase.collection('members').doc(uid);
      const screenNameRef = FirebaseAdmin.getInstance().Firebase.collection('screen_names').doc(screenName);
      const memberDoc = await transaction.get(memberRef);
      if (memberDoc.exists) {
        // 이미 추가된 상태
        return false;
      }
      const addData = {
        uid,
        email,
        displayName: displayName ?? '',
        photoURL: photoURL ?? '',
      };
      await transaction.set(memberRef, addData);
      await transaction.set(screenNameRef, addData);
      return true;
    });
    if (addResult === false) {
      return res.status(201).json({ result: true, id: uid });
    }
    return res.status(200).json({ result: true, id: uid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false });
  }
}
