import get from "lodash/get";
import concat from "lodash/concat";
import { getNextPage } from "./getNextPage";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Pagination } from "../services/bitbucket/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PromiseCallback<T> = (client: IDeskproClient, params: any) => Promise<Pagination<T>>;

const retryUntilHavePagination = <T>(fn: PromiseCallback<T>): PromiseCallback<T> => {
  return (client, params) => {
    let result: T[] = [];
    let nextPage: number | undefined = 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const run: () => Promise<any> = () => {
      return fn(client, {...params, page: nextPage}).then((data) => {
        const values = get(data, ["values"], []) || [];
        result = !values ? result : concat(result, values);
        nextPage = getNextPage(data);

        if (!nextPage) {
          return {values: result};
        }
        return run();
      });
    };

    return run();
  }
};

export { retryUntilHavePagination };
