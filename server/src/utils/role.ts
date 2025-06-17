export const roleAvailable = (availableRoles:  ('OWNER' | 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'USER' | 'SELLER')[], role): boolean => {
  return availableRoles.includes(role);
};
