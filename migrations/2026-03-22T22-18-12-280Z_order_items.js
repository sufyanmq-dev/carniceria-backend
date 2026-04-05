import { sql } from "slonik";

export const up = sql.unsafe`
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id UUID REFERENCES orders(id)
    ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity NUMERIC(10, 3) NOT NULL CHECK (quantity > 0),
  price_at_order NUMERIC(10, 2) NOT NULL CHECK (price_at_order >= 0),
  created_at TIMESTAMP DEFAULT NOW()
);
`;

export const down = sql.unsafe`
DROP TABLE order_items;
`;
