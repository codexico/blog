export type Comment = {
    id: string;
    author: string;
    email: string | null;
    date: string;
    content: string;
    approved: string;
    parent: string;
};

export type CommentPost = {
    title: string;
    name: string;
    link: string;
    comments: Comment[];
};

export type CommentList = Record<string, CommentPost>;
