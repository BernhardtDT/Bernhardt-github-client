import axios from 'axios';
import moment from 'moment';
import { useState } from 'react';
import 'semantic-ui-css/semantic.min.css'
import { Container } from 'semantic-ui-react';
import CommitList from '../../features/details/CommitList';
import RepositoryDetails from '../../features/details/RepositoryDetails';
import { CommitLineItem, CommitItem } from '../api/commitItem';
import { User } from '../api/user';
import Navbar from './Navbar';
import { db } from '../../firebase-config';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import WatchLaterList from '../../features/watch-later/WatchLaterList';
import { WatchLater } from '../api/watchLater';
import Welcome from '../../features/details/Welcome';
import { Commit } from '../api/commit';

function App() {
  const watchLaterCollectionRef = collection(db, "readlater");

  const [userSearch] = useState<string>(String);
  const [user, setUser] = useState<User>();
  const [commits, setCommits] = useState<Commit[]>();
  const [watchLater, setWatchLater] = useState<WatchLater[]>([]);

  var handleUserSearch = async(userSearch : string) => {
    setUser(undefined);
    setCommits(undefined);
    await axios.get<User>('https://api.github.com/users/' + userSearch, {headers: {Authorization: 'token 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'}})
      .then(userItem => {
        var user: User = {
          login: userItem.data.login,
          url: userItem.data.url,
          avatar_url: userItem.data.avatar_url,
          received_events_url: userItem.data.received_events_url
        };

        setUser(user);

        if(user.login){
          handleCommitSearch(user.login);
        }
    });
  }

  var handleCommitSearch = async(userLogin: string) => {
    await axios.get<CommitItem[]>('https://api.github.com/users/' + userLogin + '/events', {headers: {Authorization: 'token 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'}})
      .then(commitItems => {
        var filteredCommits = commitItems.data.filter(ci => ci.type === 'PushEvent');

        var mappedCommitItems: CommitItem[] = [];

        filteredCommits.forEach(commitItem => {
          var commit: CommitItem = {
            type: commitItem.type,
            created_at: commitItem.created_at,
            repo: {
              name: commitItem.repo.name,
              url: commitItem.repo.url
            },
            actor: {
              avatar_url: commitItem.actor.avatar_url,
              login: commitItem.actor.login
            },
            payload: {
              commits: mapCommitLineItems(commitItem.payload.commits)
            }
          }
          
          mappedCommitItems.push(commit);
        });

        mappedCommitItems.sort((x, y) => (+new Date(x.created_at)) - (+new Date(y.created_at)));
        
        var commits = mapCommits(mappedCommitItems);

        setCommits(commits);
    })
  }

  function mapCommitLineItems(commits: CommitLineItem[]) {
    var mappedCommits: CommitLineItem[] = [];

    commits.forEach(c => {
      var mappedCommit: CommitLineItem = {
          message: c.message,
          sha: c.sha,
          url: c.url
      }
      mappedCommits.push(mappedCommit);
    });

    return mappedCommits;
  }

  function mapCommits(commitItems: CommitItem[]) {
    var mappedCommits : Commit[] = []

    commitItems.forEach(item => {
      item.payload.commits.forEach(line => {
          var mappedCommit : Commit = {
            created_at: item.created_at,
            message: line.message,
            repo_name: item.repo.name,
            repo_url: item.repo.url,
            sha: line.sha,
            url: line.url,
            type: item.type,
            login: item.actor.login,
            avatar_url: item.actor.avatar_url
          }

          mappedCommits.push(mappedCommit);
        })
    })

    return mappedCommits;
  }

  function convertIsoStringToDate(isoString: string) {
    var date = new Date(isoString);

    let formattedDate = (moment(date)).format('DD MMMM YYYY | HH:mm')

    return `${formattedDate}`;
  }

  const createWatchLater = async (commitUrl: string, message: string, sha: string, repoName: string, created_at: string, login: string, avatar_url: string) => {
    await addDoc(watchLaterCollectionRef, { url: commitUrl, message: message, sha: sha, repoName: repoName, created_at: created_at, login: login, avatar_url: avatar_url });
  };

  var handleWatchLater = async() => {
    var watchLaterItems = await getDocs(watchLaterCollectionRef);
    let readLater: WatchLater[] = [];
    watchLaterItems.forEach(watchLaterItem=> {
      var watchLater: WatchLater = {
        id: watchLaterItem.id,
        sha: watchLaterItem.data().sha,
        commitUrl: watchLaterItem.data().commitUrl,
        created_at: watchLaterItem.data().created_at,
        message: watchLaterItem.data().message,
        repoName: watchLaterItem.data().repoName,
        login: watchLaterItem.data().login,
        avatar_url: watchLaterItem.data().avatar_url,
      }

    readLater.push(watchLater);
    })

    setWatchLater(readLater);
  }

  var handleRemoveWatchLater = async(id: string) => {
    const docRef = doc(db, 'readlater', id);
    await deleteDoc(docRef);
    handleWatchLater();
  }

  return (
    <>
      <Router>
      <Navbar search={handleUserSearch} userSearch={userSearch} />
        <Switch>
          <Route path='/' exact>
            <Container style={{ marginTop: '5.4em' }} >
              {!user &&
                <Welcome />}

              {user &&
                <RepositoryDetails user={user} />}
                
              {user && commits &&
                <CommitList commits={commits} convertToDate={convertIsoStringToDate} watchLater={createWatchLater} />}
                
            </Container>
          </Route>
          <Route path='/watch'>
          <Container style={{ marginTop: '5.4em' }} >
              <WatchLaterList handleWatchLater={handleWatchLater} watchLater={watchLater} removeWatchLater={handleRemoveWatchLater} />
              </Container>
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
