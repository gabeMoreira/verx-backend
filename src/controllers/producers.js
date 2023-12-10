const Producer = require('../models/producer');
const { cpf, cnpj } = require('cpf-cnpj-validator');
const db = require('../utils/database');

async function findAllProducers(req, res) {
  try {
      const producers = await Producer.findAll();
      res.status(200).json(producers);
  } catch (error) {
      res.status(500).json({ error: 'Error on find producers' });
  }
}

async function findProducerById(req, res) {
  const producerId = req.params.id;
  try {
      const producer = await Producer.findByPk(producerId);
      if (producer) {
          res.status(200).json(producer);
      } else {
          res.status(404).json({ error: 'Producer not found' });
      }
  } catch (error) {
      res.status(500).json({ error: 'Error to find producer by ID' });
  }
}

async function createProducer(req, res) {
    try {
        validateAreas(req.body);
        validateCpfCnpj(req.body.cpfOrCnpj);
        const newProducer = await Producer.create(req.body);
        res.status(201).json(newProducer);
    } catch (error) {
      if(error?.message) {
        res.status(400).json({ error: error?.message });
      }
      else res.status(500).json({message: "Error to create a new Producer" });
    }
}

async function updateProducer(req, res) {
    const producerId = req.params.id;
    try {
        const updatedProducer = await Producer.update(req.body, {
            where: { id: producerId },
            returning: true,
        });
        if(!updatedProducer[0]) res.status(200).json({message: "Producer not found or invalid field"});
        else res.status(200).json({message: "Producer updated successfully", producer: updatedProducer[1]});
    } catch (error) {
        res.status(500).json({ error: 'Error to update producer' });
    }
}

async function deleteProducer(req, res) {
  const producerId = req.params.id;
  try {
      const userDeleted = await Producer.destroy({
          where: { id: producerId }
      });
      if(!userDeleted) res.status(200).json({message: "Producer not found" });
      else res.status(200).json({message: "Producer deleted" });
  } catch (error) {
      res.status(500).json({ error: 'Error to delete producer' });
  }
}

function validateAreas(areas) {
  const { totalAreaHectares, cultivableAreaHectares, vegetationAreaHectares } = areas;
  if (cultivableAreaHectares + vegetationAreaHectares > totalAreaHectares) {
      throw new Error('The sum of cultivable area and vegetation cannot be greater than the total area of the farm');
  }
}

function validateCpfCnpj(cpfCnpj) {
    if (!cpf.isValid(cpfCnpj) && !cnpj.isValid(cpfCnpj)) {
        throw new Error("Invalid CPF or CNPJ");
    }
}

async function staticsDashboard(req, res) {
    try {
      const totalFarms = await Producer.count({
        distinct: true,
        col: 'farmName'
    });
        const totalHectares = await Producer.sum('totalAreaHectares');

        const farmsByState = await Producer.findAll({
            attributes: ['state', [db.fn('count', db.col('id')), 'count']],
            group: ['state']
        });

        const plantedCrops = await Producer.findAll({
          attributes: [
              [db.literal("unnest(\"plantedCrops\")"), 'cultura'],
              [db.fn('count', db.col('id')), 'quantidade']
          ],
          group: ['cultura']
      });

        const landUse = await Producer.findAll({
            attributes: [
                [db.fn('sum', db.col('cultivableAreaHectares')), 'totalCultivableArea'],
                [db.fn('sum', db.col('vegetationAreaHectares')), 'totalVegetationArea']
            ]
        });

        res.status(200).json({
            totalFarms,
            farmsByState,
            totalHectares,
            plantedCrops,
            landUse
        });
    } catch (error) {
        res.status(500).json({ error: 'Error to create dashboard data' });
    }
}

module.exports = {
  findAllProducers,
  findProducerById,
  createProducer,
  updateProducer,
  deleteProducer,
  staticsDashboard
};
