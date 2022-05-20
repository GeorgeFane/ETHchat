import CyberConnect, { Env, Blockchain } from "@cyberlab/cyberconnect";

const cyberConnect = new CyberConnect({
  namespace: "CyberConnect",
  env: Env.PRODUCTION,
  chain: Blockchain.ETH,
  provider: window.ethereum
});

function FollowButton() {
  const handleOnClick = async () => {
    // Prompt to enter the address
    const address = prompt("Enter the ens/address to follow:");

    if (!address) {
      return <div />;
    }

    try {
      await cyberConnect.connect(address);
      alert(`Success: you're following ${address}!`);
    } catch (error) {
      let errorMessage;
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log(errorMessage);
    }
  };

  return (
    <button
      // className="followButton"
      className='block rounded-md px-2 py-2 text-sm text-n-600 text-right font-normal cursor-pointer'
      onClick={handleOnClick}
    >
      Follow address
    </button>
  );
}

export default FollowButton;