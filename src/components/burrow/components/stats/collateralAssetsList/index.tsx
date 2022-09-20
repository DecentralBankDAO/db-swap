import { Box } from '@mui/material'
import { suppliedColumns } from "./tabledata";

import { usePortfolioAssets } from '../../../hooks/usePortfolioAssets';
import Table from '../../Table';
import { useTableSorting } from '../../../hooks/useTableSorting';


const CollateralAssetsList = () => {
    const [suppliedRows] = usePortfolioAssets();
    const { sorting, setSorting } = useTableSorting();

    return (
        <>
            <Box
                textAlign="center"
                fontWeight={600}
                color="white"
                mt="15px"
            >
                Assets use as Collateral
            </Box>
            <Table
                rows={suppliedRows}
                columns={suppliedColumns}
                sx={{ maxWidth: "800px", width: "none" }}
                sorting={{ name: "portfolioDeposited", ...sorting.portfolioDeposited, setSorting }}
            />
        </>
    )
}

export default CollateralAssetsList;