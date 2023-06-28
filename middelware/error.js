exports.err = (error, req, res, next) => {
  console.log(error);
  if (error.httpStatusCode === 500) {
    return res.render("500");
  } else if (error.httpStatusCode === 401) {
    return res.render("401");
  }
  return res.render("404");
};
