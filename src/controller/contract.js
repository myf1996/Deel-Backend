const contractRepository = require('./../repository/contract')
const { sequelize } = require('./../model')
const HttpStatus = require('http-status');

module.exports = {
  async getAllNonTerminatedContract(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      let query = req.query
      let scopes = [
        'client',
        'contractor',
        { method: ['isNotStatus', 'terminated'] }
      ]
      if (req.profile.type === 'client'){
        scopes.push({ method: ['byClinetId', req.profile.id] })
      } else {
        scopes.push({ method: ['byContractorId', req.profile.id] })
      }
      const result = await contractRepository.getAllContract(
        query,
        {
          scopes,
          transaction,
        }
      )
      await transaction.commit();
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: "ALL_NON_TERMINATED_CONTRACT",
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
  async getContractbyId(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      let query = req.query
      let { id } = req.params;
      let scopes = [
        'client',
        'contractor',
        { method: ['byId', id] }
      ]
      if (req.profile.type === 'client'){
        scopes.push({ method: ['byClinetId', req.profile.id] })
      } else {
        scopes.push({ method: ['byContractorId', req.profile.id] })
      }
      const result = await contractRepository.getContractbyId(
        query,
        {
          scopes,
          transaction,
        }
      )
      if(result){
        await transaction.commit();
        res.status(HttpStatus.OK).json({
          success: true,
          data: result,
          message: "GET_CONTRACT_BY_ID",
        });
      }else {
        await transaction.rollback();
        res.status(HttpStatus.NOT_FOUND).json({
          success: true,
          message: "CONTRACT_NOT_FOUND",
        });
      }
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
