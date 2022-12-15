import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import styled from 'styled-components';

const StyledLoader = styled.div`
    top: calc(50% - 6px);
    right: 10px;
    position: absolute;
`;

function Loader({ onRefreshMultiplier }) {
    return (
        <StyledLoader>
            <CountdownCircleTimer
                size={25}
                strokeWidth={3}
                isPlaying
                duration={30}
                colors={['#C1B583', '#C1B583', '#C1B583', '#C1B583']}
                trailColor='black'
                colorsTime={[7, 5, 2, 0]}
                onComplete={() => {
                    onRefreshMultiplier();
                    return { shouldRepeat: true, delay: 2 };
                }}
            />
        </StyledLoader>
    );
}

export default Loader;
