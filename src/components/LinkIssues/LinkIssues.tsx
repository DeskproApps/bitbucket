import { HorizontalDivider } from "@deskpro/app-sdk";
import { Container, Search, Navigation } from "../common";
import { Filters, Buttons, Issues } from "./blocks";
import type { FC, Dispatch } from "react";
import type { Maybe } from "../../types";
import type { Repository, Issue } from "../../services/bitbucket/types";

type Props = {
  isLoading: boolean,
  onChangeSearch?: (search: string) => void,
  repositories: Repository[],
  selectedRepository: Maybe<Repository["full_name"]>,
  onChangeRepository: Dispatch<Repository["full_name"]>,
  onCancel: () => void,
  onLinkIssues: () => void,
  isSubmitting: boolean,
  selectedIssues: Issue[],
  issues: Issue[],
  onChangeSelectedIssue: (issue: Issue) => void,
  onNavigateToCreate: () => void,
};

const LinkIssues: FC<Props> = ({
  issues,
  onCancel,
  isLoading,
  repositories,
  onLinkIssues,
  isSubmitting,
  onChangeSearch,
  selectedIssues,
  onChangeRepository,
  selectedRepository,
  onNavigateToCreate,
  onChangeSelectedIssue,
}) => {
  return (
    <>
      <Container>
        <Navigation selected="one" onTwoNavigate={onNavigateToCreate} />
        <Search onChange={onChangeSearch}/>
        <Filters
          repositories={repositories}
          onChangeRepository={onChangeRepository}
          selectedRepository={selectedRepository}
        />
        <Buttons
          onCancel={onCancel}
          onLinkIssues={onLinkIssues}
          isSubmitting={isSubmitting}
          selectedIssues={selectedIssues}
        />
      </Container>

      <HorizontalDivider/>

      <Container>
        <Issues
          issues={issues}
          isLoading={isLoading}
          selectedIssues={selectedIssues}
          onChangeSelectedIssue={onChangeSelectedIssue}
        />
      </Container>
    </>
  );
};

export { LinkIssues };
