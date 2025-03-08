import React, { useContext, useState, useEffect } from "react";
import { CurrentUserContext } from 'contexts';
import api from "../utils/api";  // путь к файлу
import '../blocks/places/places.css';
import '../blocks/card/card.css';
import '../blocks/popup/popup.css';
import Card from "./Card";
import ImagePopup from "./ImagePopup";

function Gallery() {
    const currentUser = useContext(CurrentUserContext); // Извлекаем currentUser из контекста
    const [user, setUser] = useState(currentUser);
    const [cards, setCards] = React.useState([]);
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [isLoading, setIsLoading] = useState(true); // Стейт для отслеживания состояния загрузки

    const handleNewCard = (event) => {
        setCards(prevCards => [event.detail, ...prevCards]); // Добавляем новую карточку в начало массива
    };

    React.useEffect(() => {
        let isMounted = true; // флаг, который отслеживает монтирование компонента

        api
            .getAppInfo()
            .then(([cardData, userData]) => {
                if (isMounted) {
                    setCards(cardData);
                    setUser(userData);
                    setIsLoading(false); // Меняем состояние на не загружающееся
                }
            })
            .catch((err) => {
                console.log("Error:", err);
                if (isMounted) {
                    setIsLoading(false); // Если ошибка, все равно устанавливаем не загружающийся
                }
            });

        window.addEventListener("new-card", handleNewCard);

        return () => {
            isMounted = false; // Когда компонент размонтируется, флаг станет false
            window.removeEventListener("new-card", handleNewCard);
        };
    }, []); // Этот эффект сработает только один раз при монтировании компонента

    // Если данные о пользователе еще не загружены, отображаем загрузочный экран
    if (isLoading) {
        return <div>Loading...</div>;  // или можете показать спиннер или анимацию
    }

    function handleCardClick(card) {
        setSelectedCard(card);
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some((i) => i._id === user._id);
        api
            .changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCards((cards) =>
                    cards.map((c) => (c._id === card._id ? newCard : c))
                );
            })
            .catch((err) => console.log(err));
    }

    function handleCardDelete(card) {
        api
            .removeCard(card._id)
            .then(() => {
                setCards((cards) => cards.filter((c) => c._id !== card._id));
            })
            .catch((err) => console.log(err));
    }

    const closeImagePopup = () => {
        setSelectedCard(null);
    };

    return (
        <section className="places page__section">
            <ul className="places__list">
                {cards.map((card) => (
                    <Card
                        key={card._id  || card.name}
                        card={card}
                        currentUser={user}
                        onCardClick={handleCardClick}
                        onCardLike={handleCardLike}
                        onCardDelete={handleCardDelete}
                    />
                ))}
            </ul>
            <ImagePopup card={selectedCard} onClose={closeImagePopup} />
        </section>
    );
}

export default Gallery;
