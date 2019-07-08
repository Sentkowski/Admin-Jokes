import React, { useState, useEffect } from 'react';
import { shuffle } from "../utilities.js"

export default function JokeOptions(props) {
    const [jokesList, setJokes] = useState([]);
    const [jokesOrder, setJokesOrder] = useState([]);
    const [chosenJoke, setChosenJoke] = useState(false);
    const [ready, setReady] = useState(false);
    const [renderedAt, setRenderedAt] = useState();
    const [transitionTime, setTransitionTime] = useState(Date.now());

    useEffect(() => {
        setTimeout(() => {
            setJokesOrder(shuffle([0, 1, 2, 3, 4]));
            setJokes(props.jokesList.slice(0, 5));
            props.setJokesList(props.jokesList.slice(5));
            setReady(true);
            jokesMasonry(document.querySelectorAll(".new-post__punchline"));
            setRenderedAt(Date.now());
        }, Math.max(transitionTime + 1000 - Date.now(), 0));
    }, [props.postID]);

    return (
        <section className={ready ? "new-post" : "new-post new-post--hidden"}>
            {(jokesList.length > 1) &&
                <>
                    <p className="new-post__setup">{jokesList[0].setup}</p>
                    <ul tabIndex={-1} className="new-post__punchlines-list">
                        <li className="new-post__punchline">
                            <button className={chosenJoke === 0 ? "new-post__punchlines-button new-post__punchlines-button--chosen" : "new-post__punchlines-button"} onClick={() => setChosenJoke(0)}>{jokesList[jokesOrder[0]].punchline}</button>
                        </li>
                        <li className="new-post__punchline">
                            <button className={chosenJoke === 1 ? "new-post__punchlines-button new-post__punchlines-button--chosen" : "new-post__punchlines-button"} onClick={() => setChosenJoke(1)}>{jokesList[jokesOrder[1]].punchline}</button>
                        </li>
                        <li className="new-post__punchline">
                            <button className={chosenJoke === 2 ? "new-post__punchlines-button new-post__punchlines-button--chosen" : "new-post__punchlines-button"} onClick={() => setChosenJoke(2)}>{jokesList[jokesOrder[2]].punchline}</button>
                        </li>
                        <li className="new-post__punchline">
                            <button className={chosenJoke === 3 ? "new-post__punchlines-button new-post__punchlines-button--chosen" : "new-post__punchlines-button"} onClick={() => setChosenJoke(3)}>{jokesList[jokesOrder[3]].punchline}</button>
                        </li>
                        <li className="new-post__punchline">
                            <button className={chosenJoke === 4 ? "new-post__punchlines-button new-post__punchlines-button--chosen" : "new-post__punchlines-button"} onClick={() => setChosenJoke(4)}>{jokesList[jokesOrder[4]].punchline}</button>
                        </li>
                    </ul>
                </>
            }
            <button className="new-post__add-post-button" disabled={chosenJoke === false} onClick={() => choosePunchline(chosenJoke)}>+</button>
        </section>
    )

    function choosePunchline(num) {
        setChosenJoke(false);
        const timePassed = Date.now() - renderedAt;
        const isRight = (jokesList[0] === jokesList[jokesOrder[num]]);
        props.adjustFollowers(isRight, timePassed);
        const newPost = {
            title: 'Joke #' + (props.postID + 1) + '!',
            text: jokesList[0].setup + ' ' + jokesList[jokesOrder[num]].punchline,
            date: 'Just now',
            id: props.postID + 1,
            isRight: isRight,
        };
        props.addPost([newPost, ...props.postsList]);
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
        setReady(false);
        setTransitionTime(Date.now());
        props.setPostID(props.postID + 1);
    }
}

function jokesMasonry(elems) {
    if (document.querySelector(".new-post__punchlines-list")) {
        document.querySelector(".new-post__punchlines-list").focus();
        let elemsArr = Array.from(elems)
        const colWidth = document.querySelector(".new-post__punchlines-list").getBoundingClientRect().width;
        let counter = 0;
        while (elemsArr.length > 0) {
            const newLine = createLine(elemsArr, [], colWidth)[1];
            for (let i = 0; i < newLine.length; i++ , counter++) {
                newLine[i].style.order = counter;
                elemsArr = elemsArr.filter(item => item !== newLine[i])
            }
        }
        document.querySelector(".new-post__punchlines-list").focus();
    }
}

function createLine(allElems, combined, max) {
    let posWidths = [];
    let combinations = [];
    for (let otherEl of allElems) {
        if (combined.indexOf(otherEl) === -1) {
            const newComb = [...combined, otherEl]
            const newWidth = newComb.reduce((acc, currEl) => acc + currEl.getBoundingClientRect().width, 0);
            if (newWidth <= max) {
                const results = createLine(allElems, newComb, max);
                posWidths.push(results[0]);
                combinations.push(results[1]);
            } else if (newWidth === max) {
                return [newWidth, newComb];
            }
        }
    };
    if (combinations.length === 0) {
        return [combined.reduce((acc, currEl) => acc + currEl.offsetWidth, 0), combined];
    } else {
        return [Math.max(...posWidths), combinations[posWidths.indexOf(Math.max(...posWidths))]];
    }
}