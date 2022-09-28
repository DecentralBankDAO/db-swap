import PageLayout from '../../layout/PageLayout';
// import LoginButton from '../../login/LoginButton';
import { useNearWallet } from 'react-near';
import SwapContainerWrapper from '../../swap/SwapContainerWrapper';

function MintPage() {
    return (
        <PageLayout>
            <>
                <div className="text-center">
                    <>
                        <SwapContainerWrapper />
                    </>
                </div>
            </>
        </PageLayout>
    );
}

export default MintPage;
