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
    subjectOne: bookModel.subjectOne,
    subjectTwo: bookModel.subjectTwo,
    subjectThree: bookModel.subjectThree,
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

export function mapMember(memberModel) {
  let memberObject = {
    memberType: memberModel.memberType,
    grade: memberModel.grade,
    personalId: memberModel.personalId,
    memberId: memberModel.memberId,
    name: memberModel.name,
    nrc: memberModel.nrc,
    gender: memberModel.gender,
    phone: memberModel.phone,
    email: memberModel.email,
    permanentAddress: memberModel.permanentAddress,
    currentAddress: memberModel.currentAddress,
    photo: memberModel.photo,
    issueDate: memberModel.issueDate,
    extendDate: memberModel.extendDate,
    expiryDate: memberModel.expiryDate,
    note: memberModel.note,
    block: memberModel.block,
    barcode: memberModel.barcode,
    loanBooks: memberModel.loanBooks,
    createdAt: memberModel.createdAt,
    updatedAt: memberModel.updatedAt
  };

  return Object.fromEntries(
    Object.entries(memberObject).filter(([key, value]) => value !== "" && value != null)
  );
}
