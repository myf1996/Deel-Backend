const profileRepository = require('./../repository/profile')
const jobRepository = require('./../repository/job')
const HttpStatus = require('http-status')
const { sequelize } = require('./../model')

module.exports = {
  async balanceDeposit(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      let query = req.query
      let { userId } = req.params
      let { depositAmmout } = req.body;
      let scopes = [
        { method: ['byId', userId] },
        { method: ['type', 'client'] }
      ]
      const clientProfile = await profileRepository.getProfilebyId(
        query,
        {
          scopes,
          transaction,
        }
      )
      if(clientProfile){
        let jobScopes = [
          'attribute',
          'contract',
          { method: ['paid', null] },
          { method: ['contractStatus', 'in_progress'] },
          { method: ['contractClientId', clientProfile.id] }
        ]
        const clientJob = await jobRepository.getAllJob(query, {
          scopes: jobScopes,
          transaction,
        })
        const totalJobPrice = clientJob?.rows[0]?.dataValues?.total
        if(totalJobPrice){
          const maxDepositLimit = totalJobPrice * 0.25;
          if (depositAmmout > maxDepositLimit) {
            await transaction.rollback();
            return res.status(HttpStatus.BAD_REQUEST).json({
              success: true,
              message: "DEPOSIT_AMOUNT_EXCCEDING_TO_IT_LIMIT",
            });
          } 
          let newBalance = clientProfile.balance + depositAmmout
          await profileRepository.updateProfilebyId(clientProfile.id, {}, {
            balance: newBalance,
          }, {transaction})
          const result = await profileRepository.getProfilebyId(
            query,
            {
              scopes,
              transaction,
            }
          )
          await transaction.commit();
          return res.status(HttpStatus.OK).json({
            success: true,
            data: result,
            message: "BALANCE_DEPOSITE",
          });
        }else {
          await transaction.rollback();
          return res.status(HttpStatus.NOT_FOUND).json({
            success: true,
            message: "JOB_PRICES_NOT_FOUND",
          });
        }
      } else {
        await transaction.rollback();
        res.status(HttpStatus.NOT_FOUND).json({
          success: true,
          message: "CLIENT_NOT_FOUND",
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
