import FirebaseAdmin from '../firebase_admin';
import { InAuthUser } from '../in_auth_user';

const MEMBER_COL = 'member';
const SCR_NAME_COL = 'screen_names';

type AddResult = { result: true; id: string } | { result: false; message: string };

async function add({ uid, email, displayName, photoURL }: InAuthUser): Promise<AddResult> {
  try {
    // 유저 추가
    // 보여지는 이름은 uid처럼 읽을 수 없는 문자열이면 안되니까 스크린네임을 이메일에서 가져옴
    const screenName = (email as string).replace('@gmail.com', '');

    // transaction을 사용하면 여러 문서에 쓰기를 할 수 있다.
    const addResult = await FirebaseAdmin.getInstance().Firebase.runTransaction(async (transaction) => {
      const memberRef = FirebaseAdmin.getInstance().Firebase.collection(MEMBER_COL).doc(uid);
      const screenNameRef = FirebaseAdmin.getInstance().Firebase.collection(SCR_NAME_COL).doc(screenName);
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
      return { result: true, id: uid };
    }
    return { result: true, id: uid };
  } catch (error) {
    console.error(error);
    return { result: false, message: '서버 에러' };
  }
}

const MemberModel = {
  add,
};

export default MemberModel;
