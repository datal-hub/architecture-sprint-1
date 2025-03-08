import React, { lazy, Suspense, useState, useEffect, useCallback }  from "react";
import ReactDOM from "react-dom";
import {Route, useHistory, Switch, BrowserRouter} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CurrentUserContext } from "./contexts/CurrentUserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import CheckToken from "auth/CheckToken";


function App() {
    // В корневом компоненте App создана стейт-переменная currentUser. Она используется в качестве значения для провайдера контекста.
    const [currentUser, setCurrentUser] = React.useState({});

    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    //В компоненты добавлены новые стейт-переменные: email — в компонент App
    const [email, setEmail] = React.useState("");

    const history = useHistory();

    const handleLoginEvent = useCallback((event) => {
        setIsLoggedIn(event.detail);
    }, []);

    useEffect(() => {
        window.addEventListener("login-event", handleLoginEvent);

        return () => {
            window.removeEventListener("login-event", handleLoginEvent);
        };
    }, [handleLoginEvent]);

    // при монтировании App описан эффект, проверяющий наличие токена и его валидности
    React.useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
            CheckToken(token)
                .then((res) => {
                    setEmail(res.data.email);
                    setIsLoggedIn(true);
                    history.push("/");
                })
                .catch((err) => {
                    localStorage.removeItem("jwt");
                    console.log(err);
                });
        }
    }, [history]);

    function onSignOut() {
        // при вызове обработчика onSignOut происходит удаление jwt
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        // После успешного вызова обработчика onSignOut происходит редирект на /signin
        history.push("/signin");
    }

    const MainComponent = () => (
        <>
            <Suspense fallback="loading">
                <Profile />
                <Gallery />
            </Suspense>
        </>
    );

    return (
        // В компонент App внедрён контекст через CurrentUserContext.Provider
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page__content">
                <Header email={email} onSignOut={onSignOut} />
                <Switch>
                    <Route
                        path="/signup"
                        render={(props) => (
                            <Suspense fallback="loading...">
                                <Register {...props} />  {/* Прокидываем все пропсы от Route в компонент Login */}
                            </Suspense>
                        )}
                    />
                    <Route
                        path="/signin"
                        render={(props) => (
                            <Suspense fallback="loading...">
                                <Login {...props} />  {/* Прокидываем все пропсы от Route в компонент Login */}
                            </Suspense>
                        )}
                    />
                    <Suspense fallback="loading...">
                        <ProtectedRoute exact path="/" loggedIn={isLoggedIn} component={MainComponent} />
                    </Suspense>
                </Switch>
                <Footer />
            </div>
        </CurrentUserContext.Provider>
    );
}

const Login = lazy(() => import('auth/Login').catch(() => {
        return { default: () => <div className='error'>Component is not available!</div> };
    })
);

const Register = lazy(() => import('auth/Register').catch(() => {
        return { default: () => <div className='error'>Component is not available!</div> };
    })
);

const Profile = lazy(() => import('profile/Profile').catch(() => {
        return { default: () => <div className='error'>Component is not available!</div> };
    })
);

const Gallery = lazy(() => import('gallery/Gallery').catch(() => {
        return { default: () => <div className='error'>Component is not available!</div> };
    })
);

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('app')
);