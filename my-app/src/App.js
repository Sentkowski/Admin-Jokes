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
import WelcomeMessage from "./components/WelcomeMessage";
import { shuffle, giveRandom } from "./utilities.js";

function App() {
  return (
    <Feed />
  );
}

function Feed() {
  const [progress, setProgress] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameNotFinished, setGameNotFinished] = useState(true);

  const [postID, setPostID] = useState(0);
  const [postsList, addPost] = useState([]);
  const [commentsCount, setCommentsCount] = useState({});
  const [followers, setFollowers] = useState(0);
  const [history, setHistory] = useState([0, 0, 0, 0, 0]);
  const [avatar, setAvatar] = useState(avatarMedieval);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // API related
  const [fetchingJokes, setFetchingJokes] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [jokesAPIPages, setJokesApiPages] = useState([giveRandom(0, 11)]);
  const [randomUsers, setRandomUsers] = useState([]);
  const [jokesList, setJokesList] = useState([]);

  useEffect(() => {
    if (jokesAPIPages.length < 2) {
      console.log(1)
      setJokesApiPages(shuffle(Array.from({length: 10}, (v, k) => k+1)));
    }
  })

  useEffect(() => {
    if (jokesList.length <= 10 && !fetchingJokes) {
      console.log(jokesAPIPages)
      setFetchingJokes(true);
      fetchJokes(jokesAPIPages.pop())
        .then(res => {
          setJokesList([...jokesList, ...res]);
          setFetchingJokes(false);
        })
        .catch(() => {
          const setupText = "Woops, looks like the API, I mean the creative process, failed this time. You can...";
          setJokesList([
            {setup: setupText, punchline: "Restart and hope for better luck."},
            {setup: setupText, punchline: "Blame the guy who made it."},
            {setup: setupText, punchline: "Let the guy who made it know that there is a problem! (recommended)."},
            {setup: setupText, punchline: "Choose this option and try to get followers..."},
            {setup: setupText, punchline: "Or choose this one. Each gives you 20% chance of being right!"}
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
          {showAvatarModal && <AvatarSelectionWithModal setHideState={setShowAvatarModal} setAvatar={setAvatar} currentAvatar={avatar}/>}
          <FunpageBar avatar={avatar} setShowAvatarModal={setShowAvatarModal} followers={followers} gameStarted={gameStarted} history={history} />
          {(gameNotFinished && (progress > 168 ||  followers >= 1000 )) && (followers >= 1000 ? (
            <WinMessageWithModal setHideState={setGameNotFinished} />
          ) : (
            <LoseMessageWithModal followers={followers} setHideState={setGameNotFinished} />))}
          <CSSTransition in={!gameStarted} unmountOnExit timeout={200} classNames="welcome-message">
            <WelcomeMessage setGameStarted={setGameStarted} />
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


function fetchJokes(page) {
  console.log(page)
  return new Promise ((resolve, reject) => {
    fetch(`https://icanhazdadjoke.com/search?page=${page}&limit=${giveRandom(40, 50)}`, {
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

export default App;
