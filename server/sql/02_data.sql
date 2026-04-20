COPY pages (page_id, page_namespace, page_title, page_is_redirect)
FROM '/docker-entrypoint-initdb.d/data/pages.tsv'
WITH (
    FORMAT text,
    DELIMITER E'\t',
    HEADER true
);

COPY category (cat_id, cat_title)
FROM '/docker-entrypoint-initdb.d/data/category.tsv'
WITH (
    FORMAT text,
    DELIMITER E'\t',
    HEADER true
);

COPY categorylinks (cl_from, cl_to)
FROM '/docker-entrypoint-initdb.d/data/categorylinks.tsv'
WITH (
    FORMAT text,
    DELIMITER E'\t',
    HEADER true
);