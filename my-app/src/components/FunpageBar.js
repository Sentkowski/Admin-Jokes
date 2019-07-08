import React, { useState, useEffect, useContext } from 'react';
import CountUp from 'react-countup';
import heartIcon from '../heart-black.svg';
import { TimeContext } from "./Timer"
import { ModalOpenContext } from "./ModalDetector";


export default function FunpageBar(props) {
  return (
    <header className="funpage-bar">
      <img tabIndex={!useContext(ModalOpenContext).open ? 0 : -1}
           onKeyDown={(e) => { if (e.keyCode === 13) { props.setShowAvatarModal(true) } }}
           onClick={() => props.setShowAvatarModal(true)} src={props.avatar}
           className="funpage-bar__avatar" alt="Admin's page avatar." />
      <div className="funpage-bar__texts-container">
        <h1 className="funpage-bar__name">The funniest Funpage</h1>
        <div className="funpage-bar__bottom-container">
          <p className="funpage-bar__admin-note">Hello, Admin</p>
          <TrendingStatus history={props.history} />
          <p className="funpage-bar__followers-number">{props.gameStarted ? <CountUp duration={3} start={(props.followers >= 0) ? props.followers - props.history[4] : 0} end={props.followers} /> : props.followers}</p>
          <img src={heartIcon} className="funpage-bar__followers-icon" alt="Icon of a heart." />
        </div>
      </div>
      <progress className="funpage-bar__time-progress" value={168 - useContext(TimeContext).progress} max="168"></progress>
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