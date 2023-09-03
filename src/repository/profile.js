const models = require('./../model');
const Sequelize = require('sequelize');

const {
  Contract,
  Job,
  Profile,
  sequelize,
} = models;
const { Op } = Sequelize;

module.exports = {
  async getAllProfile(query, options = {}) {
    const { scopes = [], transaction } = options;
    const limit = query.limit || 10
    const offset = query.offset || 0
    const order = options.order || [['id', 'DESC']];
    const group = options.group || ['Profile.id']
    
    return await Profile.scope(scopes).findAll({
      group,
      order,
      limit,
      offset,
      subQuery: false,
      transaction
    })
  },
  async getProfilebyId(query, options = {}) {
    const { scopes = [], transaction } = options;
    return await Profile.scope(scopes).findOne({transaction})
  },
  async updateProfilebyId(id, query, dto, options = {}){
    const { transaction } = options;
    return await Profile.update(dto, {
      where: {
        id
      },
      transaction
    })
  }
}
