import { useEffect } from "react";
import { Button, Header, Image, Item, Label, Segment } from "semantic-ui-react";
import { WatchLater } from "../../app/api/watchLater";

interface Props {
    handleWatchLater: () => void;
    removeWatchLater: (sha: string) => void;
    watchLater: WatchLater[]
}

export default function WatchLaterList({ handleWatchLater, removeWatchLater, watchLater }: Props) {
    useEffect(() => {
        handleWatchLater();
    }, [])


    if (watchLater.length === 0) {
        return (
            <>
                <Header>User does not have any items in watch later list.</Header>
            </>
        )
    } else {
        return (
            <Segment>
                <Item.Group divided>
                    {watchLater.map(commitItem => (
                        <Item key={commitItem.sha}>
                            <Item.Content>
                                <Item.Header>{commitItem.message}</Item.Header>
                                <div>{commitItem.created_at}</div>
                                <Item.Description>
                                    <Item.Content verticalAlign='middle'>
                                        <Item.Image size='mini' src='/assets/repositoryIcon.png' />
                                        <Item.Description style={{ display: 'inline-block', marginLeft: '5px' }}>{commitItem.repoName}</Item.Description>
                                    </Item.Content>
                                </Item.Description>
                                <Item.Extra>
                                    <div>Commit Hash: </div>
                                    <Label basic content={commitItem.sha} />
                                    <Button onClick={() => removeWatchLater(commitItem.id)} icon='trash'></Button>
                                </Item.Extra>
                                <Item.Content header>Committer:</Item.Content>
                                <Item.Description>{commitItem.login}</Item.Description>
                                <Item.Image size='small' src={commitItem.avatar_url} />
                            </Item.Content>
                        </Item>
                    ))}
                </Item.Group>
            </Segment>
        )
    }
}