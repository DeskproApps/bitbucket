import { Container, Navigation } from "../common";
import { IssueForm } from "../IssueForm";
import type { FC } from "react";
import type { Props as FormProps } from "../IssueForm";

type Props = FormProps & {
  onNavigateToLink: () => void,
};

const CreateIssue: FC<Props> = ({
  error,
  onSubmit,
  onCancel,
  onNavigateToLink,
}) => {
  return (
    <Container>
      <Navigation selected="two" onOneNavigate={onNavigateToLink} />
      <IssueForm error={error} onSubmit={onSubmit} onCancel={onCancel}/>
    </Container>
  );
};

export { CreateIssue };
