
-- DROP TABLE IF EXISTS public."Dicord_servers_meta";

CREATE TABLE IF NOT EXISTS public."Dicord_servers_meta"
(
    server_id integer NOT NULL,
    server_name character(102) COLLATE pg_catalog."default",
    invite_link character(20) COLLATE pg_catalog."default",
    is_alive boolean,
    last_update timestamp with time zone,
    CONSTRAINT "Dicord_servers_meta_pkey" PRIMARY KEY (server_id),
    CONSTRAINT valid_server_id CHECK (server_id >= 0 AND server_id::numeric <= '9223372036854775808'::numeric) NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Dicord_servers_meta"
    OWNER to current_user;

COMMENT ON CONSTRAINT valid_server_id ON public."Dicord_servers_meta"
    IS 'snowflake value should be greater than or equal to 0 AND should be less than or equal to 9223372036854775807.';

