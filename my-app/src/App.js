import React, { useState, useEffect, useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import CountUp from 'react-countup';
import './App.scss';
import funpageAvatar from './funpage_avatar.jpg';
import heartIcon from './heart-black.svg';
import arrow from './arrow.svg';

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
  "Do you just copy-paste random words?",
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
  const [postID, setPostID] = useState(giveRandom(100, 200));
  const [postsList, addPost] = useState([
    // {
    // title: 'it works!',
    // text: 'coolcoolcoolcoolcoolcoolcoolcoolcoolcool',
    // date: 'Just now'
    // }
  ]);
  const [commentsCount, setCommentsCount] = useState({});
  const [followers, setFollowers] = useState(956);
  const [history, setHistory] = useState([50, 25, 50, 25, 50]);
  const [progress, setProgress] = useState(10);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(progress => progress + 1);
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <main>
      <TimeContext.Provider value={{progress: progress}}>
        <FunpageBar followers={followers} history={history} />
        <TransitionGroup className="posts-list" component='ul'>
            {postsList.map(post => Post({...post, setCommentsCount, commentsCount, followers}))}
        </TransitionGroup>
        <JokeOptions postID={postID} setPostID={setPostID} postsList={postsList} addPost={addPost} adjustFollowers={adjustFollowers} />
      </TimeContext.Provider>
    </main>
  );

  function adjustFollowers(isRight, timePassed) {
    const newFollowers = Math.max(Math.round(100 - 0.005 * timePassed), 10);
    if (isRight) {
      setFollowers(followers + newFollowers);
      setHistory([...history, newFollowers].splice(1,5));
    } else {
      setFollowers(followers - newFollowers);
      setHistory([...history, newFollowers * -1].splice(1,5));
    }
  }
}

function FunpageBar(props) {
  return (
    <header className="funpage-bar">
      <img src={funpageAvatar} className="funpage-bar__avatar" alt="Admin's page avatar." />
      <div className="funpage-bar__texts-container">
        <h1 className="funpage-bar__name">The funniest Funpage</h1>
        <div className="funpage-bar__bottom-container">
          <p className="funpage-bar__admin-note">Welcome, Admin</p>
          <TrendingStatus history={props.history} />
          <p className="funpage-bar__followers-number"><CountUp duration={3} start={props.followers - props.history[4]} end={props.followers} /></p>
          <img src={heartIcon} className="funpage-bar__followers-icon" alt="Icon of a heart."/>
        </div>
      </div>
    </header>
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
      },
      {
        min: -249,
        max: -100,
        desc: "Losing followers",
        class: 'bad',
      },
      {
        min: -99,
        max: 100,
        desc: "",
        class: 'neutral',
      },
      {
        min: 101,
        max: 300,
        desc: "Trending!",
        class: 'good',
      },
      {
        min: 301,
        max: Infinity,
        desc: "Going viral!",
        class: 'very-good',
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
      <p className={"funpage-bar__trending-note funpage-bar__trending-note--" + status.class}>{status.desc}</p>
      <img src={arrow} alt="An icon of arrow indicating if the funpage is trending." className={"funpage-bar__trending-icon funpage-bar__trending-icon--" + status.class}/>
    </>
  )
}

function Post(props) {
  return (
    <CSSTransition key={props.title} in={true} timeout={400} classNames="post">
      <li className='post' key={props.title}>
        <div className="post__container">
          <header className="post__header">
            <img src={funpageAvatar} className='post__avatar' alt="Admin's page avatar."/>
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
          <Comment id={props.id} isRight={props.isRight} commentsCount={props.commentsCount} setCommentsCount={props.setCommentsCount} order={1}/>
          <Comment id={props.id} isRight={props.isRight} commentsCount={props.commentsCount} setCommentsCount={props.setCommentsCount} order={2}/>
        </TransitionGroup>
      </li>
    </CSSTransition>
  )
}

