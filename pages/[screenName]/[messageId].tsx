import { Avatar, Box, Text, Flex } from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { ServiceLayout } from '@/components/service_layout';
import { useAuth } from '@/context/auth_user.context';
import { InAuthUser } from '@/models/in_auth_user';
import MessageItem from '@/components/message_item';
import { InMessage } from '@/models/message/in_message';

interface Props {
  userInfo: InAuthUser | null;
  messageData: InMessage | null;
}

const MessagePage: NextPage<Props> = function ({ userInfo, messageData: initMsgData }) {
  const [messageData, setMessageData] = useState<null | InMessage>(initMsgData);
  const { authUser } = useAuth();

  async function fetchMessageInfo({ uid, messageId }: { uid: string; messageId: string }) {
    try {
      const resp = await fetch(`/api/messages.info?uid=${uid}&messageId=${messageId}`);
      if (resp.status === 200) {
        const data: InMessage = await resp.json();
        setMessageData(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (userInfo === null) {
    return <p>사용자를 찾을 수 없습니다.</p>;
  }

  if (messageData === null) {
    return <p>메세지 정보가 없습니다.</p>;
  }

  const isOwner = authUser !== null && authUser.uid === userInfo.uid;

  return (
    <ServiceLayout title={`${userInfo.displayName}의 홈`} minH="100vh" backgroundColor="gray.50">
      <Box maxW="md" mx="auto" pt="6">
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
          <Flex p="6">
            <Avatar size="lg" src={userInfo.photoURL ?? ''} mr="2" />
            <Flex direction="column" justify="center">
              <Text fontSize="md">{userInfo.displayName}</Text>
              <Text fontSize="xs">{userInfo.email}</Text>
            </Flex>
          </Flex>
        </Box>

        <MessageItem
          item={messageData}
          uid={userInfo.uid}
          displayName={userInfo.displayName ?? ''}
          photoURL={userInfo.photoURL ?? ''}
          isOwner={isOwner}
          onSendComplete={() => {
            fetchMessageInfo({ uid: userInfo.uid, messageId: messageData.id });
          }}
        />
      </Box>
    </ServiceLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const { screenName, messageId } = query;
  if (screenName === undefined) {
    return {
      props: {
        userInfo: null,
        messageData: null,
      },
    };
  }
  if (messageId === undefined) {
    return {
      props: {
        userInfo: null,
        messageData: null,
      },
    };
  }
  try {
    // server side 이기 때문에 fetch를 사용할 수 없고 '/' 주소를 모르기 때문에 baseurl 명시 필요
    const protocol = process.env.PROTOCOL || 'http';
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || '3000';
    const baseUrl = `${protocol}://${host}:${port}`;
    const userInfoResponse: AxiosResponse<InAuthUser> = await axios(`${baseUrl}/api/user.info/${screenName}`);

    if (
      userInfoResponse.status !== 200 ||
      userInfoResponse.data === undefined ||
      userInfoResponse.data.uid === undefined
    ) {
      return {
        props: {
          userInfo: null,
          messageData: null,
        },
      };
    }

    const messageInfoResponse: AxiosResponse<InMessage> = await axios(
      `${baseUrl}/api/messages.info?uid=${userInfoResponse.data.uid}&messageId=${messageId}`,
    );

    return {
      props: {
        userInfo: userInfoResponse.data,
        messageData:
          messageInfoResponse.status !== 200 || messageInfoResponse.data === undefined
            ? null
            : messageInfoResponse.data,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        userInfo: null,
        messageData: null,
      },
    };
  }
};

export default MessagePage;
