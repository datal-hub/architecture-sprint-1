import React, { useContext, useState, useEffect } from "react";
import { CurrentUserContext } from 'contexts';
import api from "../utils/api";  // путь к файлу
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import '../blocks/profile/profile.css';
import AddPlacePopup from "./AddPlacePopup";

function Profile() {
    const currentUser = useContext(CurrentUserContext); // Извлекаем currentUser из контекста
    const [user, setUser] = useState(currentUser); // Локальное состояние для user, начальное значение из контекста
    const [isLoading, setIsLoading] = useState(true); // Стейт для отслеживания состояния загрузки

    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
        React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
        React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);

    React.useEffect(() => {
        let isMounted = true; // флаг, который отслеживает монтирование компонента

        api
            .getAppInfo()
            .then((userData) => {
                if (isMounted) {
                    setUser(userData); // Обновляем состояние с данными о пользователе
                    setIsLoading(false); // Меняем состояние на не загружающееся
                }
            })
            .catch((err) => {
                console.log("Error:", err);
                if (isMounted) {
                    setIsLoading(false); // Если ошибка, все равно устанавливаем не загружающийся
                }
            });

        return () => {
            isMounted = false; // Когда компонент размонтируется, флаг станет false
        };
    }, []); // Этот эффект сработает только один раз при монтировании компонента

    // Если данные о пользователе еще не загружены, отображаем загрузочный экран
    if (isLoading) {
        return <div>Loading...</div>;  // или можете показать спиннер или анимацию
    }

    const handleEditProfile = () => {
        setIsEditProfilePopupOpen(true); // Открыть модалку редактирования аватара
    };

    const closeEditProfile = () => {
        setIsEditProfilePopupOpen(false); // Закрыть модалку редактирования аватара
    };

    function handleUpdateProfile(userUpdate) {
        api
            .setUserInfo(userUpdate)
            .then((newUserData) => {
                setUser(newUserData);
                closeEditProfile();
            })
            .catch((err) => console.log(err));
    }

    const handleEditAvatar = () => {
        setIsEditAvatarPopupOpen(true); // Открыть модалку редактирования аватара
    };

    const closeEditAvatar = () => {
        setIsEditAvatarPopupOpen(false); // Закрыть модалку редактирования аватара
    };

    function handleUpdateAvatar(avatarUpdate) {
        api
            .setUserAvatar(avatarUpdate)
            .then((newUserData) => {
                setUser(newUserData);
                closeEditAvatar();
            })
            .catch((err) => console.log(err));
    }

    const handleAddPlace = () => {
        setIsAddPlacePopupOpen(true); // Открыть модалку редактирования аватара
    };

    const closeAddPlace = () => {
        setIsAddPlacePopupOpen(false); // Закрыть модалку редактирования аватара
    };

    const sendNewCardEvent = (newCard) => {
        // Эмитируем кастомное событие для добавления новой картинки
        const event = new CustomEvent("new-card", { detail: newCard });
        window.dispatchEvent(event);
    };

    function handleUpdatePlace(newCard) {
        api
            .addCard(newCard)
            .then((newCardFull) => {
                sendNewCardEvent(newCardFull);
                closeAddPlace();
            })
            .catch((err) => console.log(err));
    }

    // Проверяем наличие данных для avatar, name и about
    const imageStyle = user?.avatar? { backgroundImage: `url(${user.avatar})` } : {};

    return (
        <section className="profile page__section">
            <div className="profile__image" onClick={handleEditAvatar} style={imageStyle}></div>
            <div className="profile__info">
                <h1 className="profile__title">{user.name}</h1>
                <button className="profile__edit-button" type="button" onClick={handleEditProfile}></button>
                <p className="profile__description">{user.about}</p>
            </div>
            <button className="profile__add-button" type="button" onClick={handleAddPlace}></button>
            <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onUpdateAvatar={handleUpdateAvatar}
                onClose={closeEditAvatar}
            />
            <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                onUpdateUser={handleUpdateProfile}
                onClose={closeEditProfile}
            />
            <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onAddPlace={handleUpdatePlace}
                onClose={closeAddPlace}
            />
        </section>
    );
}

export default Profile;
