import PageLayout from '../../layout/PageLayout';
import { useNearWallet } from 'react-near';
import Borrow from '../../burrow';

function BurrowPage() {
    return (
        <PageLayout>
            <>
                <div className="text-center">
                    <>
                        <Borrow />
                    </>
                </div>
            </>
        </PageLayout>
    );
}

export default BurrowPage;
