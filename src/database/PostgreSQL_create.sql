
CREATE TABLE IF NOT EXISTS public."Dicord_servers_meta"
(
    server_id integer NOT NULL,
    server_name character(1) COLLATE pg_catalog."default",
    invite_link character(1) COLLATE pg_catalog."default",
    is_alive boolean,
    CONSTRAINT "Dicord_servers_meta_pkey" PRIMARY KEY (server_id)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Dicord_servers_meta"
    OWNER to current_user;
