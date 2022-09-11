import { Typography } from '@mui/material'
import { IData } from '.'
import { PreviewWrapper } from '../../style/styles'

interface StatsProps {
    data: IData[]
}

const Stats = ({ data }: StatsProps) => {
    return (
        <PreviewWrapper>
            {data.map(({ text, value }) => (
                <div key={text}>
                    <Typography
                        component='p'
                        fontSize='18px'
                        fontWeight={400}
                        color='hsla(0,0%,100%,.6)'
                        marginBottom='12px'
                    >
                        {text}
                    </Typography>
                    <Typography
                        component='p'
                        fontSize='30px'
                        fontWeight={700}
                        color='white'
                    >
                        {value}
                    </Typography>
                </div>
            ))}
        </PreviewWrapper>
    )
}

export default Stats