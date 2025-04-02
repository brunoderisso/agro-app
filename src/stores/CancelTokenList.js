import axios from "axios";

export default function CancelTokenList() {
    let tokens = [];

    const add = () => {
        const index = tokens.length;
        const src = axios.CancelToken.source();
        tokens.push({ token: src, pending: true });

        return index
    };

    const get = (index) =>{
        return tokens[index];
    };

    const remove = (index) => {
        let request = tokens[index];

        if (request !== undefined && request.pending) {
            request.pending = false;
            tokens[index] = request;
        }
    };

    const clear = () => {
        tokens.forEach((request) => {
            if (request.pending) {
                request.token.cancel();
            }
        });
        tokens = [];
    };

    return {
        add : add,
        clear: clear,
        get: get,
        remove: remove,
    };
};