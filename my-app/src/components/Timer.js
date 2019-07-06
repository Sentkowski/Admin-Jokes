import React, { useEffect } from 'react';

const TimeContext = React.createContext({ progress: 0 });

function Timer(props) {
    useEffect(() => {
        if (props.gameStarted) {
            const interval = setInterval(() => {
                props.setProgress(progress => progress + 1);
            }, 1000);
            return () => {
                clearInterval(interval);
            };
        }
    }, [props.gameStarted]);

    return (
        <TimeContext.Provider value={{ progress: props.progress }}>
            {props.children}
        </TimeContext.Provider>
    )
}

export { TimeContext, Timer };