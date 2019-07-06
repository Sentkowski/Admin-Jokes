import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

function Modal(ModalBody, props) {

    const [modalState, setModalState] = useState(false);

    function hideModal(e = false) {
        if (e.type !== "keydown" || e.keyCode === 27) {
            setModalState(false);
        }
    }

    useEffect(() => {
        setModalState(true);
        document.addEventListener("keydown", hideModal, false);
        return () => {
            document.removeEventListener("keydown", hideModal, false)
        };
    }, []);

    function answerAfterExit() {
        if ("setHideState" in props) {
            props.setHideState(false);
        }
    }

    return (
        <>
            <CSSTransition in={modalState} unmountOnExit timeout={300} classNames={"modal__background-"}>
                <div onClick={hideModal} className="modal__background"></div>
            </CSSTransition>
            <CSSTransition in={modalState} onExited={answerAfterExit} unmountOnExit timeout={300} classNames={"modal-"}>
                <ModalBody setModalState={setModalState} {...props} />
            </CSSTransition >
        </>
    )
}


export default Modal;