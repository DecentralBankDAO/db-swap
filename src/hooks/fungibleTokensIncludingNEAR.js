import { useNearWallet } from "react-near";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { selectMetadataSlice } from "../redux/slices/near";
import { selectTokensWithMetadataForAccountId } from "../redux/slices/tokens";



export const useFungibleTokensIncludingNEAR = function (accountId) {
    const nearbalanceAvailable = createSelector(
        [selectMetadataSlice],
        (balanceAvailable) => ({
            balance: balanceAvailable || '',
            onChainFTMetadata: { symbol: 'NEAR', decimals: 24 },
            fiatValueMetadata: { usd : 15 },
        })
    );
    const NEARAsTokenWithMetadata = useSelector(nearbalanceAvailable);
    const fungibleTokens = useSelector((state) =>
        selectTokensWithMetadataForAccountId(state, { accountId })
    );

    return [NEARAsTokenWithMetadata, ...fungibleTokens];
};