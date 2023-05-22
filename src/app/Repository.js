const {getPaginatedRecords} = require ('../_helpers/paginate');

class Repository {
  constructor (Model) {
    this.Model = Model;
  }

  getModel () {
    return this.Model;
  }

  create (obj) {
    return this.Model.create (obj);
  }

  findById (id) {
    return this.Model.findById (id);
  }

  findOne (condition = {}) {
    return this.Model.findOne (
      condition);
  }

  all (limit, page, data, selectedFields) {
    return getPaginatedRecords (this.Model, {
      limit: limit,
      page: page,
      data,
      selectedFields,
    });
  }

  count (condition, callback) {
    if (condition) {
      return this.Model.where (condition).count (callback);
    }
    return this.Model.count ();
  }

  delete (condition) {
    return this.Model.deleteMany (
      condition,
    );
  }

  update (condition, update) {
    return this.Model.findOneAndUpdate (condition, update, {
      new: true,
      lean: true,
    });
  }
}

module.exports = Repository;
