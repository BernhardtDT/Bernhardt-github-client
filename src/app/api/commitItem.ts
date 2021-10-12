export interface CommitItem {
    type: string;
    created_at: string;
    repo: Repo
    actor: Actor
    payload: Payload
}

interface Repo {
    name: string;
    url: string
}

interface Actor {
    login: string;
    avatar_url: string
}

interface Payload {
    commits: CommitLineItem[]
}

export interface CommitLineItem {
    sha: string;
    url: string;
    message: string;
}


