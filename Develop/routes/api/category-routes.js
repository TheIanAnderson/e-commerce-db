const router = require("express").Router();
const { Category, Product } = require("../../models");

router.get("/", async (req, res) => {
  const catergoriesData = await Category.findAll().catch((err) => {
    res.json(err);
  });
  res.json(catergoriesData);
});

router.get("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    const categoryData = await Category.findByPk(categoryId, {
      include: Product,
    });

    if (categoryData) {
      res.json(categoryData);
    } else {
      res.status(404).json({ error: "Category not found." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the category." });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedCategory = await Category.update(
      {
        name: req.body.name,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (updatedCategory[0] === 1) {
      res.status(200).json({ message: "Category updated successfully." });
    } else {
      res.status(404).json({ error: "Category not found." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the category." });
  }
});

router.delete("/:category_name", async (req, res) => {
  try {
    const categoryName = req.params.category_name;

    const category = await Category.findOne({
      where: {
        category_name: categoryName,
      },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found." });
    }

    await Product.destroy({
      where: {
        category_id: category.id,
      },
    });

    await Category.destroy({
      where: {
        category_name: categoryName,
      },
    });

    res.status(200).json({
      message: "Category and associated products deleted successfully.",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the category." });
  }
});

module.exports = router;
