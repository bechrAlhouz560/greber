import React, { useState } from "react";
import { Provider } from "react-redux";
import Body from "./components/body/Body.jsx";
import CreateBoardModal from "./components/modals/CreateBoardModal.jsx";
import CreateProjectModal from "./components/modals/CreateProjectModal.jsx";
import NavBar from "./components/navbar/NavBar.jsx";
import store from "./store";

// Pages
import ErrorDialog from "./components/dialogs/ErrorDialog.jsx";
import font from "../../assets/fonts/font.ttf";
import SearchBar from "./components/body/SearchBar.jsx";
import EncryptionModal from "./components/modals/encryption/EncryptionModal.jsx";
import TopBar from "./components/topbar/TopBar.jsx";

export const modalTypes = {
  projectModal: function (setModalActive) {
    return (
      <CreateProjectModal setModalActive={setModalActive}></CreateProjectModal>
    );
  },
  boardModal: function (setModalActive) {
    return (
      <CreateBoardModal setModalActive={setModalActive}></CreateBoardModal>
    );
  },
  encryptionModal: function (setModalActive) {
    return <EncryptionModal setModalActive={setModalActive} />;
  },
};

// For showing errors of the app
export let ErrorContext = React.createContext({
  error: {},
  setError: function (error) {},
});

ErrorContext.displayName = "Error";

// for displaying the global search engine
export const SearchBarContext = React.createContext({
  searchBarActive: false,
  setActive: function () {},
});
SearchBarContext.displayName = "SearchBar";

export const ActiveBoardContext = React.createContext({
  activeBoard: {},
  setActiveBoard: function () {},
});

export default function App() {
  const [modalActive, setModalActive] = useState(false);
  const [modalType, setModalType] = useState("");
  const [error, setError] = useState({
    title: "Error",
  });
  const [activeBoard, setActiveBoard] = useState({});
  const [searchBarActive, setActiveSearchBar] = useState(false);

  let setModal = function () {
    if (modalActive) {
      return modalTypes[modalType](setModalActive);
    } else {
      return "";
    }
  };

  return (
    <Provider store={store}>
      <ActiveBoardContext.Provider
        value={{
          activeBoard,
          setActiveBoard,
        }}
      >
        <ErrorContext.Provider
          value={{
            error,
            setError,
          }}
        >
          <SearchBarContext.Provider
            value={{
              searchBarActive,
              setActive: setActiveSearchBar,
            }}
          >
            {setModal()}
            <style>
              {/* adding the font family globally to the app */}
              {`
                            @font-face {
                                font-family: 'greber-font';
                                src: url(${font});
                             }
                                * {
                                    font-family: 'greber-font' , 'Cairo'
                                }
                            `}
            </style>

            <TopBar></TopBar>
            <NavBar
              setModalActive={setModalActive}
              setModalType={setModalType}
            />
            <Body></Body>
            {error.message ? <ErrorDialog></ErrorDialog> : ""}
            {searchBarActive ? <SearchBar /> : ""}
          </SearchBarContext.Provider>
        </ErrorContext.Provider>
      </ActiveBoardContext.Provider>
    </Provider>
  );
}
