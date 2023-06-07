type PaginationType = {
  rpp: number;
  page: number;
  total: number;
};

export const handleErrMsg = (e: unknown) => {
  let err = String(e);
  if (e instanceof Error) err = e.message;
  return err;
};

export const pagination = (obj: PaginationType) => {
  const totalPages = Math.ceil(obj.total / obj.rpp);
  const nextPage = obj.page >= totalPages ? null : obj.page + 1;

  return {
    rpp: obj.rpp,
    currentPage: obj.page,
    nextPage,
    totalPages,
  };
};
