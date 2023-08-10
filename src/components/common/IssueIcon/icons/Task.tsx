import type { FC } from "react";
import type { Props } from "./types";

const Task: FC<Props> = ({ size = 16 } = {}) => (
    <svg width={size} height={size} viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g>
                <g transform="translate(1.000000, 1.000000)">
                    <path d="M13,14 L1,14 C0.448,14 0,13.552 0,13 L0,1 C0,0.448 0.448,0 1,0 L13,0 C13.552,0 14,0.448 14,1 L14,13 C14,13.552 13.552,14 13,14" fill="#3B7FC4"/>
                    <path d="M2.5,6.99999999 L5.5,10 L11.5,3.99999999" stroke="#FFFFFF" strokeWidth="2"/>
                </g>
            </g>
        </g>
    </svg>
);

export { Task };
