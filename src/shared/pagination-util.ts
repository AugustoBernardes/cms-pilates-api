export const paginationUtil = ({page = 1, page_size = 10}) => {
    const parsedPage = Number(page);
    const parsedPageSize = Number(page_size);

    if (isNaN(parsedPage) || parsedPage < 1) {
        throw new Error('Invalid page number');
    }
    const skip = (parsedPage - 1) * parsedPageSize;

    return {        
        skip,
        take: parsedPageSize,
        page: parsedPage,
    };
}