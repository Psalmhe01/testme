export default function (req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  next();
}
