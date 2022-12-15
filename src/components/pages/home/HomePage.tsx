import PageLayout from '../../layout/PageLayout';
import { useNearWallet } from 'react-near';
import SwapContainerWrapper from '../../swap/SwapContainerWrapper';

function HomePage() {
    const { accountId } = useNearWallet()!.account();
   
  


    return (
        <PageLayout>
           {(geoInfo: string, isLoading: boolean) => (
                <>
                    <div className="text-center">
                        <>
                            <SwapContainerWrapper accountId={accountId} geoInfo={geoInfo} isLoading={isLoading}/>
                        </>
                    </div>
                </>
            )}
        </PageLayout>
    );
}

export default HomePage;