function HeartsCounter(props) {
  const [hearts, setHearts] = useState(0);
  useEffect(() => {
    setHearts((props.isRight) ? giveRandom(15, 50) : giveRandom(0, 7));
  }, []);
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
    fetch(`https://randomuser.me/api/?inc=name,picture&nat=us,gb`)
      .then(res => res.json())
      .then(res => {
        setTimeout(() => {
          setCommentText((props.isRight) ? GOOD_COMMENTS[giveRandom(0, GOOD_COMMENTS.length)] : BAD_COMMENTS[giveRandom(0, BAD_COMMENTS.length)]);
          setComment(res.results[0]);
          props.setCommentsCount({...props.commentsCount, [props.id]: props.order});
        }, Math.max(creationTime + 1000 + props.order * 500 - Date.now(), 0), res)
      });
  }, []);
  return (!comment) ? (null) : (
    <CSSTransition key={comment.name.first + comment.name.last} in={true} timeout={400} classNames="comment">
      <li className="comment" key={comment.name.first + comment.name.last}>
        <img className="comment__photo" alt="Commenter's avatar." src={comment.picture.thumbnail}/>
        <div className='comment__texts-container'>
          <p className="comment__text">{commentText}</p>
          <p className="comment__name">{capFirstLetter(comment.name.first)} {capFirstLetter(comment.name.last)}</p>
        </div>
      </li>
    </CSSTransition>
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
    fetchJokes()
      .then(res => {setTimeout((res) => {
        setJokesOrder(shuffle([0, 1, 2, 3, 4]));
        setJokes(res);
        setReady(true);
        jokesMasonry(document.querySelectorAll(".new-post__punchline"));
        setRenderedAt(Date.now());
      }, Math.max(transitionTime + 1000 - Date.now(), 0), res)
    })
  }, [props.postID]);

  return (
    <section className={ready ? "new-post" : "new-post new-post--hidden"}>
      {(jokesList.length > 1) &&
        <>
          <p className="new-post__setup">{jokesList[0].setup}</p>
          <ul  className="new-post__punchlines-list">
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
      <button className="new-post__add-post-button" disabled={chosenJoke === false} onClick={() => checkPunchline(chosenJoke)}>+</button>
    </section>
  )

  function checkPunchline(num) {
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
  let elemsArr = Array.from(elems)
  const colWidth = document.querySelector(".new-post__punchlines-list").offsetWidth + 8;
  let counter = 0;
  while (elemsArr.length > 0) {
    const newLine = createLine(elemsArr, [], colWidth)[1];
    for (let i = 0; i < newLine.length; i++, counter++) {
      newLine[i].style.order = counter;
      newLine[i].children[0].setAttribute("tabindex", counter + 1);
      elemsArr = elemsArr.filter(item => item !== newLine[i])
    }
  }
}

function createLine(allElems, combined, max) {
  let posWidths = [];
  let combinations = [];
  for (let otherEl of allElems) {
    if (combined.indexOf(otherEl) === -1) {
      const newComb = [...combined, otherEl]
      const newWidth = newComb.reduce((acc, currEl) => acc + currEl.offsetWidth + 8, -8);
      if (newWidth < max) {
        const results = createLine(allElems, newComb, max);
        posWidths.push(results[0]);
        combinations.push(results[1]);
      } else if (newWidth === max) {
        return [newWidth, newComb];
      }
    }
  };
  if (combinations.length === 0) {
    return [combined.reduce((acc, currEl) => acc + currEl.offsetWidth + 8, 0), combined];
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

function fetchJokes() {
  return new Promise ((resolve, reject) => {
    fetch(`https://icanhazdadjoke.com/search?page=${giveRandom(0, 50)}&limit=${giveRandom(9, 11)}`, {
      headers: {
        Accept: "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        if (!createJokesList(res.results)) {
          resolve(fetchJokes())
        } else {
          resolve(createJokesList(res.results))
        }
      })
  })
}

function createJokesList(json) {
  let jokes = [];
  for (let joke of json) {
    let jokeSplit = joke.joke.match( /[^.!?]+[.!?]+/g );
    if (jokeSplit && jokeSplit.length === 2) {
      if (jokes.push({setup: jokeSplit[0], punchline: jokeSplit[1]}) === 5) {
        break;
      }
    }
  }
  return (jokes.length === 5) ? shuffle(jokes) : false;
}

function giveRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export default App;
