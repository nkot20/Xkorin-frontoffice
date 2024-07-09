export interface Pagination {
    hasNextPage: boolean,
    hasPrevPage: boolean,
    limit: number,
    nextPage: number,
    page: number,
    pagingCounter: number,
    prevPage: boolean,
    totalDocs: number,
    totalPages: number,
}
