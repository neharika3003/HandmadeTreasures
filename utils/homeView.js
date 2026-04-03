const Product = require("../models/Product");

const getTopPicks = async () => {
  const now = new Date();
  const hour = now.getHours();

  return Product.find({}).skip(hour % 10).limit(4);
};

const buildHomeViewModel = async (req, extra = {}) => {
  const topPicks = await getTopPicks();

  return {
    user: req.session.user,
    topPicks,
    authModal: null,
    ...extra,
  };
};

module.exports = {
  getTopPicks,
  buildHomeViewModel,
};
