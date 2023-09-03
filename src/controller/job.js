const jobRepository = require('./../repository/job')
const profileRepository = require('./../repository/profile')
const HttpStatus = require('http-status')
const { sequelize } = require('./../model')

module.exports = {
  async getAllUnpaidJob(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      let query = req.query
      let scopes = [
        'contract',
        { method: ['paid', null] },
        { method: ['contractStatus', 'in_progress'] },
      ]
      if (req.profile.type === 'client'){
        scopes.push({ method: ['contractClientId', req.profile.id] })
      } else {
        scopes.push({ method: ['contractContractorId', req.profile.id] })
      }
      const result = await jobRepository.getAllJob(
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
        message: "ALL_UNPAID_JOB",
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
  async JobPaidbyId(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      if(req.profile.type === 'contractor'){
        return res.status(HttpStatus.FORBIDDEN).json({
          success: true,
          message: "PERMISSION_DENIED_ONLY_CLIENT_CAN_ACCESS",
        });
      }
      let query = req.query
      let { job_id } = req.params;
      let scopes = [
        'contract',
        { method: ['byId', job_id] },
        { method: ['contractClientId', req.profile.id] }
      ]
      const result = await jobRepository.getJobbyId(
        query,
        {
          scopes,
          transaction,
        }
      )
      if (result) {
        if(result.paid) {
          await transaction.rollback();
          res.status(HttpStatus.BAD_REQUEST).json({
            success: true,
            // data: result,
            message: "JOB_ALREADY_PAID",
          });
        } else {
          if(req.profile.balance < result.price){
            res.status(HttpStatus.BAD_REQUEST).json({
              success: true,
              // data: result,
              message: "INSUFFICENT_BALANCE",
            });
          } else {
            const contractor = await profileRepository.getProfilebyId({},{
              scopes: [{ method: ['byId', result.Contract.ContractorId] }],
              transaction
            })
            let newBalance = req.profile.balance - result.price
            await profileRepository.updateProfilebyId(req.profile.id, {}, {
              balance: newBalance,
            }, {transaction})

            await profileRepository.updateProfilebyId(contractor.id, {}, {
              balance: contractor.balance + result.price,
            }, {transaction})
            await jobRepository.updateJobbyId(result.id, {}, {
              paid: true,
              paymentDate: new Date(),
            }, {transaction})
            const re = await jobRepository.getJobbyId(
              query,
              {
                scopes: [{ method: ['byId', result.id]} ],
                transaction,
              }
            )
            await transaction.commit();
            res.status(HttpStatus.OK).json({
              success: true,
              data: re,
              message: "JOB_PAID",
            });
          }
        }
        
      } else {
        await transaction.rollback();
        res.status(HttpStatus.NOT_FOUND).json({
          success: true,
          message: "JOB_NOT_FOUND",
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
