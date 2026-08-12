export interface BookAuthor {
    key: string;
    name: string;
}

export interface Book {
    author_name?: string[];
    authors?: BookAuthor[];
    cover_i?: number;
    cover_id?: number;
    first_publish_year?: number;
    key: string;
    title: string;
}

export interface BookDetails {
    key: string;
    title: string;
    description?: string | { value: string };
    covers?: number[];
    subjects?: string[];
}


export interface SubjectsApiResponse {
    name?: string;
    work_count?: number;
    works: Book[];
}
