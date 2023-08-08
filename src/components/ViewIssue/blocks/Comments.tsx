import { Fragment } from "react";
import get from "lodash/get";
import size from "lodash/size";
import { Title, HorizontalDivider } from "@deskpro/app-sdk";
import { Container, Comment, Content } from "../../common";
import type { FC } from "react";
import type { Comment as CommentType } from "../../../services/bitbucket/types";

type Props = {
  comments: CommentType[],
  onNavigateToAddComment: () => void,
};

const Comments: FC<Props> = ({ comments, onNavigateToAddComment }) => {
  return (
    <Container>
      <Title
        title={`Comments (${size(comments)})`}
        onClick={onNavigateToAddComment}
      />
      {comments.map(({ id, user, created_on, content }) => (
        <Fragment key={id}>
          <Comment
            name={user.display_name}
            date={new Date(created_on)}
            avatarUrl={get(user, ["links", "avatar", "href"]) || ""}
            text={<Content content={content} />}
          />
          <HorizontalDivider style={{ marginBottom: 10 }} />
        </Fragment>
      ))}
    </Container>
  );
};

export { Comments };
