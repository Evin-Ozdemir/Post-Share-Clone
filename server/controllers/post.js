const PostSchema = require("../modals/post");
const Auth = require("../modals/auth");
const { cloudinary } = require("../config/cloudinary");

const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;

    let query = {};
    if (category && category !== "all") {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const posts = await PostSchema.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("user", "username avatar")
      .populate("comments.user", "username avatar")
      .populate("comments.replies.user", "username avatar");

    const total = await PostSchema.countDocuments(query);

    res.status(200).json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await PostSchema.findById(id)
      .populate("user", "username avatar")
      .populate("comments.user", "username avatar")
      .populate("comments.replies.user", "username avatar");
    if (!post) {
      return res.status(404).json({ message: "Post bulunamadı" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const { user, title, description, category, tags } = req.body;

    const post = await PostSchema.create({
      user,
      title,
      description,
      image: "",
      category: category || "Genel",
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
    });

    const populatedPost = await PostSchema.findById(post._id)
      .populate("user", "username avatar")
      .populate("comments.user", "username avatar")
      .populate("comments.replies.user", "username avatar");
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const post = await PostSchema.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post bulunamadı" });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ likes: post.likes, isLiked: !isLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, text } = req.body;

    const post = await PostSchema.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post bulunamadı" });
    }

    const comment = {
      user,
      text,
      date: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const likeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req.body;

    const post = await PostSchema.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post bulunamadı" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Yorum bulunamadı" });
    }

    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      comment.likes = comment.likes.filter((id) => id !== userId);
    } else {
      comment.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ likes: comment.likes, isLiked: !isLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, tags } = req.body;

    let updateData = { title, description, category };

    if (tags) {
      updateData.tags = tags.split(",").map((tag) => tag.trim());
    }

    const updatePost = await PostSchema.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("user", "username avatar")
      .populate("comments.user", "username avatar")
      .populate("comments.replies.user", "username avatar");

    res.status(200).json(updatePost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await PostSchema.findById(id);

    if (post.image) {
      await cloudinary.uploader.destroy(
        post.image.split("/").pop().split(".")[0]
      );
    }

    await PostSchema.findByIdAndDelete(id);
    res.status(200).json({ msg: "Silme işlemi başarılı" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  likePost,
  addComment,
  likeComment,
  updatePost,
  deletePost,
};
