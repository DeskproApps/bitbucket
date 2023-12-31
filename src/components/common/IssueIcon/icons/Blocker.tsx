import type { FC } from "react";
import type { Props } from "./types";

const Blocker: FC<Props> = ({ size = 16 } = {}) => (
	<svg height={size} width={size} viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" enableBackground="new 0 0 64 64">
        <path fill="#CE0000" d="M32,0C14.327,0,0,14.327,0,32c0,17.673,14.327,32,32,32s32-14.327,32-32C64,14.327,49.673,0,32,0z M32,8 c5.52,0,10.601,1.868,14.655,5L13,46.655C9.868,42.601,8,37.52,8,32C8,18.745,18.745,8,32,8z M32,56 c-4.844,0-9.35-1.44-13.122-3.909l33.213-33.213C54.56,22.65,56,27.156,56,32C56,45.255,45.255,56,32,56z"/>
    </svg>
);

export { Blocker };
