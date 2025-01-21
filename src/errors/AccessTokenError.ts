class AccessTokenError extends Error {
    constructor(public message = 'error fetching access token') {
        super(message);
    };
};

export default AccessTokenError;