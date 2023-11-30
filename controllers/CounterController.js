import Counters from '../models/CounterModel.js'

export const getCounter = async (req, res) => {
  try {
    const counter = await Counters.findAll({
      attributes: ['id', 'name', 'amount']
    })
    res.status(200).json(counter)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

export const getCounterById = async (req, res) => {
  try {
    const counter = await Counters.findOne({
      attributes: ['id', 'name', 'amount'],
      where: {
        id: req.params.id
      }
    })
    if (!counter) {
      return res.status(404).json({ msg: "Data counter not found!" })
    } else {
      return res.status(200).json(counter)
    }
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

export const createCounter = async (req, res) => {
  const { name, amount } = req.body
  try {
    await Counters.create({
      name,
      amount
    })
    res.status(200).json({ msg: "Data counter created successfully" })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

export const updateCounter = async (req, res) => {
  const counter = await Counters.findOne({
    where: {
      id: req.params.id
    }
  })
  if (!counter) return res.status(404).json({ msg: "Data counter not found" })
  const { name, amount } = req.body
  try {
    await Counters.update({
      name, amount
    }, {
      where: {
        id: counter.id
      }
    })
    res.status(200).json({ msg: "Data counter updated successfully" })
  } catch (error) {
    res.status(500).json({ msg: error.message })

  }
}

export const deleteCounter = async (req, res) => {
  const counter = await Counters.findOne({
    where: {
      id: req.params.id
    }
  })
  if (!counter) return res.status(404).json({ msg: "Data counter not found" })
  try {
    await Counters.destroy({
      where: {
        id: counter.id
      }
    })
    res.status(200).json({ msg: "Data counter deleted successfully" })
  } catch (error) {
    res.status(501).json({ msg: error.message })

  }
}