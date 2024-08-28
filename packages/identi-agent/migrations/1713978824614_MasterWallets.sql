CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "blockchain"."MasterWallets" (
  id_wallet VARCHAR(255),
  did VARCHAR(255),
  crypto_wallet_kid VARCHAR(255),
  voice_biometric VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  disabled_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  CONSTRAINT "MasterWallets_pkey" PRIMARY KEY ("id_wallet")
);

CREATE TYPE "blockchain"."e_transactions_status" AS ENUM (
  'PENDING',
  'SUCCESS',
  'FAIL',
  'REVERTED'
);

CREATE TABLE "blockchain"."Transactions" (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  from_wallet_id VARCHAR(255) NOT NULL,
  to_wallet_id VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  transaction_hash VARCHAR(255),
  "status" "blockchain"."e_transactions_status" DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  disabled_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Transactions_from_wallet_id_fkey" FOREIGN KEY ("from_wallet_id")
    REFERENCES "blockchain"."MasterWallets"("id_wallet") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
  CONSTRAINT "Transactions_to_wallet_id_fkey" FOREIGN KEY ("to_wallet_id")
    REFERENCES "blockchain"."MasterWallets"("id_wallet") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);

-- create a table for store SSI roles
CREATE TYPE "blockchain"."e_ssi_roles" AS ENUM ('ISSUER','VERIFIER');

CREATE TABLE "blockchain"."SSIRoles" (
	"id" varchar(12) NOT NULL DEFAULT to_hex(floor(date_part('epoch'::text, now()) * 10000::double precision)::bigint),
  wallet_id VARCHAR(255) NOT NULL,
  "role" "blockchain"."e_ssi_roles" NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  disabled_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  CONSTRAINT "SSIRoles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "SSIRoles_wallet_id_fkey" FOREIGN KEY ("wallet_id")
    REFERENCES "blockchain"."MasterWallets"("id_wallet") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);
