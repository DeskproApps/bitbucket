import { getFilteredIssues, generateEntityId } from "../../utils";
import { LinkIssues } from "../../components";
import { setEntityService } from "../../services/deskpro";
import { Settings, TicketData } from "../../types";
import { useDeskproAppClient, useDeskproElements, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { useLinkedAutoComment, useReplyBox, useSetTitle } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { useSearchIssues } from "./hooks";
import { useState, useCallback, useEffect } from "react";
import type { FC } from "react";
import type { Repository, Issue } from "../../services/bitbucket/types";

const LinkPage: FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIssues, setSelectedIssues] = useState<Issue[]>([]);
  const [selectedRepository, setSelectedRepository] = useState<Repository["full_name"] | "">("");

  const { addLinkComment } = useLinkedAutoComment();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext<TicketData, Settings>();
  const {
    repositories,
    issues,
    isLoading,
    error: issuesError,
  } = useSearchIssues(selectedRepository);
  const { setSelectionState } = useReplyBox();

  const navigate = useNavigate();

  const ticketId = context?.data?.ticket.id;

  const onChangeSearch = useCallback((search: string) => {
    setSearchQuery(search);
  }, []);

  const onChangeSelectedIssue = useCallback(
    (issue: Issue) => {
      let newSelectedIssues = structuredClone(selectedIssues);

      if (
        selectedIssues.some(
          (selectedIssue) =>
            generateEntityId(issue) === generateEntityId(selectedIssue)
        )
      ) {
        newSelectedIssues = selectedIssues.filter((selectedIssue) => {
          return generateEntityId(selectedIssue) !== generateEntityId(issue);
        });
      } else {
        newSelectedIssues.push(issue);
      }

      setSelectedIssues(newSelectedIssues);
    },
    [selectedIssues]
  );

  const onCancel = useCallback(() => navigate("/home"), [navigate]);

  const onNavigateToCreate = useCallback(
    () => navigate("/issue/create"),
    [navigate]
  );

  const onLinkIssues = useCallback(() => {
    if (!client || !ticketId || selectedIssues.length < 1) {
      return;
    }

    setIsSubmitting(true);

    return Promise.all([
      ...selectedIssues.map((issue) => {
        const issueData = generateEntityId(issue);
        return !issueData
          ? Promise.resolve()
          : setEntityService(client, ticketId, issueData);
      }),
      ...selectedIssues.map((issue) => addLinkComment(issue)),
      ...selectedIssues.map((issue) => setSelectionState(issue, true, "email")),
      ...selectedIssues.map((issue) => setSelectionState(issue, true, "note")),
    ])
      .then(() => {
        setIsSubmitting(false);
        navigate("/home");
      })
      .catch(() => {});
  }, [
    client,
    navigate,
    selectedIssues,
    ticketId,
    addLinkComment,
    setSelectionState,
  ]);

  useSetTitle("Link Issues");

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
  });

  // At the beginning, we choose the first repository
  useEffect(() => {
    setSelectedRepository(repositories[0]?.full_name ?? "");
  }, [repositories]);

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
      onNavigateToCreate={onNavigateToCreate}
      error={{ general: issuesError }}
    />
  );
};

export { LinkPage };
