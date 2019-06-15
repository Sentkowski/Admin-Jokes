import React, { useState, useEffect, useContext } from 'react';
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
        <p>{followers}</p>
        <ul>
          {postsList.map(post => Post(post))}
        </ul>
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

function Post(props) {
  return (
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
      <ul className="post__comments-list">
        <Comment />
        <Comment />
      </ul>
    </li>
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
    <li className="comment" key={comment.name.first + comment.name.last}>
      <header className='comment__header'>
        <img className="comment__photo" alt="Commenter's avatar." src={comment.picture.thumbnail}/>
        <p className="comment__name">{capFirstLetter(comment.name.first)} {capFirstLetter(comment.name.last)}</p>
      </header>
      <p className="comment__text">Haha, very funny!</p>
    </li>
  )
}

function JokeOptions(props) {
  const [jokesList, setJokes] = useState([]);
  const [jokesOrder, setJokesOrder] = useState([]);
  const [ready, setReady] = useState(false);
  const renderedAt = Date.now();

  useEffect(() => {
    fetch(`https://official-joke-api.appspot.com/random_ten`)
      .then(res => res.json())
      .then(res => {
        setJokesOrder(shuffle([0, 1, 2, 3, 4]));
        setJokes(res);
        setReady(true);
      })
  }, [props.postID]);

  return (!ready) ? (<div></div>) : (
    <section>
      <p>{jokesList[0].setup}</p>
      <ul>
        <li><button onClick={() => checkPunchline(0)}>{jokesList[jokesOrder[0]].punchline}</button></li>
        <li><button onClick={() => checkPunchline(1)}>{jokesList[jokesOrder[1]].punchline}</button></li>
        <li><button onClick={() => checkPunchline(2)}>{jokesList[jokesOrder[2]].punchline}</button></li>
        <li><button onClick={() => checkPunchline(3)}>{jokesList[jokesOrder[3]].punchline}</button></li>
        <li><button onClick={() => checkPunchline(4)}>{jokesList[jokesOrder[4]].punchline}</button></li>
      </ul>
    </section>
  )

  function checkPunchline(num) {
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
    props.addPost([...props.postsList, newPost]);
    props.setPostID(props.postID + 1);
    setReady(false);
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
