const AuthSchema = require("../modals/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { cloudinary } = require("../config/cloudinary");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await AuthSchema.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ message: "Böyle bir kullanıcı zaten mevcut" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Şifre en az 6 karakter olmalıdır" });
    }
    const passwordHash = await bcrypt.hash(password, 12);

    if (!isEmail(email)) {
      return res.status(400).json({ message: "Geçersiz email adresi" });
    }

    const newUser = await AuthSchema.create({
      username,
      email,
      password: passwordHash,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({
      message: "Kullanıcı başarıyla oluşturuldu",
      user: newUser,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AuthSchema.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Böyle bir kullanıcı yok" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Şifre yanlış" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Giriş başarılı", user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await AuthSchema.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, bio } = req.body;

    let updateData = { username, bio };

    if (req.file) {
      updateData.avatar = req.file.path;
    }

    const user = await AuthSchema.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const followUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (id === userId) {
      return res.status(400).json({ message: "Kendinizi takip edemezsiniz" });
    }

    const userToFollow = await AuthSchema.findById(id);
    const currentUser = await AuthSchema.findById(userId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(
        (followId) => followId !== id
      );
      userToFollow.followers = userToFollow.followers.filter(
        (followerId) => followerId !== userId
      );
    } else {
      currentUser.following.push(id);
      userToFollow.followers.push(userId);

      // Add notification
      userToFollow.notifications.push({
        type: "follow",
        from: userId,
        read: false,
      });
    }

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({
      isFollowing: !isFollowing,
      followersCount: userToFollow.followers.length,
      followingCount: currentUser.following.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await AuthSchema.findById(id).select("notifications");

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    const unreadCount = user.notifications.filter((n) => !n.read).length;

    res.status(200).json({
      notifications: user.notifications.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      ),
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { notificationId } = req.body;

    const user = await AuthSchema.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    const notification = user.notifications.id(notificationId);
    if (notification) {
      notification.read = true;
      await user.save();
    }

    res.status(200).json({ message: "Bildirim okundu olarak işaretlendi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await AuthSchema.find({}).select("username _id avatar");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function isEmail(email) {
  let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return false;
  }
  if (!regex.test(email)) {
    return false;
  }
  return true;
}

module.exports = {
  register,
  login,
  getUserProfile,
  updateProfile,
  followUser,
  getNotifications,
  markNotificationAsRead,
  getAllUsers,
};
