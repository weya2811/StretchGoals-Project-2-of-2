function requireRole(...allowedRoles) {
    return (req, res, next) => {
        // Check if user exists and has the required roles
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden" })
        }

        next(); // Continue to the route if the user has the required roles
    }
}

export default requireRole;