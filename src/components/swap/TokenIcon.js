import DefaultTokenIcon from "../../assets/svg/DefaultTokenIcon";
import DefaultUsnIcon from "../../assets/svg/DefaultUsnIcon";

function isDataURL(s) {
    return !!s.match(isDataURL.regex);
}
isDataURL.regex = /^(data:)([\w\/\+-]*)(;charset=[\w-]+|;base64){0,1},(.*)/gi;

const USDTIcon = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='39' height='39'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle cx='16' cy='16' r='16' fill='%2326A17B'/%3E%3Cpath fill='%23FFF' d='M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117'/%3E%3C/g%3E%3C/svg%3E`


const TokenIcon = ({ symbol = 'Token', icon }) => {
    if (icon && isDataURL(icon) && symbol !== 'USN') {
        return <img src={icon} alt={symbol} width='39px' height='39px'/>;
        // return <DefaultUsnIcon/>;
    } else if (symbol === 'USN') {
        return <DefaultUsnIcon/>;
    } else if (symbol === 'USDT.e') {
        return <img src={USDTIcon} alt='USDT.e'/>;
    } else {
        return <DefaultTokenIcon/>;
    } 
};

export default TokenIcon;