const canModify = (user, ownerId) =>
  user.role === "admin" || Number(ownerId) === user.id;

export default canModify;