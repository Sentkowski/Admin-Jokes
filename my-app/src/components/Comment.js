import React, { useState, useEffect } from 'react';
import { giveRandom, capFirstLetter } from "../utilities.js";
import commentsTexts from '../comments.json';

export default function Comment(props) {
    const [comment, setComment] = useState(false);
    const [creationTime, setCreationTime] = useState(Date.now());
    const [commentText, setCommentText] = useState("");
    useEffect(() => {
        if (props.order === 2 && Math.random() > 0.5) {
            return undefined;
        }
        setCreationTime(Date.now());
        setTimeout(() => {
            setCommentText((props.isRight) ? commentsTexts.goodComments[giveRandom(0, commentsTexts.goodComments.length)] : commentsTexts.badComments[giveRandom(0, commentsTexts.badComments.length)]);
            setComment(props.randomUsers[props.order - 1]);
            props.setRandomUsers(props.randomUsers.slice(props.order));
            props.setCommentsCount({ ...props.commentsCount, [props.id]: props.order });
        }, Math.max(creationTime + 1000 + props.order * 500 - Date.now(), 0))
    }, []);
    return (!comment) ? (null) : (
        <>
            <li className="comment" key={comment.name.first + comment.name.last}>
                <img className="comment__photo" alt="Commenter's avatar." src={comment.picture.thumbnail} />
                <div className='comment__texts-container'>
                    <p className="comment__text">{commentText}</p>
                    <p className="comment__name">{capFirstLetter(comment.name.first)} {capFirstLetter(comment.name.last)}</p>
                </div>
            </li>
        </>
    )
}