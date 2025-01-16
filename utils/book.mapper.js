export function mapBook(bookModel) {
  let bookObject = {
    category: bookModel.category,
    accNo: bookModel.accNo,
    bookTitle: bookModel.bookTitle,
    subTitle: bookModel.subTitle,
    parallelTitle: bookModel.parallelTitle,
    initial: bookModel.initial,
    classNo: bookModel.classNo,
    callNo: bookModel.callNo,
    bookCover: bookModel.bookCover,
    sor: bookModel.sor,
    isbn: bookModel.isbn,
    authorOne: bookModel.authorOne,
    authorTwo: bookModel.authorTwo,
    authorThree: bookModel.authorThree,
    other: bookModel.other,
    translator: bookModel.translator,
    pagination: bookModel.pagination,
    size: bookModel.size,
    illustrationType: bookModel.illustrationType,
    seriesTitle: bookModel.seriesTitle,
    seriesNo: bookModel.seriesNo,
    includeCD: bookModel.includeCD,
    subjectHeadings: bookModel.subjectHeadings,
    edition: bookModel.edition,
    editor: bookModel.editor,
    place: bookModel.place,
    publisher: bookModel.publisher,
    year: bookModel.year,
    keywords: bookModel.keywords,
    summary: bookModel.summary,
    notes: bookModel.notes,
    source: bookModel.source,
    price: bookModel.price,
    donor: bookModel.donor,
    catalogOwner: bookModel.catalogOwner,
    barcode: bookModel.barcode,
    loanStatus: bookModel.loanStatus,
    createdAt: bookModel.createdAt,
    updatedAt: bookModel.updatedAt
  };

  return Object.fromEntries(
    Object.entries(bookObject).filter(([key, value]) => value !== "" && value != null)
  );
}
