import { sql } from "slonik";

export const up = sql.unsafe`
CREATE TABLE roles (
  id SMALLSERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
`;

export const down = sql.unsafe`
DROP TABLE IF EXISTS roles;
`;
