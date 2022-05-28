import { useState, useEffect } from 'react'

import CyberConnect, { Env, Blockchain } from "@cyberlab/cyberconnect";

type FollowButtonProps = {
  recipientWalletAddr: string,
  onSend: (msg: string) => Promise<void>
}

function FollowButton({ recipientWalletAddr, onSend }: FollowButtonProps) {
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
    // Prompt to enter the address
    const message = prompt("[OPTIONAL] Send connection request message:");

    if (message === null) {
      return <div />;
    }

    try {
      await cyberConnect.connect(recipientWalletAddr);

      if (message) {
        await onSend('CONNECTION REQUEST MESSAGE: ' + message)
      }

      alert(`Success: you're following ${recipientWalletAddr}!`);
    } catch (error) {
      alert('Already requested: ' + JSON.stringify(error))
    }
  };

  return (
    <button
      className="inline-flex items-center h-7 md:h-6 px-4 py-4 my-4 bg-p-400 border border-p-300 hover:bg-p-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-n-100 focus-visible:ring-offset-p-600 focus-visible:border-n-100 focus-visible:outline-none active:bg-p-500 active:border-p-500 active:ring-0 text-sm md:text-xs md:font-semibold tracking-wide text-white rounded"
      onClick={handleOnClick}
    >
      Follow
    </button>
  );
}

export default FollowButton;
