import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import get from "lodash/get";
import size from "lodash/size";
import cloneDeep from "lodash/cloneDeep";
import {
  useDeskproElements,
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useSetTitle, useAsyncError } from "../../hooks";
import { useSearchIssues } from "./hooks";
import { setEntityService } from "../../services/deskpro";
import { getFilteredIssues } from "../../utils";
import { LinkIssues } from "../../components";
import type { FC } from "react";
import type { TicketContext } from "../../types";
import type { Repository, Issue } from "../../services/bitbucket/types";

const LinkPage: FC = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const { asyncErrorHandler } = useAsyncError();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRepository, setSelectedRepository] = useState<Repository["full_name"]|"">("");
  const [selectedIssues, setSelectedIssues] = useState<Issue[]>([]);
  const { repositories, issues, isLoading } = useSearchIssues(selectedRepository);
  const ticketId = get(context, ["data", "ticket", "id"]);

  const onChangeSearch = useCallback((search: string) => {
    setSearchQuery(search);
  }, []);

  const onChangeSelectedIssue = useCallback((issue: Issue) => {
    let newSelectedIssues = cloneDeep(selectedIssues);

    if (selectedIssues.some(({ id }) => issue.id === id)) {
      newSelectedIssues = selectedIssues.filter((selectedIssue) => selectedIssue.id !== issue.id);
    } else {
      newSelectedIssues.push(issue);
    }

    setSelectedIssues(newSelectedIssues);
  }, [selectedIssues]);

  const onLinkIssues = useCallback(() => {
    if (!client || !ticketId || !size(selectedIssues)) {
      return;
    }

    setIsSubmitting(true);

    return Promise.all([
      ...selectedIssues.map((issue) => setEntityService(client, ticketId, `${issue.id}`)),
    ])
      .then(() => {
        setIsSubmitting(false);
        navigate("/home");
      })
      .catch(asyncErrorHandler);
  }, [client, navigate, asyncErrorHandler, selectedIssues, ticketId]);

  useSetTitle("Link Issues");

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("refresh", {type: "refresh_button"});
    registerElement("home", {
      type: "home_button",
      payload: {type: "changePage", path: "/home"},
    });
  });

  const onCancel = useCallback(() => navigate("/home"), [navigate]);

  return (
    <LinkIssues
      isLoading={isLoading}
      onChangeSearch={onChangeSearch}
      repositories={repositories}
      selectedRepository={selectedRepository}
      onChangeRepository={setSelectedRepository}
      onCancel={onCancel}
      onLinkIssues={onLinkIssues}
      isSubmitting={isSubmitting}
      selectedIssues={selectedIssues}
      issues={getFilteredIssues(issues, { query: searchQuery })}
      onChangeSelectedIssue={onChangeSelectedIssue}
    />
  );
};

export { LinkPage };
