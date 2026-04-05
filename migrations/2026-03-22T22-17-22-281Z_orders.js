import { sql } from "slonik";

export const up = sql.unsafe`
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  
  status order_status NOT NULL DEFAULT 'pendiente',
  notes TEXT,
  total NUMERIC(10, 2) NOT NULL
    DEFAULT 0
    CHECK (total >= 0),
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()

);
`;

export const down = sql.unsafe`
DROP TABLE orders;
`;