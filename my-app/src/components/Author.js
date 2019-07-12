import React from 'react';

export default function Author() {
    return (
        <footer className="author-footer">
            <p className="author-footer__text">Created by <a  className="author-footer__link" href="https://github.com/Sentkowski">Szymon Sentkowski.</a></p>
            <p className="author-footer__text">Made possible thanks to two APIs: <a className="author-footer__link" href="https://icanhazdadjoke.com/api">icanhazdadjoke</a> and <a className="author-footer__link" href="https://randomuser.me/">randomuser</a>.</p>
        </footer>
    )
}