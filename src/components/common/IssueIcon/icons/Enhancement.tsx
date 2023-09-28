import type { FC } from "react";
import type { Props } from "./types";

const Enhancement: FC<Props> = ({ size = 16 } = {}) => (
  <svg width={size} height={size} viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g>
              <g transform="translate(1.000000, 1.000000)">
                  <path d="M13,14 L1,14 C0.448,14 0,13.552 0,13 L0,1 C0,0.448 0.448,0 1,0 L13,0 C13.552,0 14,0.448 14,1 L14,13 C14,13.552 13.552,14 13,14" fill="#67AB49"/>
                  <path d="M8.414,4.172 L4.172,8.414 L2.757,7 L7,2.757 L8.414,4.172" fill="#FFFFFF" />
                  <path d="M9.828,8.414 L11.243,7 L7,2.757 L5.586,4.172 L9.828,8.414" fill="#FFFFFF" />
                  <path d="M6,5 L8,5 L8,11 L6,11 L6,5 Z" fill="#FFFFFF" />
              </g>
          </g>
      </g>
  </svg>
);

export { Enhancement };
