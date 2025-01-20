import { Container, NoFound } from '../../components/common';

function AccessTokenErrorPage() {
    return (
        <Container>
            <NoFound text='issue authorising with Bitbucket access token' />
        </Container>
    );
};

export { AccessTokenErrorPage };