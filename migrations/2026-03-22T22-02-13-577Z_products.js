import { sql } from "slonik";

export const up = sql.unsafe`
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id INTEGER NOT NULL
    REFERENCES categories(id)
    ON DELETE RESTRICT,

  name VARCHAR(150) NOT NULL,
  description TEXT,

  price NUMERIC(10, 2) NOT NULL 
    CHECK (price >= 0),
  unit VARCHAR(10) NOT NULL 
    DEFAULT 'ud' 
    CHECK (unit IN ('kg', 'ud')),
  
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
`;

export const down = sql.unsafe`
DROP TABLE products;
`;
