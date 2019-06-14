import React, { useState, useEffect, useContext } from 'react';
import './App.css';
const TimeContext = React.createContext({ progress: 0 });

function App() {
  return (
    <Feed />
  );
}

function Feed() {
  const [postID, setPostID] = useState(196);
  const [postsList, addPost] = useState([{
    title: 'it works!',
    text: 'coolcoolcoolcoolcoolcoolcoolcoolcoolcool',
    date: 'Just now'
  }]);
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
    <li key={props.title}>
      <h2>{props.title}</h2>
      <p>{props.text}</p>
      <ShowDate />
      <ul>
        <Comment />
        <Comment />
      </ul>
    </li>
  )
}

function ShowDate() {
  const [datePublished, setDatePublished] = useState(useContext(TimeContext).progress); 
  const time = useContext(TimeContext).progress - datePublished;
  return (
    <p>{formatDate(time)}</p>
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
    fetch(`https://randomuser.me/api/?inc=name,picture`)
      .then(res => res.json())
      .then(res => {
        setComment(res.results[0]);
      })
  }, []);
  return (!comment) ? (<div></div>) : (
    <li key={comment.name.first + comment.name.last}>
      <p>{comment.name.first + comment.name.last}</p>
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
      title: props.postID + 1,
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

export default App;
