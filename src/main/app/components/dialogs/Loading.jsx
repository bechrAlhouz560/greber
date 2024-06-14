import React from "react";
import logo from "../../../../assets/SVG/logo.svg";
import loading from "../../../../assets/SVG/loading.svg";
import { BiHeart } from "react-icons/bi";
import font from "../../../../assets/fonts/font.ttf";

export default function Loading() {
  return (
    <div className="app-loading">
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
      <div
        style={{
          position: "absolute",
          top: 0,
          width: "100vw",
          height: 30,
          background: "var(--theme1-blue)",
        }}
      ></div>
      <img
        src={logo}
        width={70}
        style={{
          borderRadius: 5,
        }}
        alt=""
      />
      <div className="loading-container">
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
      </div>
      <span
        style={{
          position: "absolute",
          bottom: 15,
          opacity: ".6",
        }}
      >
        created with <BiHeart color="red" /> by Bicher Alhouz
      </span>
    </div>
  );
}
