import { sql } from "slonik";

export const up = sql.unsafe`
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,

  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
`;

export const down = sql.unsafe`
DROP TABLE categories;
`;
