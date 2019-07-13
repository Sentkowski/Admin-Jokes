import React, { useContext } from 'react';
import { ModalOpenContext } from "./ModalDetector";

export default function Author() {
    const focusable = useContext(ModalOpenContext).focus;
    return (
        <footer className="author-footer">
            <p className="author-footer__text">Created by <a tabIndex={focusable} className="author-footer__link" href="https://github.com/Sentkowski">Szymon Sentkowski.</a></p>
            <p className="author-footer__text">Made possible thanks to two APIs: <a tabIndex={focusable} className="author-footer__link" href="https://icanhazdadjoke.com/api">icanhazdadjoke</a> and <a tabIndex={focusable} className="author-footer__link" href="https://randomuser.me/">randomuser</a>.</p>
        </footer>
    )
}