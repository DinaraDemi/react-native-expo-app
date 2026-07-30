export interface BookAuthor {
    key: string;
    name: string;
}

export interface Book {
    author_key?: string[];
    author_name?: string[];
    authors?: BookAuthor[];
    cover_i?: number;
    cover_id?: number;
    ebook_access?: string;
    edition_count?: number;
    first_publish_year?: number;
    has_fulltext?: boolean;
    ia?: string[];
    ia_collection?: string[];
    key: string;
    language?: string[];
    public_scan_b?: boolean;
    title: string;
}


export interface BookApiResponse {
    numFound: number;
    start: number;
    numFoundExact: boolean;
    docs: Book[];
}
