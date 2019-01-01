const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Story = mongoose.model("stories");
const User = mongoose.model("users");
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");

// Stories Index
router.get("/", (req, res) => {
  console.log(req.method + "  " + req.url);
  Story.find({ status: "public" })
    .populate("user")
    .sort({ date: "desc" })
    .then(stories => {
      res.render("stories/index", {
        stories: stories
      });
    });
});

// Show Single Story
router.get("/show/:id", (req, res) => {
  console.log(req.method + "  " + req.url);

  Story.findOne({
    _id: req.params.id
  })
    .populate("user")
    .populate("comments.commentUser")
    .then(story => {
      if (story.status == "public")
        res.render("stories/show", {
          story: story
        });
      else {
        if (req.user) {
          if (req.user.id == story.user._id) {
            res.redirect("/stories/show", {
              story: story
            });
          } else {
            res.redirect("/stories");
          }
        } else {
          res.redirect("/stories");
        }
      }
    });
});

//list stories form a user
router.get("/user/:userId", (req, res) => {
  Story.find({
    user: req.params.userId,
    status: "public"
  })
    .populate("user")
    .then(stories => {
      res.render("stories/index", {
        stories: stories
      });
    });
});

//logged in user's stories
router.get("/my", ensureAuthenticated, (req, res) => {
  Story.find({
    user: req.user.id
  })
    .populate("user")
    .then(stories => {
      res.render("stories/index", {
        stories: stories
      });
    });
});
// Add Story Form
router.get("/add", ensureAuthenticated, (req, res) => {
  console.log(req.method + "  " + req.url);

  res.render("stories/add");
});

// Edit Story Form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  console.log(req.method + "  " + req.url);

  Story.findOne({
    _id: req.params.id
  }).then(story => {
    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      res.render("stories/edit", {
        story: story
      });
    }
  });
});

// Process Add Story
router.post("/", (req, res) => {
  console.log(req.method + "  " + req.url);

  let allowComments;

  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  };

  // Create Story
  new Story(newStory).save().then(story => {
    console.log(req.method + "  " + req.url);

    res.redirect(`/stories/show/${story.id}`);
  });
});

//edit form proces
router.put("/:id", (req, res) => {
  console.log(req.method + "  " + req.url);

  Story.findOne({
    _id: req.params.id
  }).then(story => {
    let allowComments;

    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }
    //New values
    story.title = req.body.title;
    story.body = req.body.body;
    story.status = req.body.status;
    story.allowComments = allowComments;
    story.save().then(story => {
      res.redirect("/dashboard");
    });
  });
});

//delete story
router.delete("/:id", (req, res) => {
  console.log(req.method + "  " + req.url);

  Story.deleteOne({ _id: req.params.id }).then(() => {
    res.redirect("/dashboard");
  });
});

//add comment
router.post("/comment/:id", (req, res) => {
  console.log(req.method + "  " + req.url);

  Story.findOne({
    _id: req.params.id
  }).then(story => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    };

    //add to comments array
    story.comments.unshift(newComment);
    story.save().then(story => {
      res.resdirect(`/stories/show/${story.id}`);
    });
  });
});
module.exports = router;
