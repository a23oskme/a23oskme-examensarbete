COPY pages (page_id, page_namespace, page_title, page_is_redirect)
FROM '/docker-entrypoint-initdb.d/pages.tsv'
WITH (
    FORMAT text,
    DELIMITER E'\t'
);

COPY linktarget (lt_id, lt_namespace, lt_title)
FROM '/docker-entrypoint-initdb.d/linktarget.tsv'
WITH (
    FORMAT text,
    DELIMITER E'\t'
);

COPY category (cat_id, cat_title)
FROM '/docker-entrypoint-initdb.d/category.tsv'
WITH (
    FORMAT text,
    DELIMITER E'\t'
);

COPY pagelinks (pl_from, pl_from_namespace, pl_target_id)
FROM '/docker-entrypoint-initdb.d/pagelinks.tsv'
WITH (
    FORMAT text,
    DELIMITER E'\t'
);

COPY categorylinks (cl_from, cl_to)
FROM '/docker-entrypoint-initdb.d/categorylinks.tsv'
WITH (
    FORMAT text,
    DELIMITER E'\t'
);