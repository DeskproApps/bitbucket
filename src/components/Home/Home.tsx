import { Fragment } from "react";
import size from "lodash/size";
import { HorizontalDivider } from "@deskpro/app-sdk";
import { Container, NoFound } from "../common";
import { IssueItem } from "../IssueItem";
import type { FC } from "react";
import type { Issue } from "../../services/bitbucket/types";

type Props = {
  issues: Issue[],
}

const Home: FC<Props> = ({ issues }) => {
  return (
    <Container>
      {!Array.isArray(issues)
        ? <NoFound/>
        : !size(issues)
        ? <NoFound text="No Bitbucket issues found"/>
        : issues.map((issue) => (
          <Fragment key={issue.id}>
            <IssueItem issue={issue} />
            <HorizontalDivider style={{ margin: "10px 0" }}/>
          </Fragment>
        ))
      }
    </Container>
  );
};

export { Home };
