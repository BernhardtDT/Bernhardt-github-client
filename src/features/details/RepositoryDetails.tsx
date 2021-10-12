import { Card, Image } from "semantic-ui-react";
import { User } from "../../app/api/user";

interface Props {
  user: User;
}

export default function RepositoryDetails({ user }: Props) {

  return (
    <Card style={{ display: 'inline-block' }}>
      <Image src={user.avatar_url} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{user.login}</Card.Header>
        <Card.Meta>
          <span className='date'>{user.url}</span>
        </Card.Meta>
      </Card.Content>
    </Card>
  )
}