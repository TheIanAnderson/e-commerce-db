const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [
        {
          model: Product,
          through: ProductTag,
        },
      ],
    });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: "An error occurred while fetching tags." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tagId = req.params.id;
    const tag = await Tag.findByPk(tagId, {
      include: [
        {
          model: Product,
          through: ProductTag,
        },
      ],
    });

    if (tag) {
      res.json(tag);
    } else {
      res.status(404).json({ error: "Tag not found." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the tag." });
  }
});

router.post("/", async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the tag." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const tagId = req.params.id;
    const updatedTag = await Tag.update(
      {
        tag_name: req.body.tag_name,
      },
      {
        where: {
          id: tagId,
        },
      }
    );

    if (updatedTag[0] === 1) {
      res.status(200).json({ message: "Tag updated successfully." });
    } else {
      res.status(404).json({ error: "Tag not found." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the tag." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const tagId = req.params.id;
    const deletedTag = await Tag.destroy({
      where: {
        id: tagId,
      },
    });

    if (deletedTag === 1) {
      res.status(200).json({ message: "Tag deleted successfully." });
    } else {
      res.status(404).json({ error: "Tag not found." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the tag." });
  }
});

module.exports = router;
