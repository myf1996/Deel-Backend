const { Job } = require("../model");


module.exports = {
  async getAllJob(query, options = {}) {
    const { scopes = [], transaction } = options;
    const limit = query.limit || 10
    const offset = query.offset || 0
    const order = options.order || [['id', 'DESC']];
    return await Job.scope(scopes).findAndCountAll({
      order,
      limit,
      offset,
      transaction,
    })
  },
  async getJobbyId(query, options = {}) {
    const { scopes = [], transaction } = options;
    return await Job.scope(scopes).findOne({transaction})
  },
  async updateJobbyId(id, query, dto, options = {}){
    const { transaction } = options;
    return await Job.update(dto, {
      where: {
        id
      },
      transaction
    })
  }
}
