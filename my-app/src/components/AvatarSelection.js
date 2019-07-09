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

    const avatars = [{img: avatarMedieval, alt: "Cropped medieval painting of a small child's serious face."},
                     {img: avatarBoy, alt: "A laughing boy."},
                     {img: avatarDog, alt: "A dog weraing sunglasses."},
                     {img: avatarLenny, alt: "Lennyface meme picture."}];

    return (
        <section ref={modal} tabIndex={-1} className="avatar-modal">
            <h2 className="avatar-modal__heading" >Pick your new avatar!</h2>
            <ul className="avatar-modal__avatars-list">
                {avatars.map(av => <AvatarOption chooseAvatar={chooseAvatar} avatar={av} currentAvatar={props.currentAvatar} key={av}/>)}
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

function AvatarOption(props) {
    return (
        <li className="avatar-modal__avatar">
        <img className="avatar-modal__image" alt={props.avatar.alt} src={props.avatar.img} />
        {(props.currentAvatar === props.avatar.img)
            ? <button className="avatar-modal__choose-button avatar-modal__choose-button--chosen">Chosen</button>
            : <button onClick={() => props.chooseAvatar(props.avatar.img)} className="avatar-modal__choose-button">Choose</button>}
        </li>
    )
}