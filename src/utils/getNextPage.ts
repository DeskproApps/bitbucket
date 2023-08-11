import get from "lodash/get";
import type { Pagination } from "../services/bitbucket/types";

const getNextPage = <T = unknown>(pagination?: Pagination<T>): number|undefined => {
    const pagelen = get(pagination, ["pagelen"]);
    const size = get(pagination, ["size"]);
    const page = get(pagination, ["page"]);

    if (!pagelen || !size || !page) {
        return;
    }

    const currentSize = pagelen * page;

    return (size - currentSize) <= 0 ? undefined : page + 1;
};

export { getNextPage };
