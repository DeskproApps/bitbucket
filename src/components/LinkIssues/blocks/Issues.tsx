import { Fragment } from "react";
import size from "lodash/size";
import { Checkbox } from "@deskpro/deskpro-ui";
import { LoadingSpinner, HorizontalDivider } from "@deskpro/app-sdk";
import { generateEntityId } from "../../../utils";
import { IssueItem } from "../../IssueItem";
import { NoFound, Card } from "../../common";
import type { FC } from "react";
import type { Issue } from "../../../services/bitbucket/types";

type Props = {
  issues: Issue[],
  isLoading: boolean,
  selectedIssues: Issue[],
  onChangeSelectedIssue: (issue: Issue) => void,
};

const Issues: FC<Props> = ({
  issues,
  isLoading,
  selectedIssues,
  onChangeSelectedIssue,
}) => {
  return isLoading
    ? (<LoadingSpinner/>)
    : (
      <>
        {!Array.isArray(issues)
          ? <NoFound/>
          : !size(issues)
          ? <NoFound text="No Bitbucket issues found"/>
          : issues.map((issue) => (
              <Fragment key={issue.id}>
                <Card>
                  <Card.Media>
                    <Checkbox
                      size={12}
                      checked={selectedIssues.some((selectedIssue) => {
                        return generateEntityId(issue) === generateEntityId(selectedIssue);
                      })}
                      onChange={() => onChangeSelectedIssue(issue)}
                      containerStyle={{ marginTop: 4 }}
                    />
                  </Card.Media>
                  <Card.Body>
                    <IssueItem
                      issue={issue}
                      onClickTitle={() => onChangeSelectedIssue(issue)}
                    />
                  </Card.Body>
                </Card>
                <HorizontalDivider style={{ marginBottom: 6 }} />
              </Fragment>
            ))
        }
      </>
    );
};

export { Issues };
