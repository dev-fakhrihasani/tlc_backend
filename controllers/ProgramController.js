import Programs from "../models/ProgramModel.js";

export const getProgram = async (req, res) => {
  try {
    const programs = await Programs.findAll();
    res.json(programs);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

export const createProgram = async (req, res) => {
  const { name } = req.body;
  try {
    await Programs.create({
      name
    });
    res.status(201).json({ msg: "Data program berhasil ditambah" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

export const updateProgram = async (req, res) => {
  const program = await Programs.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!program) return res.status(404).json({ msg: "Data tidak ditemukan" });
  const { name } = req.body;
  try {
    await Programs.update({
      name
    }, {
      where: {
        id: program.id
      }
    });
    res.status(200).json({ msg: "Data program berhasil diupdate" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

export const deleteProgram = async (req, res) => {
  const program = await Programs.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!program) return res.status(404).json({ msg: "Data tidak ditemukan" });
  try {
    await Programs.destroy({
      where: {
        id: program.id
      }
    });
    res.status(200).json({ msg: "Data program berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}