import type { FC } from "react";
import type { Props } from "./types";

const Proposal: FC<Props> = ({ size = 16 } = {}) => (
    <svg width={size} height={size} viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g>
                <g transform="translate(1.000000, 1.000000)">
                    <path d="M13,14 L1,14 C0.448,14 0,13.552 0,13 L0,1 C0,0.448 0.448,0 1,0 L13,0 C13.552,0 14,0.448 14,1 L14,13 C14,13.552 13.552,14 13,14" fill="#F89232"/>
                    <path d="M3,6 C3,8 5,9 5,10 L9,10 C9,9 11,8 11,6 C11,3.78999996 9.21000004,2 7,2 C4.78999996,2 3,3.78999996 3,6 Z" fill="#FFFFFF" />
                    <path d="M5,7 L7,8.75 L9,7" id="Path-10" stroke="#F79232" />
                    <rect fill="#FFFFFF" x="5" y="11" width="4" height="1"/>
                    <rect fill="#F79232" x="4" y="10" width="6" height="1"/>
                </g>
            </g>
        </g>
    </svg>
);

export { Proposal };
