import React from 'react';

export default function WelcomeMessage(props) {
    return (
        <section className="welcome-message">
            <div className="welcome-message__container">
                <h2 className="welcome-message__heading">Welcome!</h2>
                <p className="welcome-message__text">This is your kingdom, Admin. We've set things up for you, but if you wish, you can change this avatar – tap on it. 🎯</p>
                <p className="welcome-message__text welcome-message__text--last">Remember the deal, right?</p>
            </div>
            <ul className="welcome-message__conditions-list">
                <li className="welcome-message__condition">
                    <p className="welcome-message__condition-text">Get us to 1000 followers and you're hired.</p>
                </li>
                <li className="welcome-message__condition">
                    <p className="welcome-message__condition-text">Guess what happens if you leave us with&nbsp;0...</p>
                </li>
                <li className="welcome-message__condition">
                    <p className="welcome-message__condition-text">You have ONE week.</p>
                </li>
            </ul>
            <ul></ul>
            <button onClick={() => props.setGameStarted(true)} className="welcome-message__start-button">Let the joking begin</button>
        </section>
    )
}