import { sql } from "slonik";

export const up = sql.unsafe`
CREATE TYPE order_status AS ENUM (
    'pendiente',
    'en_preparacion',
    'entregado',
    'cancelado'
  );
`;

export const down = sql.unsafe`
DROP TYPE order_status;
`;