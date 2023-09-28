import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Link } from "./types";

const downloadFileService = (client: IDeskproClient, url: Link["href"]) => {
  return baseRequest<Blob>(client, { rawUrl: url, type: "blob" });
};

export { downloadFileService };
