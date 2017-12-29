'use strict';

import { SQLite } from 'expo';

const DROP_PAGES_TABLE_SQL = `DROP TABLE IF EXISTS pagestable;`;

const CREATE_PAGES_TABLE_SQL = `CREATE TABLE IF NOT EXISTS pagestable (
    name TEXT PRIMARY KEY NOT NULL,
    data TEXT);`;

const INSERT_OR_REPLACE_PAGE_SQL = `INSERT OR REPLACE INTO pagestable (name, data) VALUES (?, ?);`;

const SELECT_ALL_PAGES_SQL = `SELECT name, data FROM pagestable;`;


const DROP_CSS_TABLE_SQL = `DROP TABLE IF EXISTS csstable`;

const CREATE_CSS_TABLE_SQL = `CREATE TABLE IF NOT EXISTS csstable (
    name TEXT PRIMARY KEY NOT NULL,
    data TEXT);`;

const SELECT_ALL_CSS_SQL = `SELECT name, data FROM csstable;`;

const INSERT_OR_REPLACE_CSS_SQL = `INSERT OR REPLACE INTO csstable (name, data) VALUES (?, ?);`;

const dbname = `pages.db3`;
const version = 'version-ignored';
const description = 'description-ignored';
const size = 'size-ignored';

const db = SQLite.openDatabase(dbname, version, description, size);


export const DropPagesTable = () => {
    var p = new Promise( (resolve, reject) => {
        db.transaction(
            tx => {
                tx.executeSql(DROP_PAGES_TABLE_SQL, [], () => {}, (tx, err) => { reject(err); } );
            },
            (err) => {
                reject(err);
            },
            () => {
                resolve();
            }
        );
    });
    return p;
};


export const DropCssTable = () => {
    var p = new Promise( (resolve, reject) => {
        db.transaction(
            tx => {
                tx.executeSql(DROP_CSS_TABLE_SQL, [], () => {}, (tx, err) => { reject(err); } );
            },
            (err) => {
                reject(err);
            },
            () => {
                resolve();
            }
        );
    });
    return p;
};

export const DropLocalDB = () => {

    var p = new Promise( (resolve, reject) => {
        Promise.all([DropPagesTable(), DropCssTable()])
            .then(() => {
                resolve();
            })
            .catch(err => {
                reject(err);
            });
    });
    return p;
}

export const SetupLocalDB = () => {
    var p = new Promise( (resolve, reject) => {
        db.transaction(
            tx => {
                tx.executeSql(CREATE_PAGES_TABLE_SQL, [], () => {}, (tx, err) => { reject(err); } );
                tx.executeSql(CREATE_CSS_TABLE_SQL, [], () => {}, (tx, err) => { reject(err); } );
            },
            (err) => {
                reject(err);
            },
            () => {
                resolve();
            }
        );
    });
    return p;
};


export const InsertOrReplacePage = (name, data) => {
    var p = new Promise( (resolve, reject) => {
        let args = [
            name,
            data,
        ];
        db.transaction(
            tx => {
                tx.executeSql(INSERT_OR_REPLACE_PAGE_SQL, args, () => {}, (tx, err) => { reject(err) } )
            },
            (err) => { reject(err) },
            () => { resolve() }
        );
    });
    return p;
};


export const InsertOrReplaceCss = (name, data) => {
    var p = new Promise( (resolve, reject) => {
        let args = [
            name,
            data,
        ];
        db.transaction(
            tx => {
                tx.executeSql(INSERT_OR_REPLACE_CSS_SQL, args, () => {}, (tx, err) => { reject(err) } )
            },
            (err) => { reject(err) },
            () => { resolve() }
        )
    });
    return p;
};


export const GetAllCss = () => {
    var p = new Promise( (resolve, reject) => {
        var css = {};
        db.transaction(
            tx => {
                tx.executeSql(SELECT_ALL_CSS_SQL, [], (tx, rs) => {
                    if (rs.rows.length != 0) {
                        css = rs.rows._array.slice();
                    } else {
                        css = null;
                    }
                },
                (tx, err) => {
                    reject(err);
                })
            },
            (err) => {
                reject(err);
            },
            () => {
                resolve(css);
            }
        );
    });
    return p;
};


export const GetAllPages = () => {
    var p = new Promise( (resolve, reject) => {
        var pages = {};
        db.transaction(
            tx => {
                tx.executeSql(SELECT_ALL_PAGES_SQL, [], (tx, rs) => {
                    if (rs.rows.length != 0) {
                        pages = rs.rows._array.slice();
                    } else {
                        pages = null
                    }
                },
                (tx, err) => {
                    reject(err);
                })
            },
            (err) => {
                reject(err);
            },
            () => {
                resolve(pages);
            }
        );
    });
    return p;
};


export const LocalDBGetResources = () => {
    var p = new Promise( (resolve, reject) => {
        Promise.all([GetAllPages(), GetAllCss()])
            .then( results => {
                var pages = results[0];
                var css = results[1];
                var final_results = {}
                var cssdata = null;
                if (css != null) {
                    cssdata = css[0];
                } else {
                    cssdata = { name: 'css', data: null };
                }
                final_results = {
                    pages: pages,
                    css: cssdata
                };
                resolve(final_results);
            })
            .catch(err => {
                reject(err);
            })
    });
    return p;
};


export const LocalDBSaveResources = (pages, css) => {
    var p = new Promise( (resolve, reject) => {
        // pages and css have the form of [ { name: name1, data: data1 }, { name: name2, data: data2 }]

        let sqlpagescmds = pages.map(page => { return InsertOrReplacePage(page.name, page.data); });
        let sqlcsscmds = css.map(c => { return InsertOrReplaceCss(c.name, c.data); });

        Promise.all([sqlpagescmds, sqlcsscmds])
            .then( results => {
                resolve();
            })
            .catch( err => {
                reject(err);
            });
    });
    return p;       
};
