import React, {  useState } from 'react';

const ModalOpenContext = React.createContext({});

function ModalDetector(props) {
    const [modalOpen, setModalOpen] = useState(false);


    return (
        <ModalOpenContext.Provider value={{ open: modalOpen, setModalOpen: setModalOpen }}>
            {props.children}
        </ModalOpenContext.Provider>
    )
}

export { ModalOpenContext, ModalDetector };