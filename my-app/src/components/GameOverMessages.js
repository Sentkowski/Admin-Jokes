import React, { useState, useEffect, useRef, useContext } from 'react';
import Modal from "./Modal";
import { formatDate } from "../utilities";
import { TimeContext } from "./Timer"

function WinMessageWithModal(props) {
    if (useContext(TimeContext).progress <= 168) {
        return Modal(WinMessage, props)
    }
    return null;
}

function LoseMessageWithModal(props) {
    if (props.followers < 1000) {
        return Modal(LoseMessage, props);
    }
    return null;
}

function LoseMessage(props) {
    const [followersAtLose, setFollowersAtLose] = useState(0);
    useEffect(() => {
        setFollowersAtLose(props.followers);
    }, []);
    return (
        <GameOverMessage setModalState={props.setModalState}>
            <h2 className="game-over-message__heading">Oh no, it's been a week already and you lack <span className="game-over-message__important">{1000 - followersAtLose} followers</span>!</h2>
            <p className="game-over-message__text">You didn't meet the requirements, but feel free to keep improving your joking skills here. We leave the funpage to you.</p>
        </GameOverMessage>
    )
}

function WinMessage(props) {
    const progress = useContext(TimeContext).progress
    const [progressAtWin, setProgressAtWin] = useState(0);
    useEffect(() => {
        setProgressAtWin(progress);
    }, []);
    return (
        <GameOverMessage setModalState={props.setModalState}>
            <h2 className="game-over-message__heading">Whoa, you've reached the goal in <span className="game-over-message__important">{formatDate(progressAtWin).substring(0, formatDate(progressAtWin).length - 4)}</span>!</h2>
            <p className="game-over-message__text">Congratulations, you've assured us that we leave the funpage in good hands. It's all yours – you're the perfect admin we were looking for.</p>
        </GameOverMessage>
    )
}

function GameOverMessage(props) {

    const modal = useRef(null);
    useEffect(() => {
        modal.current.focus();
    }, []);

    return (
        <section ref={modal} tabIndex={-1} className="game-over-message">
            {props.children}
            <p className="game-over-message__text">Thank you for playing!</p>
            <ContactInfo />
            <button className="game-over-message__close-button" onClick={() => props.setModalState(false)}>Close</button>
        </section>
    )
}

function ContactInfo() {
    return (
        <>
            <p className="game-over-message__contact-text">If you would like to take a look into this project's code – the github is <a href="https://github.com/Sentkowski/Admin-Jokes">here</a>. Code review is more than welcome.</p>
            <p className="game-over-message__contact-text">In case you would like to reach out to me to share your thoughts, mail me at <a href="mailto:szymon.sew.sentkowski@gmail.com">szymon.sew.sentkowski@gmail.com</a></p>
        </>
    )
}

export { WinMessageWithModal, LoseMessageWithModal };