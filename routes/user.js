router.get("/profile", ensureBuyer, (req, res) => {
    res.render("profile", { user: req.session.user });
  });
  
  router.post("/profile", ensureBuyer, async (req, res) => {
    try {
      const { name, email } = req.body;
      await User.findByIdAndUpdate(req.session.user._id, { name, email });
      req.session.user.name = name;
      req.session.user.email = email;
      res.redirect("/profile");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error updating profile");
    }
  });
  