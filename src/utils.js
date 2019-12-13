import React from "react";
import pathfinder from "./images/pathfinder.jpg";
import bangalore from "./images/bangalore.png";
import bloodhound from "./images/bloodhound.png";
import caustic from "./images/caustic.png";
import gibraltar from "./images/gibraltar.png";
import lifeline from "./images/lifeline.png";
import mirage from "./images/mirage.png";
import wattson from "./images/wattson.png";
import wraith from "./images/wraith.png";
import octane from "./images/octane.png";

export const svgs = {
  xbox: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 26 26"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <path
        fill="#CAD0E3"
        d="M5.733,2.183C5.72,2.193,5.71,2.204,5.698,2.214c0.073-0.077,0.178-0.16,0.247-0.205
      C7.959,0.7,10.286,0,12.868,0c2.415,0,4.677,0.667,6.608,1.827c0.14,0.083,0.522,0.345,0.719,0.583v0.001
      c-1.863-2.054-7.339,2.353-7.339,2.353c-1.894-1.46-3.636-2.455-4.933-2.809C6.839,1.658,6.089,1.906,5.733,2.183z M22.305,4.125
      c-0.057-0.063-0.119-0.122-0.176-0.187c-0.471-0.517-1.05-0.642-1.572-0.608c-0.475,0.149-2.67,0.94-5.375,3.494
      c0,0,3.045,2.961,4.91,5.988c1.863,3.027,2.977,5.406,2.292,8.708c2.079-2.285,3.347-5.321,3.347-8.655
      C25.731,9.491,24.432,6.42,22.305,4.125z M17.657,14.105c-0.826-0.927-2.055-2.255-3.678-3.869
      c-0.355-0.353-0.73-0.721-1.124-1.102c0,0-0.593,0.593-1.365,1.373v-0.001c-0.988,0.998-2.269,2.3-2.98,3.06
      c-1.266,1.351-4.893,5.594-5.097,7.973c0,0-0.807-1.887,0.964-6.239c1.157-2.845,4.653-7.117,6.113-8.509
      c0,0-1.334-1.468-3.008-2.482l-0.01-0.003c0,0-0.019-0.015-0.049-0.034c-0.805-0.48-1.684-0.85-2.53-0.899
      C4.029,3.434,3.482,4.066,3.482,4.066c-2.159,2.302-3.48,5.396-3.48,8.8c0,7.105,5.76,12.866,12.866,12.866
      c3.771,0,7.164-1.626,9.518-4.211c-0.001-0.004-0.271-1.7-2.002-4.133C19.977,16.818,18.49,15.039,17.657,14.105z"
      />
    </svg>
  ),
  pc: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 56.693 56.693"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g>
        <path
          fill="#CAD0E3"
          d="M3.765,46.362l19.836,2.873V30.257H3.765V46.362z M3.765,27.546h19.836V8.566L3.765,11.439V27.546z M26.312,49.628   l26.616,3.855V30.257H26.312V49.628z M26.312,8.172v19.374h26.616V4.319L26.312,8.172z"
        />
      </g>
    </svg>
  ),
  ps4: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <path
        fill="#CAD0E3"
        d="M 10 3.5 L 10 21.84375 L 13.96875 23.0625 L 13.96875 7.75 C 13.96875 7.34375 14.019531 7.046875 14.1875 6.875 C 14.355469 6.640625 14.511719 6.617188 14.75 6.71875 C 15.324219 6.886719 15.59375 7.40625 15.59375 8.25 L 15.59375 14.40625 C 16.878906 15.015625 18.03125 15.078125 18.875 14.4375 C 19.753906 13.828125 20.21875 12.746094 20.21875 11.125 C 20.21875 9.433594 19.902344 8.128906 19.15625 7.28125 C 18.480469 6.371094 17.289063 5.640625 15.53125 5.03125 C 13.335938 4.320313 11.488281 3.8125 10 3.5 Z M 8.78125 14.59375 L 8 14.84375 L 3.09375 16.59375 L 2.25 16.9375 C 0.964844 17.476563 0.277344 18.054688 0.3125 18.5625 C 0.378906 19.304688 1.226563 19.84375 2.75 20.25 C 4.726563 20.78125 6.730469 20.902344 8.78125 20.59375 L 8.78125 18.5 L 8 18.78125 L 7.125 19.125 L 5.71875 19.40625 L 4.375 19.25 C 4.105469 19.078125 4.015625 18.886719 4.1875 18.71875 C 4.355469 18.617188 4.605469 18.476563 4.875 18.375 L 5.78125 18.0625 L 8.78125 17 Z M 20.15625 15.5625 C 19.789063 15.546875 19.417969 15.578125 19.0625 15.59375 C 17.75 15.621094 16.402344 15.835938 15 16.28125 L 15 18.75 L 17.78125 17.78125 L 19.21875 17.28125 C 19.21875 17.28125 19.761719 17.136719 20.15625 17.03125 C 20.761719 16.871094 21.40625 17.09375 21.40625 17.09375 C 21.777344 17.125 21.964844 17.265625 22.03125 17.4375 C 22.097656 17.640625 21.851563 17.796875 21.34375 17.96875 L 20.09375 18.46875 L 15 20.28125 L 15 22.6875 L 17.375 21.84375 L 23.09375 19.8125 L 23.78125 19.5 C 25.136719 18.992188 25.753906 18.457031 25.6875 17.78125 C 25.652344 17.136719 24.882813 16.628906 23.53125 16.1875 C 22.390625 15.804688 21.253906 15.605469 20.15625 15.5625 Z"
      />
    </svg>
  ), 
  searchicon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"/></svg>
};

export const backgrounds = {
  Pathfinder: pathfinder,
  bangalore: bangalore,
  bloodhound: bloodhound,
  caustic: caustic,
  crypto: crypto,
  gibraltar: gibraltar,
  lifeline: lifeline,
  mirage: mirage,
  wattson: wattson,
  wraith: wraith,
  octane: octane
};


export const compare = (a, b) => {
  const killsA = Number(a.stats.kills.value);
  const killsB = Number(b.stats.kills.value);

  var comparison = 0;
  if (killsA < killsB) {
    comparison = 1;
  } else if (killsA > killsB) {
    comparison = -1;
  }

  return comparison;
};