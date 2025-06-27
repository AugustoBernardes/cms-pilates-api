export const paginationUtil = ({page, page_size}) => {
    const parsedPage = Number(page) || 1;
    const parsedPageSize = Number(page_size) || 10;


    const skip = (parsedPage - 1) * parsedPageSize;

    return {        
        skip,
        take: parsedPageSize,
        page: parsedPage,
        page_size: parsedPageSize
    };
}