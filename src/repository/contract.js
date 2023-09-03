const { Contract } = require("../model");
// const { Contract } = require("./../scopes/contract")



module.exports = {
  async getAllContract(query, options = {}) {
    const { scopes = [], transaction } = options;
    const limit = query.limit || 10
    const offset = query.offset || 0
    const order = options.order || [['id', 'DESC']];
    return await Contract.scope(scopes).findAndCountAll({
      order,
      limit,
      offset,
      transaction
    })
  },
  async getContractbyId(query, options = {}) {
    const { scopes = [], transaction } = options;
    return await Contract.scope(scopes).findOne({transaction})
  },
}
