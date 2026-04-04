CREATE TABLE pages (
    page_id BIGINT PRIMARY KEY,
    page_namespace INTEGER,
    page_title TEXT,
    page_is_redirect INTEGER
);

CREATE TABLE linktarget (
    lt_id BIGINT PRIMARY KEY,
    lt_namespace INTEGER,
    lt_title TEXT
);

CREATE TABLE category (
    cat_id BIGINT PRIMARY KEY,
    cat_title TEXT
);

CREATE TABLE pagelinks (
    pl_from BIGINT,
    pl_from_namespace INTEGER,
    pl_target_id BIGINT,
    PRIMARY KEY (pl_from, pl_target_id),
    FOREIGN KEY (pl_from) REFERENCES pages(page_id),
    FOREIGN KEY (pl_target_id) REFERENCES linktarget(lt_id)
);

CREATE TABLE categorylinks (
    cl_from BIGINT,
    cl_to BIGINT,
    PRIMARY KEY (cl_from, cl_to),
    FOREIGN KEY (cl_from) REFERENCES pages(page_id)
);