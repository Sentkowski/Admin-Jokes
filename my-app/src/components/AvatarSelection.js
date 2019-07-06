import React, { useState, useEffect, useRef } from 'react';
import avatarMedieval from '../avatars/avatar_medieval.jpg';
import avatarDog from '../avatars/avatar_dog.jpg';
import avatarLenny from '../avatars/avatar_lenny.png';
import avatarBoy from '../avatars/avatar_boy.jpg';
import Modal from "./Modal";

function AvatarSelection(props) {
    const [loadingImage, setLoadingImage] = useState(false);

    function showImage(file) {
        setLoadingImage(true);
        let reader = new FileReader();
        reader.onload = function () {
            setLoadingImage(false);
            props.setAvatar(reader.result);
            props.setModalState(false);
        };
        reader.readAsDataURL(file);
    }

    function chooseAvatar(av) {
        props.setAvatar(av);
        props.setModalState(false);
    }

    const modal = useRef(null);
    useEffect(() => {
        modal.current.focus();
    }, []);

    return (
        <section ref={modal} tabIndex={-1} className="avatar-modal">
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
                    <input id="file" className="avatar-modal__file-input" type="file" accept="image/*" onChange={(e) => showImage(e.target.files[0])} />
                    <label htmlFor="file" className="avatar-modal__file-input-label">{(loadingImage) ? "Loading..." : "Choose from drive"}</label>
                    <small className="avatar-modal__file-input-note">Don't worry, your picture will be seen only by hundreds of completely fake users.</small>
                </li>
            </ul>
        </section>
    )
}

function AvatarSelectionWithModal(props) {
    return Modal(AvatarSelection, props)
}

export default AvatarSelectionWithModal;
