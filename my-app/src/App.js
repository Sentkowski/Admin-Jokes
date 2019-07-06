import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import CountUp from 'react-countup';
import './App.scss';
import avatarMedieval from './avatars/avatar_medieval.jpg';
import heartIcon from './heart-black.svg';
import { WinMessageWithModal, LoseMessageWithModal } from "./components/GameOverMessages";
import Post from "./components/Post";
import AvatarSelectionWithModal from "./components/AvatarSelection";
import { Timer } from "./components/Timer";

function App() {
  return (
    <Feed />
  );
}

function Feed() {
  const [progress, setProgress] = useState(0);
  const [randomUsers, setRandomUsers] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [postID, setPostID] = useState(0);
  const [postsList, addPost] = useState([]);
  const [commentsCount, setCommentsCount] = useState({});
  const [followers, setFollowers] = useState(0);
  const [history, setHistory] = useState([0, 0, 0, 0, 0]);
  const [gameStarted, startGame] = useState(false);
  const [jokesList, setJokesList] = useState([]);
  const [fetchingJokes, setFetchingJokes] = useState(false);
  const [avatar, setAvatar] = useState(avatarMedieval);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    if (jokesList.length <= 10 && !fetchingJokes) {
      setFetchingJokes(true);
      fetchJokes()
        .then(res => {
          setJokesList([...jokesList, ...res]);
          setFetchingJokes(false);
        })
        .catch(() => {
          setJokesList([
            {setup: "Woops, looks like the API, I mean the creative process, failed this time. You can...", punchline: "Restart and hope for better luck."},
            {setup: "Woops, looks like the API, I mean the creative process, failed this time. You can...", punchline: "Blame the guy who made it."},
            {setup: "Woops, looks like the API, I mean the creative process, failed this time. You can...", punchline: "Let the guy who made it know that there is a problem! (recommended)."},
            {setup: "Woops, looks like the API, I mean the creative process, failed this time. You can...", punchline: "Choose this option and try to get followers..."},
            {setup: "Woops, looks like the API, I mean the creative process, failed this time. You can...", punchline: "Or choose this one. Each gives you 20% chance of being right!"}
          ]);
          setFetchingJokes(false);
        });
    }
  }, [jokesList]);

  useEffect(() => {
    if (randomUsers.length < 5 & !fetchingUsers) {
      setFetchingUsers(true);
      fetch(`https://randomuser.me/api/?inc=name,picture&nat=us,gb&results=30`)
      .then(res => res.json())
      .then(res => {
        setRandomUsers([...randomUsers, ...res.results]);
        setFetchingUsers(false);
      })
      .catch((e) => setFetchingUsers(false));
    }
  }, [randomUsers]);

  return (
    <main>
      <Timer gameStarted={gameStarted} progress={progress} setProgress={setProgress}>
        {showAvatarModal && <AvatarSelectionWithModal setHideState={setShowAvatarModal} setAvatar={setAvatar} avatar={avatar}/>}
        <FunpageBar progress={progress} avatar={avatar} setShowAvatarModal={setShowAvatarModal} followers={followers} gameStarted={gameStarted} history={history} />
        {(progress > 168 ||  followers > 100 ) && (followers > 100 ? <WinMessageWithModal progress={progress} /> : <LoseMessageWithModal followers={followers}/>)}
        <CSSTransition in={!gameStarted} timeout={200} classNames="welcome-message">
          <WelcomeMessage startGame={startGame} />
        </CSSTransition>
        {gameStarted && <>
          {!postsList.length && <InstructionsOnEmpty />}
          <TransitionGroup className="posts-list" component='ul'>
            {postsList.map(post => Post({...post, setCommentsCount, commentsCount, followers, randomUsers, setRandomUsers, avatar, setShowAvatarModal}))}
          </TransitionGroup>
          <JokeOptions jokesList={jokesList} setJokesList={setJokesList} postID={postID} setPostID={setPostID} postsList={postsList} addPost={addPost} adjustFollowers={adjustFollowers}/>
        </> }
      </Timer>
    </main>
  );

  function adjustFollowers(isRight, timePassed) {
    let newFollowers = Math.max(Math.round(100 - 0.005 * timePassed), 10);
    if (!isRight && newFollowers > followers) {
      newFollowers = followers;
    }
    if (isRight) {
      setFollowers(followers + newFollowers);
      setHistory([...history, newFollowers].splice(1,5));
    } else {
      setFollowers(followers - newFollowers);
      setHistory([...history, newFollowers * -1 ].splice(1,5));
    }
  }
}


