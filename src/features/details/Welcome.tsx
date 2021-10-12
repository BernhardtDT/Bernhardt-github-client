import { Card } from "semantic-ui-react";

export default function Welcome() {
    return (
        <Card style={{ textAlign: 'center', width: '100%'}}>
          <Card.Content>
            <Card.Header>Welcome to Bernhardt du Toit's Github Client</Card.Header>
            <Card.Description>How the Github Client Works</Card.Description>
            <Card.Meta textAlign='center'>
              <div>1. Search for a Github user</div>
              <div>2. Select a commit to watch later</div>
              <div>3. Click on the watch later tab</div>
              <div>4. Remove commit when done</div>
              <div>5. Click Github Client to go back</div>
            </Card.Meta>
          </Card.Content>
        </Card>
      )
}