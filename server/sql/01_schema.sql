CREATE TABLE pages (
    page_id BIGINT PRIMARY KEY,
    page_namespace INTEGER,
    page_title TEXT,
    page_is_redirect INTEGER
);

CREATE TABLE category (
    cat_id BIGINT PRIMARY KEY,
    cat_title TEXT
);

CREATE TABLE categorylinks (
    cl_from BIGINT,
    cl_to BIGINT,
    PRIMARY KEY (cl_from, cl_to),
    FOREIGN KEY (cl_from) REFERENCES pages(page_id)
);