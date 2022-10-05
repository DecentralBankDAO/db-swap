import { useEffect, useState } from 'react';
import PageLayout from '../../layout/PageLayout';
import { useNearWallet } from 'react-near';
import Borrow from '../../burrow';
import { Alert, Snackbar } from '@mui/material';
import { useSelector } from 'react-redux';
import { isAssetsFetching } from '../../../redux/slices/Burrow/assetsSelectors';


function BurrowPage() {
    const [open, setOpen] = useState(false);
    const isFetching = useSelector(isAssetsFetching);

    useEffect(() => {
        if (isFetching) {
            setOpen(true);
        }
    }, [isFetching]);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    return (
        <PageLayout>
            <>
                <div className="text-center">
                    <>
                        <Borrow />
                        <Snackbar
                            open={open}
                            autoHideDuration={2000}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                        >
                            <Alert severity="info">Refreshing assets data...</Alert>
                        </Snackbar>
                    </>

                </div>
            </>
        </PageLayout>
    );
}

export default BurrowPage;
