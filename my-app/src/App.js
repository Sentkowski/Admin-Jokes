import React, { useState, useEffect, useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import CountUp from 'react-countup';
import './App.scss';
import avatarMedieval from './avatars/avatar_medieval.jpg';
import avatarDog from './avatars/avatar_dog.jpg';
import avatarLenny from './avatars/avatar_lenny.png';
import avatarBoy from './avatars/avatar_boy.jpg';
import heartIcon from './heart-black.svg';

const TimeContext = React.createContext({ progress: 0 });

const GOOD_COMMENTS = [
  "Wow! Nice one.",
  "My kids gonna love that",
  "Hahsahah!",
  "XDDD",
  "cant wait to use it during a party",
  "looooooool",
  "lmao, need more",
  "admin, marry me hahah",
  "made my day",
  "can't stop laughing, help!!!",
  "You should write a book with all these jokes. :)",
  "If I could tag here, I would tag my whole family to make them see this gem",
  "why is this so funny? am i getting old?",
  "so good, mind if i steal it ? >_>",
  "im not even asking how you came up with this one ;p keep it up",
  "you deserve more hearts",
  "I would give you two hearts if I could :*",
  "im glad i found this funpage",
  "ahahaha :D",
  "Didn't see that coming!",
  "You should give stand-up courses!",
  "Always happy when a good joke pops up in my feed, thank you",
  "more more more more ples",
  "Pure gold.",
  "Admin should get a raise.",
  "been ages since I laughed so hard xD",
  "Quality stuff, hearted & bookmarked",
]

const BAD_COMMENTS = [
  "...?",
  "I don't get it.",
  "Care to explain?",
  "gibberish lol",
  "We want the real admin back.",
  "Can anyone explain?",
  "Hahaha. Oh, sry, wrong window.",
  "You must be fun at parties.",
  "Not the best one :/",
  "They should put an anti-heart button here.",
  "r u ok admin?",
  "Not good, not terrible.",
  "Even my dad is funnier than this XD",
  "looks like someone is going to lose followers ;) ;) ;)",
  "delete this",
  "srsly delete this",
  "Do you just copy-paste random sentences?",
  "This page used to be so much better...",
  "Can i report this spam somehow?",
  "fp got hacked :O",
  "? ? ? ? ? what",
  "mhm. very funny.",
  "Am i too stupid or what?",
  "Missclick I guess?",
  "Even a monkey with a typewriter and an infinity of time wouldnt write such a !*$%",
  "unfollow sry",
  "Quit the job.",
  "Consider taking a break. :)",
]

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
      <Timer progress={progress} setProgress={setProgress}>
        <AvatarModal showAvatarModal={showAvatarModal} setShowAvatarModal={setShowAvatarModal} setAvatar={setAvatar} avatar={avatar}/>
        <FunpageBar avatar={avatar} setShowAvatarModal={setShowAvatarModal} followers={followers} gameStarted={gameStarted} history={history} />
        <CSSTransition in={!gameStarted} timeout={200} classNames="welcome-message">
          <WelcomeMessage startGame={startGame} />
        </CSSTransition>
        {gameStarted && <>
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


function Timer(props) {
  useEffect(() => {
    const interval = setInterval(() => {
      props.setProgress(progress => progress + 1);
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [props]);

  return (
    <TimeContext.Provider value={{progress: props.progress}}>
      {props.children}
    </TimeContext.Provider>
  )
}

function AvatarModal(props) {

  const [loadingImage, setLoadingImage] = useState(false);

  function hideModal(e = false) {
    if (!loadingImage && (e.type !== "keydown" || e.keyCode === 27)) {
      props.setShowAvatarModal(false);
    }
  }

  function showImage(file) {
    setLoadingImage(true);
    let reader = new FileReader();
    reader.onload = function(){
      setLoadingImage(false);
      props.setAvatar(reader.result);
      hideModal();
    };
    reader.readAsDataURL(file);
  }

  function chooseAvatar(av) {
    props.setAvatar(av);
    hideModal();
  }

  useEffect(() => {
    document.addEventListener("keydown", hideModal, false);
    return () => {
      document.removeEventListener("keydown", hideModal, false)
    };
  });

  return (
    <>
      <CSSTransition in={props.showAvatarModal} timeout={300} unmountOnExit classNames={"avatar-modal__background-"}>
        <div onClick={hideModal} className="avatar-modal__background"></div>
      </CSSTransition>
      <CSSTransition in={props.showAvatarModal} timeout={300} unmountOnExit classNames={"avatar-modal-"}>
        <section tabIndex={-1} className="avatar-modal">
          <h2 className="avatar-modal__heading" >Pick your new avatar!</h2>
          <ul className="avatar-modal__avatars-list">
            <li className="avatar-modal__avatar">
              <img className="avatar-modal__image" src={avatarMedieval} />
              {(props.avatar === avatarMedieval)
            ? <button className="avatar-modal__choose-button avatar-modal__choose-button--chosen">Chosen</button>
            : <button onClick={() => chooseAvatar(avatarMedieval)} className="avatar-modal__choose-button">Choose</button>}
            </li>
            <li className="avatar-modal__avatar">
              <img className="avatar-modal__image" src={avatarBoy} />
              {(props.avatar === avatarBoy)
            ? <button className="avatar-modal__choose-button avatar-modal__choose-button--chosen">Chosen</button>
            : <button onClick={() => chooseAvatar(avatarBoy)} className="avatar-modal__choose-button">Choose</button>}
            </li>
            <li className="avatar-modal__avatar">
              <img className="avatar-modal__image" src={avatarDog} />
              {(props.avatar === avatarDog)
            ? <button className="avatar-modal__choose-button avatar-modal__choose-button--chosen">Chosen</button>
            : <button onClick={() => chooseAvatar(avatarDog)} className="avatar-modal__choose-button">Choose</button>}
            </li>
            <li className="avatar-modal__avatar">
              <img className="avatar-modal__image" src={avatarLenny} />
              {(props.avatar === avatarLenny)
            ? <button className="avatar-modal__choose-button avatar-modal__choose-button--chosen">Chosen</button>
            : <button onClick={() => chooseAvatar(avatarLenny)} className="avatar-modal__choose-button">Choose</button>}
            </li>
            <li className="avatar-modal__avatar">
              <input id="file" className="avatar-modal__file-input" type="file" accept="image/*" onChange={(e) => showImage(e.target.files[0]) } />
              <label htmlFor="file" className="avatar-modal__file-input-label">{(loadingImage) ? "Loading..." :"Choose from drive"}</label>
              <small className="avatar-modal__file-input-note">Don't worry, your picture will be seen only by hundreds of completely fake users.</small>
            </li>
          </ul>
        </section>
      </CSSTransition>
    </>
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
    </header>
  )
}

function WelcomeMessage(props) {
  return (
    <section className="welcome-message">
      <div className="welcome-message__container">
        <h2 className="welcome-message__heading">Welcome!</h2>
        <p className="welcome-message__text">So this is your kingdom. We've set things up for you, but if you wish, you can change this avatar – tap on it. 🎯</p>
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

function Post(props) {
  return (
    <CSSTransition key={props.title} in={true} timeout={400} classNames="post">
      <li className='post' key={props.title}>
        <div className="post__container">
          <header className="post__header">
            <img onClick={() => props.setShowAvatarModal(true)} src={props.avatar} className='post__avatar' alt="Admin's page avatar."/>
            <h2 className='post__title'>{props.title}</h2>
            <Hashtags text={props.text} />
          </header>
          <p className='post__text'>{props.text}</p>
        <ShowDate />
        <div className="post__reactions">
          <HeartsCounter isRight={props.isRight}/>
          <img src={heartIcon} className='post__heart-icon' alt="Icon of a heart."/>
          <CommentCounter commentsCount={props.commentsCount} id={props.id} />
        </div>
        </div>
        <TransitionGroup className="post__comments-list" component='ul'>
          <Comment id={props.id} isRight={props.isRight} randomUsers={props.randomUsers} setRandomUsers={props.setRandomUsers} commentsCount={props.commentsCount} setCommentsCount={props.setCommentsCount} order={1}/>
          <Comment id={props.id} isRight={props.isRight} randomUsers={props.randomUsers} setRandomUsers={props.setRandomUsers} commentsCount={props.commentsCount} setCommentsCount={props.setCommentsCount} order={2}/>
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
      return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    }} end={hearts}/></p>
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
  // eslint-disable-next-line
  const [datePublished, setDatePublished] = useState(useContext(TimeContext).progress); 
  const time = useContext(TimeContext).progress - datePublished;
  return (
    <p className='post__date'>{formatDate(time)}</p>
  )

  function formatDate(time) {
    if (time === 0) {
      return "Just now";
    } else if (time === 1) {
      return "1 hour ago";
    } else if (time < 24) {
      return time + " hours ago";
    } else if (time >= 24 && time < 48) {
      return "1 day ago";
    } else {
      return Math.floor(time / 24) + " days ago";
    }
  }
}

function Comment(props) {
  const [comment, setComment] = useState(false);
  const [creationTime, setCreationTime] = useState(Date.now());
  const [commentText, setCommentText] = useState("");
  useEffect(() => {
    if (props.order === 2 && Math.random() > 0.5) {
      return undefined;
    }
    setCreationTime(Date.now());
    setTimeout(() => {
      setCommentText((props.isRight) ? GOOD_COMMENTS[giveRandom(0, GOOD_COMMENTS.length)] : BAD_COMMENTS[giveRandom(0, BAD_COMMENTS.length)]);
      setComment(props.randomUsers[props.order - 1]);
      props.setRandomUsers(props.randomUsers.slice(props.order));
      props.setCommentsCount({...props.commentsCount, [props.id]: props.order});
    }, Math.max(creationTime + 1000 + props.order * 500 - Date.now(), 0))
  }, []);
  return (!comment) ? (null) : (
    <>
      <li className="comment" key={comment.name.first + comment.name.last}>
        <img className="comment__photo" alt="Commenter's avatar." src={comment.picture.thumbnail}/>
        <div className='comment__texts-container'>
          <p className="comment__text">{commentText}</p>
          <p className="comment__name">{capFirstLetter(comment.name.first)} {capFirstLetter(comment.name.last)}</p>
        </div>
      </li>
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
      <button className="new-post__add-post-button" disabled={!chosenJoke} onClick={() => choosePunchline(chosenJoke)}>+</button>
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
        // newLine[i].children[0].setAttribute("tabIndex", counter + 1);
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

function capFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function giveRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export default App;
