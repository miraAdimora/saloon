import React, { useEffect, useCallback, useState } from "react";
import "./App.css";
import coverImg from "./assets/img/misaloon.PNG";
import Cover from "./components/utils/Cover";
import { Notification } from "./components/utils/Notifications";
import Saloons from "./components/saloon/Saloons";
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
  } from 'reactstrap';
  import Wallet from "./components/Wallet";
  import { login, logout as destroy } from "./utils/auth";
  import { balance as principalBalance } from "./utils/ledger"


const App = function AppWrapper() {
    const principal = window.auth.principalText;
    const isAuthenticated = window.auth.isAuthenticated;
    const [balance, setBalance] = useState("0");
   

    const getBalance = useCallback(async () => {
        if (isAuthenticated) {
            setBalance(await principalBalance());
        }
    });


    useEffect(() => {
        getBalance();
    }, [getBalance]);

    return (
        <>
            <Notification />
            {isAuthenticated ? (
        <div>
         <Navbar expand="md" className="">
          <NavbarBrand style={{ fontWeight: 'bold', color: 'rgb(255, 0, 255)' }}>
            MiSALOON
          </NavbarBrand>
          <Nav navbar>
            <NavItem>
            <Wallet
              principal={principal}
              balance={balance}
              symbol={"ICP"}
              isAuthenticated={isAuthenticated}
              destroy={destroy}
              />
            </NavItem>
          </Nav>
        </Navbar>
                    <br /> 
                    <main>
                        <Saloons />
                    </main>
                </div>
            ) : (
                <Cover name="Street Food" login={login} coverImg={coverImg} />
            )}
        </>
    );
};

export default App;