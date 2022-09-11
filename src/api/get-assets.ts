import { getAllMetadata, getAssetsDetailed, getPrices } from "../store";

const getPrice = (tokenId: any, priceResponse: any, metadata: any) => {
  const price = priceResponse.prices.find((p: any) => p.asset_id === tokenId)?.price || undefined;
  if (!price) return 0;
  const usd = Number(price.multiplier) / 10 ** (price.decimals - metadata.decimals);
  return { ...price, usd };
};

const getAssets = async (wallet: any) => {
  const assets = await getAssetsDetailed(wallet);
  const tokenIds = assets.map((asset) => asset.token_id);
  const metadata = await getAllMetadata(tokenIds, wallet);
  const priceResponse = await getPrices(wallet);

  return {
    assets: assets.map((asset) => ({
      ...asset,
      price: getPrice(
        asset.token_id,
        priceResponse,
        metadata.find((m) => m.token_id === asset.token_id),
      ),
    })),
    metadata,
  };
};

export default getAssets;
