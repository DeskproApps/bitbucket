import { Container, Search, Navigation, ErrorBlock } from "../common";
import { Filters, Buttons, Issues } from "./blocks";
import { HorizontalDivider } from "@deskpro/app-sdk";
import type { FC, Dispatch } from "react";
import type { Maybe } from "../../types";
import type { Repository, Issue } from "../../services/bitbucket/types";

type Props = {
  isLoading: boolean;
  onChangeSearch?: (search: string) => void;
  repositories: Repository[];
  selectedRepository: Maybe<Repository["full_name"]>;
  onChangeRepository: Dispatch<Repository["full_name"]>;
  onCancel: () => void;
  onLinkIssues: () => void;
  isSubmitting: boolean;
  selectedIssues: Issue[];
  issues: Issue[];
  onChangeSelectedIssue: (issue: Issue) => void;
  onNavigateToCreate: () => void;
  error?: {
    general?: string;
  };
};

const LinkIssues: FC<Props> = ({
  error,
  isLoading,
  isSubmitting,
  issues,
  onCancel,
  onChangeRepository,
  onChangeSearch,
  onChangeSelectedIssue,
  onLinkIssues,
  onNavigateToCreate,
  repositories,
  selectedIssues,
  selectedRepository,
}) => {
  return (
    <>
      <Container>
        {error && error.general && <ErrorBlock text={error.general} />}

        <Navigation selected="one" onTwoNavigate={onNavigateToCreate} />
        <Search onChange={onChangeSearch} />
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

      <HorizontalDivider />

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
