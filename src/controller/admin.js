const profileRepository = require('./../repository/profile')
const { sequelize } = require('./../model')
const HttpStatus = require('http-status');

module.exports = {
  async getBestProfession(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const query = req.query;
      query.limit = query.limit || 2;
      let { start, end ,} = query
      let scopes = [
        'attribute',
        { method: ['type', 'contractor'] },
        { method: ['isJobPaidContractor', true, new Date(start), new Date(end)] }
      ]
      const group = ['profession']
      const order =  [ [sequelize.col("total"), "DESC"] ]
      const result = await profileRepository.getAllProfile(
        query,
        {
          scopes,
          group,
          order,
          transaction,
        }
      )
      await transaction.commit();
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: "BEST_PROFESSION",
      });
    } catch (error) {
      await transaction.rollback();
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: error,
        message: "INTERNAL_SERVER_ERROR",
      });
    }
    
  },
  async getBestClient(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const query = req.query;
      query.limit = query.limit || 2;
      let scopes = [
        'attribute',
        { method: ['type', 'client'] },
        { method: ['isJobPaidClient', true, query.start, query.end] }
      ]
      const group = ['Profile.id']
      const order = [ [sequelize.col("total"), "DESC"] ]
      const result = await profileRepository.getAllProfile(
        query,
        {
          scopes,
          group,
          order,
          transaction,
        }
      )
      await transaction.commit();
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: "BEST_CLIENTS",
      });
    } catch (error) {
      await transaction.rollback();
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: error,
        message: "INTERNAL_SERVER_ERROR",
      });
    }
    
  },
}
