import { ChangeEvent, useEffect, useState } from "react";
import { Button, Item, Label, Segment, Header, Input } from "semantic-ui-react";
import { Commit } from "../../app/api/commit";

interface Props {
    commits: Commit[];
    convertToDate: (date: string) => string;
    watchLater: (commitUrl: string, message: string, sha: string, repoName: string, created_at: string, login: string, avatar_url: string) => void;
}

export default function CommitList({ commits, convertToDate, watchLater }: Props) {

    const [searchField, setSearchField] = useState('');
    const [filtedCommits, setCommits] = useState<Commit[]>(commits)

    useEffect(() => {
        setCommits(commits);
    }, []);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        var search = event.target.value;
        setSearchField(event.target.value);

        if (search === '') {
            setCommits(commits);
        } else {
            var filteredCommits = commits.filter(x => x.message.toLowerCase().includes(search.toLowerCase()));
            setCommits(filteredCommits);
        }
      };

    if (commits.length === 0) {
        return (
            <>
                <Header style={{ display: 'inline-block', marginTop: '0', position: 'absolute', marginLeft: '15px' }}>User does not have any recent commits</Header>
            </>
        )
    } else {
        return (
            <Segment style={{ display: 'inline-block', marginTop: '0', position: 'absolute', marginLeft: '15px', width: '43%' }}>
                <Item.Group divided>

                    <Input onChange={onChange} value={searchField} style={{marginBottom: '1em'}} placeholder='Search message...' />
                    {filtedCommits.map(commitItem => (
                            <Item key={commitItem.sha}>
                                <Item.Content>
                                    <Item.Header>{commitItem.message}</Item.Header>
                                    <div>{convertToDate(commitItem.created_at)}</div>
                                    <Item.Description>
                                        <Item.Content verticalAlign='middle'>
                                            <Item.Image size='mini' src='/assets/repositoryIcon.png' />
                                            <Item.Description style={{ display: 'inline-block', marginLeft: '5px' }}>{commitItem.repo_name}</Item.Description>
                                        </Item.Content>
                                    </Item.Description>
                                    <Item.Extra>
                                        <div>Commit Hash: </div>
                                        <Label basic content={commitItem.sha} />
                                        <Button onClick={() => watchLater(commitItem.url, commitItem.message, commitItem.sha, commitItem.repo_name, convertToDate(commitItem.created_at), commitItem.login, commitItem.avatar_url)} content='Watch Later' color='blue' />
                                    </Item.Extra>
                                </Item.Content>
                            </Item>))
                    }
                </Item.Group>
            </Segment>
        )
    }
}