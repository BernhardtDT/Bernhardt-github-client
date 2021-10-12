import { ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Input, Menu } from 'semantic-ui-react';

interface Props {
    userSearch: string;
    search: (repositoryUrl: string) => void;
}

export default function Navbar({ userSearch: user, search }: Props) {

    const [userSearch, setUser] = useState(user);

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        var value = event.target.value;
        setUser(value);
    }

    function handleSubmit() {
        search(userSearch);
    }

    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src='/assets/githublogo.png' alt='logo' style={{ marginRight: '10px' }} />
                    <Link to='/'>
                        Github Client
                    </Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to='/watch'>
                        <Button positive content='Watch Later' />
                    </Link>
                </Menu.Item>
                <Menu.Item>
                    <Menu.Item name='User Search' />
                    <Input value={userSearch} name='repositoryUrl' onChange={handleInputChange} focus placeholder='Search user...' />
                    <Button onClick={handleSubmit} icon='search' />
                </Menu.Item>
            </Container>
        </Menu>
    )
}