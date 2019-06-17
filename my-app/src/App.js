import React, { useState, useEffect, useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.scss';
import funpageAvatar from './funpage_avatar.jpg';
import heartIcon from './heart-black.svg';

const TimeContext = React.createContext({ progress: 0 });

function App() {
  return (
    <Feed />
  );
}

function Feed() {
  const [postID, setPostID] = useState(196);
  const [postsList, addPost] = useState([
    // {
    // title: 'it works!',
    // text: 'coolcoolcoolcoolcoolcoolcoolcoolcoolcool',
    // date: 'Just now'
    // }
  ]);
  const [followers, setFollowers] = useState(956);
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
        <FunpageBar followers={followers} />
        <TransitionGroup component='ul'>
            {postsList.map(post => Post(post))}
        </TransitionGroup>
        <JokeOptions postID={postID} setPostID={setPostID} postsList={postsList} addPost={addPost} adjustFollowers={adjustFollowers} />
      </TimeContext.Provider>
    </main>
  );

  function adjustFollowers(isRight, timePassed) {
    const newFollowers = Math.max(Math.round(100 - 0.005 * timePassed), 0);
    if (isRight) {
      setFollowers(followers + newFollowers);
    } else {
      setFollowers(followers - newFollowers);
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
          <p className="funpage-bar__trending-note">Trending!</p>
          <p className="funpage-bar__followers-number">{props.followers}</p>
          <img src={heartIcon} className="funpage-bar__followers-icon" alt="Icon of a heart."/>
        </div>
      </div>
    </header>
  )
}

function Post(props) {
  return (
    <CSSTransition key={props.title} in={true} timeout={200} classNames="post">
      <li className='post' key={props.title}>
        <div className="post__container">
          <header className="post__header">
            <img src={funpageAvatar} className='post__avatar' alt="Admin's page avatar."/>
            <h2 className='post__title'>{props.title}</h2>
          </header>
          <p className='post__text'>{props.text}</p>
        <ShowDate />
        <div className="post__reactions">
          <p className="post__hearts-counter">13</p>
          <img src={heartIcon} className='post__heart-icon' alt="Icon of a heart."/>
          <p className="post__comments-counter">2 comments</p>
        </div>
        </div>
        <TransitionGroup className="post__comments-list" component='ul'>
          <Comment />
          <Comment />
        </TransitionGroup>
      </li>
    </CSSTransition>
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

function Comment() {
  const [comment, setComment] = useState(false);
  useEffect(() => {
    fetch(`https://randomuser.me/api/?inc=name,picture&nat=us,gb`)
      .then(res => res.json())
      .then(res => {
        setComment(res.results[0]);
      })
  }, []);
  return (!comment) ? (<div></div>) : (
    <CSSTransition key={comment.name.first + comment.name.last} in={true} timeout={200} classNames="comment">
      <li className="comment" key={comment.name.first + comment.name.last}>
        <img className="comment__photo" alt="Commenter's avatar." src={comment.picture.thumbnail}/>
        <div className='comment__texts-container'>
          <p className="comment__text">Haha, very funny!</p>
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
  const renderedAt = Date.now();

  useEffect(() => {
    fetch(`https://official-joke-api.appspot.com/random_ten`)
      .then(res => res.json())
      .then(res => {
        setJokesOrder(shuffle([0, 1, 2, 3, 4]));
        setJokes(res);
        setReady(true);
        jokesMasonry(document.querySelectorAll(".new-post__punchline"));
      })
  }, [props.postID]);

  return (
    <section className={ready ? "new-post" : "new-post new-post--hidden"}>
      {ready &&
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
    if (jokesList[0] === jokesList[jokesOrder[num]]) {
      props.adjustFollowers(true, timePassed);
    } else {
      props.adjustFollowers(false, timePassed);
    }
    const newPost = {
      title: 'Joke #' + (props.postID + 1) + '!',
      text: jokesList[0].setup + ' ' + jokesList[jokesOrder[num]].punchline,
      date: 'Just now'
    };
    props.addPost([newPost, ...props.postsList]);
    props.setPostID(props.postID + 1);
    setReady(false);
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
      const newWidth = newComb.reduce((acc, currEl) => acc + currEl.offsetWidth + 8 , 0);
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

export default App;
