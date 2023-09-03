const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite3'
});
const { Op } = Sequelize;

class Profile extends Sequelize.Model {}
Profile.init(
  {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    profession: {
      type: Sequelize.STRING,
      allowNull: false
    },
    balance:{
      type:Sequelize.DECIMAL(12,2)
    },
    type: {
      type: Sequelize.ENUM('client', 'contractor')
    }
  },
  {
    sequelize,
    modelName: 'Profile'
  }
);

class Contract extends Sequelize.Model {}
Contract.init(
  {
    terms: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    status:{
      type: Sequelize.ENUM('new','in_progress','terminated')
    }
  },
  {
    sequelize,
    modelName: 'Contract'
  }
);

class Job extends Sequelize.Model {}
Job.init(
  {
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    price:{
      type: Sequelize.DECIMAL(12,2),
      allowNull: false
    },
    paid: {
      type: Sequelize.BOOLEAN,
      default:false
    },
    paymentDate:{
      type: Sequelize.DATE
    }
  },
  {
    sequelize,
    modelName: 'Job'
  }
);

Profile.hasMany(Contract, {as :'Contractor',foreignKey:'ContractorId'})
Contract.belongsTo(Profile, {as: 'Contractor'})
Profile.hasMany(Contract, {as : 'Client', foreignKey:'ClientId'})
Contract.belongsTo(Profile, {as: 'Client'})
Contract.hasMany(Job)
Job.belongsTo(Contract)

// ##########################
// Contract Scope
// ##########################
Contract.loadScopes = () => {
  Contract.addScope('client', {
    include: {
      model: Profile,
      as: 'Client',
      required: true,
    },
  });
  Contract.addScope('contractor', {
    include: {
      model: Profile,
      as: 'Contractor',
      required: true,
    },
  });
  Contract.addScope('isStatus', (status) => ({
    where: {
      status: status,
    },
  }));
  Contract.addScope('isNotStatus', (status) => ({
    where: {
      status: {
        [Op.not]: status //terminated
      },
    },
  }));
  Contract.addScope('byClinetId', (clientId) => ({
    where: {
      ClientId: clientId,
    },
  }));
  Contract.addScope('byContractorId', (contractorid) => ({
    where: {
      ContractorId: contractorid,
    }
  }));
  Contract.addScope('byId', (id) => ({
    where: {
      id,
    }
  }));
}
Contract.loadScopes();

// ##########################
// Job Scope
// ##########################
Job.loadScopes = () => {
  Job.addScope('contract', {
    include: {
      model: Contract,
      as: 'Contract',
      include: [
        {model: Profile, as: 'Client'},
        {model: Profile, as: 'Contractor'},
      ],
      required: true,
    },
  });
  Job.addScope('attribute', {
    attributes: [
      'id',
      'description',
      'price',
      'paid',
      'paymentDate',
      'createdAt',
      'updatedAt',
      'ContractId',
      [sequelize.fn("SUM", sequelize.col("price")), "total"]
    ]
  });
  Job.addScope('byId', (id) => ({
    where: {
      id,
    }
  }));
  Job.addScope('paid', (paid) => ({
    where: {
      paid: paid,
    }
  }));
  Job.addScope('contractStatus', (status) => ({
    include: {
      model: Contract,
      as: 'Contract',
      where: { status },
    },
  }));
  
  Job.addScope('contractContractorId', (contractorId) => ({
    include: {
      model: Contract,
      as: 'Contract',
      where: { 
        ContractorId: contractorId,
      },
    },
  }));
  Job.addScope('contractClientId', (clientId) => ({
    include: {
      model: Contract,
      as: 'Contract',
      where: { 
        ClientId: clientId,
      },
    },
  }));
}
Job.loadScopes();

// ##########################
// Profile Scope
// ##########################
Profile.loadScopes = () => {
  Profile.addScope('attribute', {
    attributes: [
      'id',
      'firstName',
      'lastName',
      'type',
      'profession',
      [sequelize.fn('SUM', sequelize.col('price')),'total']
    ]
  });
  Profile.addScope('byId', (id) => ({
    where: {
      id,
    }
  }));
  Profile.addScope('type', (type) => ({
    where: {
      type,
    }
  }));
  Profile.addScope('isJobPaidContractor', (paid, start, end) => ({
    include: [
      {
          model: Contract,
          as: 'Contractor',
          include: [
              {
                  model: Job,
                  where: {
                    paid,
                    ...(start && end ? {paymentDate: {
                      [Op.between]: [start, end]
                    }}: {})
                  }
              },
          ]
      },
  ],
  }));
  // ...(queryData.search ? { firstName : {
  //   [Op.like]: `%${queryData.search}%`,
  // } }: {}),
  Profile.addScope('isJobPaidClient', (paid, start, end) => ({
    include: [
      {
          model: Contract,
          as: 'Client',
          include: [
              {
                  model: Job,
                  where: {
                    paid,
                    ...(start && end ? {paymentDate: {
                      [Op.between]: [start, end]
                    }}: {})
                  }
              },
          ]
      },
  ],
  }));
  
}
Profile.loadScopes();


module.exports = {
  sequelize,
  Profile,
  Contract,
  Job
};