function fetchJokes() {
  return new Promise ((resolve, reject) => {
    fetch(`https://icanhazdadjoke.com/search?page=${giveRandom(0, 10)}&limit=${giveRandom(40, 50)}`, {
      headers: {
        Accept: "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        if (!createJokesList(res.results)) {
          resolve(fetchJokes())
        } else {
          resolve(createJokesList(res.results));
        }
      })
      .catch(() => reject());
  })
}

function createJokesList(json) {
  let jokes = [];
  for (let joke of json) {
    let jokeSplit = joke.joke.match( /[^.!?]+[.!?]+/g );
    if (jokeSplit && jokeSplit.length === 2) {
      jokes.push({setup: jokeSplit[0], punchline: jokeSplit[1]});
    }
  }
  jokes = jokes.slice(0, Math.floor(jokes.length / 5) * 5)
  return (jokes.length >= 5) ? shuffle(jokes) : false;
}

function InstructionsOnEmpty() {
  return (
      <h2 className="instructions-message">Choose the right punchline to get followers!</h2>
  )
}

function FunpageBar(props) {
  return (
    <header className="funpage-bar">
      <img tabIndex={0} onKeyDown={(e) => {if(e.keyCode === 13) {props.setShowAvatarModal(true)}}} onClick={() => props.setShowAvatarModal(true)} src={props.avatar} className="funpage-bar__avatar" alt="Admin's page avatar." />
      <div className="funpage-bar__texts-container">
        <h1 className="funpage-bar__name">The funniest Funpage</h1>
        <div className="funpage-bar__bottom-container">
          <p className="funpage-bar__admin-note">Hello, Admin</p>
          <TrendingStatus history={props.history} />
          <p className="funpage-bar__followers-number">{props.gameStarted ? <CountUp duration={3} start={(props.followers >= 0) ? props.followers - props.history[4] : 0} end={props.followers} /> : props.followers}</p>
          <img src={heartIcon} className="funpage-bar__followers-icon" alt="Icon of a heart."/>
        </div>
      </div>
      <progress className="funpage-bar__time-progress" value={168 - props.progress} max="168"></progress>
    </header>
  )
}

function WelcomeMessage(props) {
  return (
    <section className="welcome-message">
      <div className="welcome-message__container">
        <h2 className="welcome-message__heading">Welcome!</h2>
        <p className="welcome-message__text">This is your kingdom. We've set things up for you, but if you wish, you can change this avatar – tap on it. 🎯</p>
        <p className="welcome-message__text welcome-message__text--last">Remember the deal, right?</p>
      </div>
      <ul className="welcome-message__conditions-list">
        <li className="welcome-message__condition">
          <p className="welcome-message__condition-text">Get us to 2000 followers and you're hired.</p>
        </li>
        <li className="welcome-message__condition">
          <p className="welcome-message__condition-text">Guess what happens if you leave us with&nbsp;0...</p>
        </li>
        <li className="welcome-message__condition">
          <p className="welcome-message__condition-text">You have ONE week.</p>
        </li>
      </ul>
      <ul></ul>
      <button onClick={() => props.startGame(true)} className="welcome-message__start-button">Let the joking begin</button>
    </section>
  )
}

function TrendingStatus(props) {
  const [status, setStatus] = useState({
    min: 101,
    max: 300,
    desc: "Trending!",
    class: 'funpage-bar__trending-note--good',
  });
  useEffect(() => {
    const balance = props.history.reduce((acc, val) => acc + val);
    const statusTable = [
      {
        min: -Infinity,
        max: -250,
        desc: "Going down!",
        class: 'very-bad',
        emoji: "😖",
      },
      {
        min: -249,
        max: -100,
        desc: "Losing followers",
        class: 'bad',
        emoji: "😧",
      },
      {
        min: -99,
        max: 100,
        desc: "",
        class: 'neutral',
        emoji: "",
      },
      {
        min: 101,
        max: 300,
        desc: "Trending!",
        class: 'good',
        emoji: "😂",
      },
      {
        min: 301,
        max: Infinity,
        desc: "Going viral!",
        class: 'very-good',
        emoji: "🤣",
      },
    ]
    for (let range of statusTable) {
      if (balance >= range.min && balance <= range.max) {
        setStatus(range);
      }
    }
  }, [props.history]);
  return (
    <>
      <p className={"funpage-bar__trending-note funpage-bar__trending-note--" + status.class}>
        <span className="funpage-bar__emoji">{status.emoji}</span> {status.desc}
      </p>
    </>
  )
}

function JokeOptions(props) {
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
      for (let i = 0; i < newLine.length; i++, counter++) {
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

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function giveRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export default App;
