import { sql } from "slonik";

export const up = sql.unsafe`
INSERT INTO roles (name) VALUES
('admin'),
('empleado'),
('cliente');
`;

export const down = sql.unsafe`
DELETE FROM roles`;
