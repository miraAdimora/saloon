import React, { useEffect, useCallback, useState } from "react";
import "./App.css";
import coverImg from "./assets/img/shoe.jpg";
import { login, logout as destroy } from "./utils/auth";
import Cover from "./components/utils/Cover";
import { Notification } from "./components/utils/Notifications";
import Saloons from "./components/saloon/Saloons";
import Navigation from "./components/NavBar";
// import Index from "./components/footer";


const App = function AppWrapper() {
    const isAuthenticated = window.auth.isAuthenticated;

    return (
        <>
            <Notification />
            {isAuthenticated ? (
                <div>
                     <Navigation />
                    <br /> 
                    <main>
                        <Saloons />
                    </main>
                    {/* <Index /> */}
                </div>
            ) : (
                <Cover name="Street Food" login={login} coverImg={coverImg} />
            )}
        </>
    );
};

export default App;