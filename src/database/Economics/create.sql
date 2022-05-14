
-- DROP TABLE IF EXISTS public."Economics";

CREATE TABLE IF NOT EXISTS public."Economics"
(
    record_id bigint unsigned NOT NULL,
    user_id bigint,
    balance int, -- balance type: reputation or social credit
    ---
    last_update timestamp with time zone,
    CONSTRAINT "Economics_pkey" PRIMARY KEY (record_id),
    CONSTRAINT snowflake_check CHECK (
        user_id::numeric >= 0::numeric AND
        user_id::numeric <= '9223372036854775808'::numeric
    ) NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Economics"
    OWNER to current_user;

COMMENT ON TABLE public."Guilds"
    IS 'To write...';

COMMENT ON CONSTRAINT snowflake_check ON public."Economics"
    IS 'snowflake value should be greater than or equal to 0 AND should be less than or equal to 9223372036854775807.';

