import type { FC } from "react";
import type { Props } from "./types";

const Bug: FC<Props> = ({ size = 16 } = {}) => (
  <svg width={size} height={size} viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g>
        <g transform="translate(1.000000, 1.000000)">
          <path d="M13,14 L1,14 C0.448,14 0,13.552 0,13 L0,1 C0,0.448 0.448,0 1,0 L13,0 C13.552,0 14,0.448 14,1 L14,13 C14,13.552 13.552,14 13,14" fill="#D04437"/>
          <path d="M10,7 C10,8.657 8.657,10 7,10 C5.343,10 4,8.657 4,7 C4,5.343 5.343,4 7,4 C8.657,4 10,5.343 10,7" fill="#FFFFFF"/>
        </g>
      </g>
    </g>
  </svg>
);

export { Bug };
