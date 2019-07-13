import React, { useState, useEffect, useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import CountUp from 'react-countup';
import Comment from "./Comment";
import { giveRandom, formatDate } from "../utilities.js";
import heartIcon from '../heart-black.svg';
import { TimeContext } from "./Timer"

export default function Post(props) {
    return (
        <CSSTransition key={props.title} in={true} timeout={400} classNames="post">
            <li className='post' key={props.title}>
                <div className="post__container">
                    <header className="post__header">
                        <img onClick={() => props.setShowAvatarModal(true)} src={props.avatar.img} className='post__avatar' alt={props.avatar.alt} />
                        <h2 className='post__title'>{props.title}</h2>
                        <Hashtags text={props.text} />
                    </header>
                    <p className='post__text'>{props.text}</p>
                    <ShowDate />
                    <div className="post__reactions">
                        <HeartsCounter isRight={props.isRight} />
                        <img src={heartIcon} className='post__heart-icon' alt="Icon of a heart." />
                        <CommentCounter commentsCount={props.commentsCount} id={props.id} />
                    </div>
                </div>
                <TransitionGroup className="post__comments-list" component='ul'>
                    <Comment id={props.id} isRight={props.isRight} randomUsers={props.randomUsers} setRandomUsers={props.setRandomUsers} commentsCount={props.commentsCount} setCommentsCount={props.setCommentsCount} order={1} />
                    <Comment id={props.id} isRight={props.isRight} randomUsers={props.randomUsers} setRandomUsers={props.setRandomUsers} commentsCount={props.commentsCount} setCommentsCount={props.setCommentsCount} order={2} />
                </TransitionGroup>
            </li>
        </CSSTransition>
    )
}

function HeartsCounter(props) {
    const [hearts, setHearts] = useState(0);
    useEffect(() => {
        setHearts((props.isRight) ? giveRandom(15, 50) : giveRandom(0, 7));
    }, [props.isRight]);
    return (
        <p className="post__hearts-counter"><CountUp duration={3} easingFn={function (t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        }} end={hearts} /></p>
    )
}

function CommentCounter(props) {
    if (props.id in props.commentsCount && props.commentsCount[props.id] > 1) {
        return <p className="post__comments-counter">{props.commentsCount[props.id]} comments</p>
    } else if (props.id in props.commentsCount) {
        return <p className="post__comments-counter">{props.commentsCount[props.id]} comment</p>
    } else {
        return <p className="post__comments-counter">no comments</p>
    }
}

function Hashtags(props) {
    const [hashtags, setHashtags] = useState([]);
    useEffect(() => {
        const twoLongestWords = props.text.match(/\w+/g).sort((a, b) => b.length - a.length).slice(0, 2);
        setHashtags(twoLongestWords.map(word => "#" + word.toLowerCase()).join(" "));
    }, [props.text]);
    return (
        <p className="post__hashtags">{hashtags}</p>
    )
}

function ShowDate() {
    const [datePublished] = useState(useContext(TimeContext).progress);
    const time = useContext(TimeContext).progress - datePublished;
    return (
        <p className='post__date'>{formatDate(time)}</p>
    )
}