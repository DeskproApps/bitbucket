import type { FC } from "react";
import type { Props } from "./types";

const Critical: FC<Props> = ({ size = 16 } = {}) => (
  <svg width={size} height={size} version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64" enableBackground="new 0 0 64 64">
  	<path fill="#CE0000" d="M32,44L32,44c2.2,0,4-1.8,4-4V4.037c0-2.2-1.8-4-4-4h0c-2.2,0-4,1.8-4,4V40C28,42.2,29.8,44,32,44z"/>
  	<path fill="#CE0000" d="M32,63.963L32,63.963c2.2,0,4-1.8,4-4v-3.41c0-2.2-1.8-4-4-4h0c-2.2,0-4,1.8-4,4v3.41 C28,62.163,29.8,63.963,32,63.963z"/>
  	<path fill="#CE0000" d="M49.593,21.63L49.593,21.63c1.556-1.556,1.556-4.101,0-5.657L34.824,1.204c-1.556-1.556-4.101-1.556-5.657,0 l0,0c-1.556,1.556-1.556,4.101,0,5.657L43.936,21.63C45.491,23.185,48.037,23.185,49.593,21.63z"/>
  	<path fill="#CE0000" d="M14.241,21.63L14.241,21.63c-1.556-1.556-1.556-4.101,0-5.657L29.01,1.204c1.556-1.556,4.101-1.556,5.657,0 l0,0c1.556,1.556,1.556,4.101,0,5.657L19.897,21.63C18.342,23.185,15.796,23.185,14.241,21.63z"/>
  </svg>
);

export { Critical };
