import { sql } from "@vercel/postgres";
import { ClinicConfig } from "../lib/types";

// Run this once to create the table — called from /api/setup
export async function createTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS clinic_configs (
      id            SERIAL PRIMARY KEY,
      clinic_name   TEXT NOT NULL UNIQUE,
      phone         TEXT,
      config        JSONB NOT NULL,
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      updated_at    TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // Index so lookups by clinic name are fast
  await sql`
    CREATE INDEX IF NOT EXISTS idx_clinic_name
    ON clinic_configs (clinic_name);
  `;
}

export async function upsertConfig(config: ClinicConfig): Promise<number> {
  const result = await sql`
    INSERT INTO clinic_configs (clinic_name, phone, config)
    VALUES (${config.clinicName}, ${config.phone}, ${JSON.stringify(config)}::jsonb)
    ON CONFLICT (clinic_name)
    DO UPDATE SET
      phone      = EXCLUDED.phone,
      config     = EXCLUDED.config,
      updated_at = NOW()
    RETURNING id;
  `;
  return result.rows[0].id;
}

export async function getConfigByName(name: string): Promise<ClinicConfig | null> {
  const result = await sql`
    SELECT config FROM clinic_configs
    WHERE clinic_name = ${name}
    LIMIT 1;
  `;
  if (!result.rows.length) return null;
  return result.rows[0].config as ClinicConfig;
}

export async function getAllConfigs(): Promise<
  { id: number; clinic_name: string; phone: string; updated_at: string }[]
> {
  const result = await sql`
    SELECT id, clinic_name, phone, updated_at
    FROM clinic_configs
    ORDER BY updated_at DESC;
  `;
  return result.rows as { id: number; clinic_name: string; phone: string; updated_at: string }[];
}

export async function getConfigById(id: number): Promise<ClinicConfig | null> {
  const result = await sql`
    SELECT config FROM clinic_configs WHERE id = ${id};
  `;
  if (!result.rows.length) return null;
  return result.rows[0].config as ClinicConfig;
}

export async function deleteConfig(id: number): Promise<void> {
  await sql`DELETE FROM clinic_configs WHERE id = ${id};`;
}
