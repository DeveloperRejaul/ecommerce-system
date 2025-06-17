
```bash
# create  new OWNER role user script . need to run on pg admin query tool
INSERT INTO public."Users" (
    id, name, email, phone, password, address, avatar, role, "shopId", "createdAt", "updatedAt"
) VALUES (
    '2221225f-6285-45bd-bfd3-4220fcf8ea2a', 
    'user', 
    'user@gmail.com', 
    '0123456789', 
    '$2b$10$w4p6QGfdWjxyNwXuZkryx.x5muucOSB2KmXC7O5X.IObTRbAFhLOm', -- this is encrypted password 123456
    'Dhaka, Bangladesh', 
    'https://example.com/avatar.jpg', 
    'OWNER', 
    NULL,  -- Replace with a valid "shopId" if needed
    '2025-02-03 12:00:33.507+06', 
   '2025-02-03 12:00:33.507+06'
);

# run docker command 
docker compose up --build

# docker off or remover all containers command
docker compose down 
```