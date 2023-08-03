import { Fragment } from "react";
import size from "lodash/size";
import { HorizontalDivider } from "@deskpro/app-sdk";
import { generateEntityId } from "../../utils";
import { Container, NoFound } from "../common";
import { IssueItem } from "../IssueItem";
import type { FC } from "react";
import type { Issue, Repository } from "../../services/bitbucket/types";

type Props = {
  issues: Issue[],
  onNavigateToIssue: (issueId: Issue["id"], fullName: Repository["full_name"]) => void,
}

const Home: FC<Props> = ({ issues, onNavigateToIssue }) => {
  return (
    <Container>
      {!Array.isArray(issues)
        ? <NoFound/>
        : !size(issues)
        ? <NoFound text="No Bitbucket issues found"/>
        : issues.map((issue) => (
          <Fragment key={generateEntityId(issue) as string}>
            <IssueItem
                issue={issue}
                onClickTitle={() => onNavigateToIssue(issue.id, issue.repository.full_name)}
            />
            <HorizontalDivider style={{ margin: "10px 0" }}/>
          </Fragment>
        ))
      }
    </Container>
  );
};

export { Home };
