import React, { useContext } from "react";
import { SearchBarContext } from "../../App.jsx";
import "./searchbar.css";

export default function SearchBar(props) {
  let { searchBarActive, setActive } = useContext(SearchBarContext);
  return (
    <div
      className="search-bar-container"
      onClick={function (e) {
        let target = e.currentTarget;
        if (target.className === e.target.className) {
          setActive(false);
        }
      }}
    >
      <div className="search-bar">
        <h1>The search bar !</h1>
      </div>
    </div>
  );
}
