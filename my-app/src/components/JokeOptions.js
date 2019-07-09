import React, { useState, useEffect, useContext } from 'react';
import { ModalOpenContext } from "./ModalDetector";
import { giveRandom } from "../utilities.js"

export default function JokeOptions(props) {
    const [jokesList, setJokes] = useState([]);
    const [chosenJoke, setChosenJoke] = useState(false);
    const [ready, setReady] = useState(false);
    const [renderedAt, setRenderedAt] = useState();
    const [transitionTime, setTransitionTime] = useState(Date.now());
    const [setup, setSetup] = useState(giveRandom(0, 5));

    useEffect(() => {
        setTimeout(() => {
            setSetup(giveRandom(0, 5));
            setJokes(props.jokesList.slice(0, 5));
            props.setJokesList(props.jokesList.slice(5));
            setReady(true);
            jokesMasonry(Array.from(document.querySelectorAll(".new-post__punchline")));
            setRenderedAt(Date.now());
        }, Math.max(transitionTime + 1000 - Date.now(), 0));
    }, [props.postID]);

    return (
        <section tabIndex={!useContext(ModalOpenContext).open ? -1 : null} className={ready ? "new-post" : "new-post new-post--hidden"}>
            {(jokesList.length > 1) &&
                <>
                    <p className="new-post__setup">{jokesList[setup].setup}</p>
                    <ul className="new-post__punchlines-list">
                        {jokesList.map((joke, i) => <Punchline key={joke.punchline} order={i} chosenJoke={chosenJoke} setChosenJoke={setChosenJoke} punchline={joke.punchline}/>)}
                    </ul>
                </>
            }
            <button className="new-post__add-post-button"
                    disabled={chosenJoke === false}
                    onClick={() => choosePunchline(chosenJoke)}
                    tabIndex={!useContext(ModalOpenContext).open ? 0 : -1}>
            +</button>
        </section>
    )

    function choosePunchline(num) {
        setChosenJoke(false);
        const timePassed = Date.now() - renderedAt;
        const isRight = (jokesList[setup] === jokesList[num]);
        props.adjustFollowers(isRight, timePassed);
        const newPost = {
            title: 'Joke #' + (props.postID + 1) + '!',
            text: jokesList[setup].setup + ' ' + jokesList[num].punchline,
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

    function jokesMasonry(elems) {
        let elemsLeft = elems.slice(0)
        const colWidth = document.querySelector(".new-post__punchlines-list").getBoundingClientRect().width;
        let counter = 0;
        let newOrder = [];
        while (elemsLeft.length > 0) {
            const newLine = createLine(elemsLeft, [], colWidth)[1];
            for (let i = 0; i < newLine.length; i++ , counter++) {
                newOrder.push(elems.indexOf(newLine[i]));
                elemsLeft = elemsLeft.filter(item => item !== newLine[i]);
            }
        }
        setJokes(newOrder.map(i => props.jokesList.slice(0, 5)[i]));
        document.querySelector(".new-post").focus()
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
    }
    if (combinations.length === 0) {
        return [combined.reduce((acc, currEl) => acc + currEl.offsetWidth, 0), combined];
    } else {
        return [Math.max(...posWidths), combinations[posWidths.indexOf(Math.max(...posWidths))]];
    }
}

function Punchline(props) {
    const btnClass = "new-post__punchlines-button";
    const chosenBtnClass = "new-post__punchlines-button--chosen";

    return (
        <li className="new-post__punchline">
            <button  tabIndex={!useContext(ModalOpenContext).open ? 0 : -1}
                     className={props.chosenJoke === props.order ? btnClass + ' ' +  chosenBtnClass : btnClass}
                     onClick={() => props.setChosenJoke(props.order)}>{props.punchline}
            </button>
        </li>
    )
}