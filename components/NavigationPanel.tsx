import { LinkIcon } from '@heroicons/react/outline'
import { ChatIcon } from '@heroicons/react/outline'
import { ArrowSmRightIcon } from '@heroicons/react/solid'
import useXmtp from '../hooks/useXmtp'
import ConversationsList from './ConversationsList'
import Loader from './Loader'

import { useEffect, useState } from "react";
import { DEMO_ADDRESS, CYBERCONNECT_ENDPOINT } from "./CyberConnect/constants";
import { GraphQLClient, gql } from "graphql-request";
import { Connection } from '@cyberlab/cyberconnect/lib/types'

import MyListbox from './CyberConnect/MyListbox'

// Initialize the GraphQL Client
const gqlClient = new GraphQLClient(CYBERCONNECT_ENDPOINT);

// You can add/remove fields in query
const GET_CONNECTIONS = gql`
query($fromAddr: String!, $toAddrList: [String!]!) {
  connections(
    fromAddr: $fromAddr,
    toAddrList: $toAddrList
  ) {
    fromAddr
    toAddr
    followStatus {
      isFollowed
      isFollowing
    }
  }
}
`;

type NavigationPanelProps = {
  onConnect: () => Promise<void>,
  hide: boolean,
}

type ConnectButtonProps = {
  onConnect: () => Promise<void>
}

type Connections = {
  address: string
}

const NavigationPanel = ({ onConnect, hide }: NavigationPanelProps): JSX.Element => {
  const { walletAddress } = useXmtp()

  return (
    <div className="flex-grow flex flex-col">
      {walletAddress ? (
        <ConversationsPanel
          hide={hide}
          walletAddress={walletAddress}
        />
      ) : (
        <NoWalletConnectedMessage>
          <ConnectButton onConnect={onConnect} />
        </NoWalletConnectedMessage>
      )}
    </div>
  )
}

const NoWalletConnectedMessage: React.FC = ({ children }) => {
  return (
    <div className="flex flex-col flex-grow justify-center">
      <div className="flex flex-col items-center px-4 text-center">
        <LinkIcon
          className="h-8 w-8 mb-1 stroke-n-200 md:stroke-n-300"
          aria-hidden="true"
        />
        <p className="text-xl md:text-lg text-n-200 md:text-n-300 font-bold">
          No wallet connected
        </p>
        <p className="text-lx md:text-md text-n-200 font-normal">
          Please connect a wallet to begin
        </p>
      </div>
      {children}
    </div>
  )
}

const ConnectButton = ({ onConnect }: ConnectButtonProps): JSX.Element => {
  return (
    <button
      onClick={onConnect}
      className="rounded border border-l-300 mx-auto my-4 text-l-300 hover:text-white hover:bg-l-400 hover:border-l-400 hover:fill-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-n-100 focus-visible:outline-none active:bg-l-500 active:border-l-500 active:text-l-100 active:ring-0"
    >
      <div className="flex items-center justify-center text-xs font-semibold px-4 py-1">
        Connect your wallet
        <ArrowSmRightIcon className="h-4" />
      </div>
    </button>
  )
}

const ConversationsPanel = ({ hide, walletAddress }: { hide: boolean, walletAddress: string }): JSX.Element => {
  const { conversations, loadingConversations, client } = useXmtp()
  const [ followings, setFollowings ] = useState<any>([]);

  const [ filterMode, setFilterMode ] = useState<number>(0)
  const [ isVerified, setIsVerified ] = useState<any>()

  console.log('filterMode', filterMode)
  const peers = conversations.map(x => x.peerAddress);

  useEffect(() => {
    gqlClient
      .request(GET_CONNECTIONS, {
        fromAddr: walletAddress,
        toAddrList: peers
      })
      .then((res) => {
        console.log('query result', res)

        let temp: any = {}
        res.connections.forEach( ( connection: any ) => {
          const { toAddr, followStatus } = connection
          const { isFollowed, isFollowing } = followStatus
          temp[toAddr] = (2 * isFollowed + isFollowing) === filterMode
        })
        console.log('isVerified', temp)
        setIsVerified(temp)

        // const rtn = res?.identity?.followings?.list;
        // const addresses = rtn.map((x: any) => x.address);
        // setFollowings(addresses);
        // console.log('rtn', rtn);
        // console.log('followings', followings);
      })
      .catch(console.log)
  }, [filterMode]);

  console.log('isVerified', isVerified)
  console.log('followings', followings);

  let filtered = conversations;
  if (filterMode) {

    filtered = conversations.filter(
      conversation => isVerified[conversation.peerAddress.toLowerCase()]
    );
  }
  // console.log('hide', hide);
  // console.log('peers', peers);
  // console.log('conversations', conversations);
  // console.log('filtered', filtered);

  if (!client) {
    return (
      <Loader
        headingText="Awaiting signatures..."
        subHeadingText="Use your wallet to sign"
        isLoading
      />
    )
  }
  if (loadingConversations) {
    return (
      <Loader
        headingText="Loading conversations..."
        subHeadingText="Please wait a moment"
        isLoading
      />
    )
  }

  const rtn = filtered && filtered.length > 0 ? (
    <nav className="flex-1 pb-4 space-y-1">
      <ConversationsList conversations={filtered} />
    </nav>
  ) : (
    <NoConversationsMessage />
  )

  return (
    <div>
      <MyListbox
        setFilterMode={setFilterMode}
      />
      {rtn}
    </div>
  )
}

const NoConversationsMessage = (): JSX.Element => {
  return (
    <div className="flex flex-col flex-grow justify-center">
      <div className="flex flex-col items-center px-4 text-center">
        <ChatIcon
          className="h-8 w-8 mb-1 stroke-n-200 md:stroke-n-300"
          aria-hidden="true"
        />
        <p className="text-xl md:text-lg text-n-200 md:text-n-300 font-bold">
          Your message list is empty
        </p>
        <p className="text-lx md:text-md text-n-200 font-normal">
          There are no messages in this wallet
        </p>
      </div>
    </div>
  )
}

export default NavigationPanel
