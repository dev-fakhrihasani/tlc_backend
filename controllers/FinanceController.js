import Finances from "../models/FinanceModel.js";

export const getFinance = async (req, res) => {
  try {
    const finance = await Finances.findAll({
      attributes: ['id', 'income', 'outcome']
    });
    res.status(200).json(finance);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

export const getFinanceById = async (req, res) => {
  try {
    const finance = await Finances.findOne({
      attributes: ['id', 'income', 'outcome'],
      where: {
        id: req.params.id
      }
    })
    res.status(200).json(finance)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

export const createFinance = async (req, res) => {
  const { income, outcome } = req.body
  try {
    await Finances.create({
      income, outcome
    })
    res.status(201).json({ msg: "Berhasil menambah pemasukan" })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

export const updateFinance = async (req, res) => {
  const finance = await Finances.findOne({
    where: {
      id: req.params.id
    }
  })
  if (!finance) return res.status(400).json({ msg: "Data tidak ditemukan" })
  const { month, income, outcome } = req.body
  try {
    await Finances.update({
      month, income, outcome
    }, {
      where: {
        id: finance.id
      }
    })
    res.status(201).json({ msg: "Data berhasil di-update" })
  } catch (error) {
    res.status(500).json({ msg: error.msg })
  }
}

export const deleteFinance = async (req, res) => {
  const finance = await Finances.findOne({
    where: {
      id: req.params.id
    }
  })
  if (!finance) return res.status(404).json({ msg: "Data tidak ditemukan" })
  try {
    await Finances.destroy({
      where: {
        id: finance.id
      }
    })
    res.status(200).json({ msg: "Data berhasil dihapus" })
  } catch (error) {
    res.status(500).json({ msg: error.message })

  }
}