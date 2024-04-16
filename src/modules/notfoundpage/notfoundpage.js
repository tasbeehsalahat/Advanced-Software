const notfoundpage = function(req, res) {
    return res.status(404).json({ message: "This page not found" });
};

module.exports = notfoundpage ;