const triggerDownloadFileToUser = (blob: Blob, filename: string): void => {
    const href = URL.createObjectURL(blob);
    const linkTag = document.createElement("a");
    linkTag.href = href;
    linkTag.setAttribute("download", filename);
    document.body.appendChild(linkTag);
    linkTag.click();
    document.body.removeChild(linkTag);
};

export { triggerDownloadFileToUser };
