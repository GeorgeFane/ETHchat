import { useState, useEffect } from 'react'

import CyberConnect, { Env, Blockchain } from "@cyberlab/cyberconnect";

type FollowButtonProps = {
  recipientWalletAddr: string,
}

function FollowButton({ recipientWalletAddr }: FollowButtonProps) {
  const [ cyberConnect, setCyberConnect ] = useState<any>()

  useEffect(() => {
    const temp = new CyberConnect({
      namespace: "CyberConnect",
      env: Env.PRODUCTION,
      chain: Blockchain.ETH,
      provider: window.ethereum
    });

    setCyberConnect(temp)
  }, [])

  const handleOnClick = async () => {
    try {
      await cyberConnect.disconnect(recipientWalletAddr);
      alert(`Success: you unfollowed ${recipientWalletAddr}!`);
    } catch (error) {
      alert('Not following: ' + JSON.stringify(error))
    }
  };

  return (
    <button
      className="inline-flex items-center h-7 md:h-6 px-4 py-4 my-4 bg-p-400 border border-p-300 hover:bg-p-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-n-100 focus-visible:ring-offset-p-600 focus-visible:border-n-100 focus-visible:outline-none active:bg-p-500 active:border-p-500 active:ring-0 text-sm md:text-xs md:font-semibold tracking-wide text-white rounded"
      onClick={handleOnClick}
    >
      Unfollow
    </button>
  );
}

export default FollowButton;
