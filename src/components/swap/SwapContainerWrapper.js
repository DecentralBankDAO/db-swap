import { useFungibleTokensIncludingNEAR } from "../../hooks/fungibleTokensIncludingNEAR";
import SwapAndSuccessContainer from "./SwapAndSuccessContainer";
import { useNearWallet } from "react-near";

const SwapContainerWrapper = () => {
    const wallet = useNearWallet();
    const { accountId } = wallet?.account();
    const fungibleTokensList = useFungibleTokensIncludingNEAR(accountId);

    return (
        <>
            <>
                <SwapAndSuccessContainer
                    fungibleTokensList={fungibleTokensList}
                    accountId={accountId}
                />
            </>
        </>
    );
};

export default SwapContainerWrapper;
