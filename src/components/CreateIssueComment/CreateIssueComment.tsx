import { Container } from "../common";
import { IssueCommentForm } from "../IssueCommentForm";
import type { FC } from "react";
import type { Props as CommentFormProps } from "../IssueCommentForm";

type Props = CommentFormProps;

const CreateIssueComment: FC<Props> = (props) => {
  return (
    <Container>
      <IssueCommentForm {...props} />
    </Container>
  );
};

export { CreateIssueComment };
