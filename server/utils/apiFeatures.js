/* eslint-disable*/
class APIFeatures {
  constructor(query, queryString) {
    this.query = query; //Tour Model.find({})
    this.queryString = queryString; //req.query
  }
  //?duration[gte]=5&difficulty=easy&page=2&limit=5&sort=-price,ratingAverage,maxGroupSize
  filter() {
    //?duration=5&difficulty=easy
    const queryObj = { ...this.queryString };
    const excludedField = ["page", "sort", "limit", "fields"];
    excludedField.forEach((el) => delete queryObj[el]);
    //make sure that it is only containing difficulty and price,...(having in model, or DB). otherwise it will return no DB

    //1. B. query advanced filtering
    const queryInput = JSON.stringify(queryObj);
    const queryStr = queryInput.replace(
      //replace for string method, convert JSON Obj to string
      /\b(gte|gt|lt|lte)\b/g, //b for exactly the words, g for global search , i for regardless of lowercase or uppercase
      (match) => `$${match}`
    );
    // const queryFormat = new RegExp(queryStr, "i");
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    //?sort=-price,duration (decrease price, and increase duration)
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      // console.log(sortBy);
      this.query = this.query.sort(sortBy);
      //sort("price ratingAverage")
    } else {
      this.query = this.query.sort("-createdAt"); //newest got first
    }
    return this;
  }
  limit() {
    //?fields=-duration,-difficulty,-price,-description
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
      //select("price duration difficulty")
      //-price = excluded price on the search
      //price = + price = included
    } else {
      this.query = this.query.select("-_v");
      // not to select the _V fields in the Doc
    }
    return this;
  }
  paginate() {
    //?page=2&limit=5
    const page = this.queryString.page * 1 || 1; //*1 => convert string to a number
    const limit = this.queryString.limit * 1 || 100;
    // console.log(page + limit);
    const skip = (page - 1) * limit;
    //skip(skip at the x result, it means start at (x+1) result)
    //result=100, page=2, limit=10, skip(20) => result running from 21-30 = (page 3 -1)*limit
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
export default APIFeatures;
