const Finances = require("../models/FinanceModel.js");

const getFinance = async (req, res) => {
  try {
    const finance = await Finances.findAll({
      attributes: ['id', 'month', 'income', 'outcome']
    });
    res.status(200).json(finance);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

const getFinanceById = async (req, res) => {
  try {
    const finance = await Finances.findOne({
      attributes: ['id', 'month', 'income', 'outcome'],
      where: {
        id: req.params.id
      }
    })
    if (!finance) return res.status(404).json({ msg: "Data finance not found!" })
    res.status(200).json(finance)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

const createFinance = async (req, res) => {
  const { month, income, outcome } = req.body
  try {
    await Finances.create({
      month, income, outcome
    })
    res.status(201).json({ msg: "Data finance created successfully" })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

const updateFinance = async (req, res) => {
  const finance = await Finances.findOne({
    where: {
      id: req.params.id
    }
  })
  if (!finance) return res.status(400).json({ msg: "Data finance not found" })
  const { month, income, outcome } = req.body
  try {
    await Finances.update({
      month, income, outcome
    }, {
      where: {
        id: finance.id
      }
    })
    res.status(201).json({ msg: "Data finance updated" })
  } catch (error) {
    res.status(500).json({ msg: error.msg })
  }
}

const deleteFinance = async (req, res) => {
  const finance = await Finances.findOne({
    where: {
      id: req.params.id
    }
  })
  if (!finance) return res.status(404).json({ msg: "Data finance not found" })
  try {
    await Finances.destroy({
      where: {
        id: finance.id
      }
    })
    res.status(200).json({ msg: "Data finance deleted" })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

module.exports = {
  getFinance,
  getFinanceById,
  createFinance,
  updateFinance,
  deleteFinance
}