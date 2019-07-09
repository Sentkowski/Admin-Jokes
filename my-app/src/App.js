import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.scss';
import avatarMedieval from './avatars/avatar_medieval.jpg';
import { WinMessageWithModal, LoseMessageWithModal } from "./components/GameOverMessages";
import Post from "./components/Post";
import AvatarSelectionWithModal from "./components/AvatarSelection";
import { Timer } from "./components/Timer";
import FunpageBar from "./components/FunpageBar";
import JokeOptions from "./components/JokeOptions";
import { ModalDetector } from "./components/ModalDetector";
import { shuffle, giveRandom } from "./utilities.js"

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
  const [notFinished, setNotFinished] = useState(true);

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
      <ModalDetector>
        <Timer gameStarted={gameStarted} progress={progress} setProgress={setProgress}>
          {showAvatarModal && <AvatarSelectionWithModal setHideState={setShowAvatarModal} setAvatar={setAvatar} avatar={avatar}/>}
          <FunpageBar avatar={avatar} setShowAvatarModal={setShowAvatarModal} followers={followers} gameStarted={gameStarted} history={history} />
          {(notFinished && (progress > 168 ||  followers >= 1000 )) && (followers >= 1000 ? (
            <WinMessageWithModal setHideState={setNotFinished} />
          ) : (
            <LoseMessageWithModal followers={followers} setHideState={setNotFinished} />))}
          <CSSTransition in={!gameStarted} unmountOnExit timeout={200} classNames="welcome-message">
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
      </ModalDetector>
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
          resolve(fetchJokes());
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
      <h2 className="instructions-message">Choose the right punchline to get followers – be quick!</h2>
  )
}

function WelcomeMessage(props) {
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
      <button onClick={() => props.startGame(true)} className="welcome-message__start-button">Let the joking begin</button>
    </section>
  )
}

export default App;
