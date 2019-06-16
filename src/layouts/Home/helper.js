
export const Type = Object.freeze({
    PDF : "application/pdf",
    TEXT: "text/plain"
});

export const arrayBufferToString = (arrayBuffer) => {
    return String.fromCharCode.apply(null, new Uint8Array((arrayBuffer)))
};
